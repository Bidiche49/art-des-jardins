import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import { RelanceLevel } from '@art-et-jardin/database';
import { RelanceConfig, FactureToRelance, RelanceResult, RelanceStats } from './relances.types';

@Injectable()
export class RelancesService {
  private readonly logger = new Logger(RelancesService.name);
  private readonly config: RelanceConfig;

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private audit: AuditService,
    private configService: ConfigService,
  ) {
    this.config = {
      enabled: this.configService.get('RELANCE_ENABLED') === 'true',
      j1: parseInt(this.configService.get('RELANCE_J1') || '30', 10),
      j2: parseInt(this.configService.get('RELANCE_J2') || '45', 10),
      j3: parseInt(this.configService.get('RELANCE_J3') || '60', 10),
    };
  }

  getConfig(): RelanceConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Calcule le nombre de jours de retard d'une facture
   */
  calculateDaysOverdue(dateEcheance: Date): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const echeance = new Date(dateEcheance);
    echeance.setHours(0, 0, 0, 0);
    const diffMs = now.getTime() - echeance.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Determine le niveau de relance suivant en fonction du retard et de la derniere relance
   */
  determineNextLevel(joursRetard: number, lastLevel: RelanceLevel | null): RelanceLevel | null {
    const { j1, j2, j3 } = this.config;

    // Pas encore en retard suffisant
    if (joursRetard < j1) {
      return null;
    }

    // Premiere relance
    if (!lastLevel && joursRetard >= j1) {
      return 'rappel_amical';
    }

    // Deuxieme relance
    if (lastLevel === 'rappel_amical' && joursRetard >= j2) {
      return 'rappel_ferme';
    }

    // Troisieme relance (mise en demeure)
    if (lastLevel === 'rappel_ferme' && joursRetard >= j3) {
      return 'mise_en_demeure';
    }

    // Deja au niveau max ou pas assez de retard pour le niveau suivant
    return null;
  }

  /**
   * Recupere les factures en retard eligibles aux relances
   */
  async getUnpaidFactures(): Promise<FactureToRelance[]> {
    const factures = await this.prisma.facture.findMany({
      where: {
        statut: 'envoyee',
        dateEcheance: { lt: new Date() },
        excludeRelance: false,
      },
      include: {
        devis: {
          include: {
            chantier: {
              include: {
                client: {
                  select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    excludeRelance: true,
                  },
                },
              },
            },
          },
        },
        relances: {
          orderBy: { sentAt: 'desc' },
          take: 1,
        },
      },
    });

    return factures
      .filter((f) => !f.devis.chantier.client.excludeRelance)
      .map((f) => ({
        id: f.id,
        numero: f.numero,
        dateEcheance: f.dateEcheance,
        totalTTC: f.totalTTC,
        joursRetard: this.calculateDaysOverdue(f.dateEcheance),
        client: f.devis.chantier.client,
        lastRelance: f.relances[0]
          ? { level: f.relances[0].level, sentAt: f.relances[0].sentAt }
          : null,
      }));
  }

  /**
   * Envoie une relance pour une facture
   */
  async sendRelance(
    factureId: string,
    level: RelanceLevel,
    userId?: string,
    manual = false,
  ): Promise<RelanceResult> {
    const facture = await this.prisma.facture.findUnique({
      where: { id: factureId },
      include: {
        devis: {
          include: {
            chantier: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    });

    if (!facture) {
      throw new NotFoundException(`Facture ${factureId} non trouvee`);
    }

    if (facture.statut !== 'envoyee') {
      throw new BadRequestException(`Facture ${facture.numero} non eligible (statut: ${facture.statut})`);
    }

    const client = facture.devis.chantier.client;
    const clientName = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;
    const joursRetard = this.calculateDaysOverdue(facture.dateEcheance);

    try {
      // Envoyer l'email avec le bon template
      const emailSent = await this.sendRelanceEmail(
        client.email,
        facture.numero,
        clientName,
        facture.totalTTC,
        joursRetard,
        level,
        facture.id,
      );

      // Logger dans RelanceHistory
      const relance = await this.prisma.relanceHistory.create({
        data: {
          factureId: facture.id,
          level,
          joursRetard,
          montantDu: facture.totalTTC,
          success: emailSent,
          errorMessage: emailSent ? null : 'Email sending failed',
        },
      });

      // Audit log
      await this.audit.log({
        userId,
        action: manual ? 'RELANCE_MANUAL' : 'RELANCE_AUTO',
        entite: 'Facture',
        entiteId: facture.id,
        details: {
          factureNumero: facture.numero,
          level,
          joursRetard,
          montantDu: facture.totalTTC,
          clientEmail: client.email,
        },
      });

      this.logger.log(
        `Relance ${level} envoyee pour facture ${facture.numero} (${joursRetard}j retard)`,
      );

      return { success: emailSent, emailId: relance.id };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Erreur relance facture ${facture.numero}: ${err.message}`);

      // Logger l'echec
      await this.prisma.relanceHistory.create({
        data: {
          factureId: facture.id,
          level,
          joursRetard,
          montantDu: facture.totalTTC,
          success: false,
          errorMessage: err.message,
        },
      });

      return { success: false, error: err.message };
    }
  }

  /**
   * Envoie l'email de relance avec le template approprie
   */
  private async sendRelanceEmail(
    to: string,
    factureNumero: string,
    clientName: string,
    montant: number,
    joursRetard: number,
    level: RelanceLevel,
    factureId: string,
  ): Promise<boolean> {
    const templates = this.getEmailTemplates(level, factureNumero, clientName, montant, joursRetard);

    return this.mail.sendMail({
      to,
      subject: templates.subject,
      html: templates.html,
      documentType: 'relance',
      documentId: factureId,
      templateName: `relance_${level}`,
    });
  }

  /**
   * Genere les templates d'email selon le niveau de relance
   */
  private getEmailTemplates(
    level: RelanceLevel,
    factureNumero: string,
    clientName: string,
    montant: number,
    joursRetard: number,
  ): { subject: string; html: string } {
    const montantFormate = montant.toFixed(2);

    switch (level) {
      case 'rappel_amical':
        return {
          subject: `Rappel aimable - Facture ${factureNumero}`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .info-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Art & Jardin</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Rappel de paiement</p>
    </div>
    <div class="content">
      <p>Bonjour ${clientName},</p>

      <div class="info-box">
        <strong>Rappel aimable</strong><br>
        Sauf erreur de notre part, nous n'avons pas encore recu le reglement de la facture ci-dessous.
      </div>

      <div class="details">
        <p><strong>Facture N°:</strong> ${factureNumero}</p>
        <p><strong>Montant TTC:</strong> ${montantFormate} EUR</p>
        <p><strong>Retard:</strong> ${joursRetard} jours</p>
      </div>

      <p>Si vous avez deja procede au reglement, nous vous prions de ne pas tenir compte de ce message.</p>

      <p>Dans le cas contraire, nous vous remercions de bien vouloir regulariser cette situation dans les meilleurs delais.</p>

      <p>Cordialement,<br><strong>L'equipe Art & Jardin</strong></p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
    </div>
  </div>
</body>
</html>
          `,
        };

      case 'rappel_ferme':
        return {
          subject: `Second rappel - Facture ${factureNumero} en attente`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .warning-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Art & Jardin</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Second rappel</p>
    </div>
    <div class="content">
      <p>Bonjour ${clientName},</p>

      <div class="warning-box">
        <strong>Second rappel</strong><br>
        Malgre notre precedent rappel, nous constatons que votre facture reste impayee.
      </div>

      <div class="details">
        <p><strong>Facture N°:</strong> ${factureNumero}</p>
        <p><strong>Montant TTC:</strong> ${montantFormate} EUR</p>
        <p><strong>Retard:</strong> ${joursRetard} jours</p>
      </div>

      <p>Nous vous demandons de bien vouloir regulariser cette situation <strong>dans les plus brefs delais</strong>.</p>

      <p>Si vous rencontrez des difficultes de paiement, nous vous invitons a nous contacter afin de trouver une solution ensemble.</p>

      <p>A defaut de reglement sous 15 jours, nous serons contraints d'engager des poursuites.</p>

      <p>Cordialement,<br><strong>L'equipe Art & Jardin</strong></p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
    </div>
  </div>
</body>
</html>
          `,
        };

      case 'mise_en_demeure':
        return {
          subject: `MISE EN DEMEURE - Facture ${factureNumero}`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .danger-box { background: #f8d7da; border: 2px solid #dc3545; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #ddd; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 8px 8px; }
    .legal { font-size: 11px; color: #666; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">MISE EN DEMEURE</h1>
    </div>
    <div class="content">
      <p><strong>${clientName},</strong></p>

      <div class="danger-box">
        <strong>DERNIER AVERTISSEMENT AVANT POURSUITES</strong><br><br>
        Malgre nos precedents rappels restes sans effet, nous avons le regret de constater que votre facture demeure impayee.
      </div>

      <div class="details">
        <p><strong>Facture N°:</strong> ${factureNumero}</p>
        <p><strong>Montant TTC:</strong> ${montantFormate} EUR</p>
        <p><strong>Retard:</strong> ${joursRetard} jours</p>
      </div>

      <p>Par la presente, nous vous mettons <strong>formellement en demeure</strong> de nous regler la somme de <strong>${montantFormate} EUR</strong> dans un delai de <strong>8 jours</strong> a compter de la reception de ce courrier.</p>

      <p>A defaut de paiement dans ce delai, nous transmettrons le dossier a notre service contentieux et engagerons toutes les procedures judiciaires necessaires au recouvrement de notre creance, ce qui entrainera des frais supplementaires a votre charge.</p>

      <p>Veuillez agreer l'expression de nos salutations distinguees.</p>

      <p><strong>Art & Jardin</strong></p>

      <p class="legal">
        Cette mise en demeure est faite conformement aux articles 1344 et suivants du Code civil.
        Le present courrier constitue une mise en demeure au sens de l'article 1344 du Code civil.
      </p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
    </div>
  </div>
</body>
</html>
          `,
        };
    }
  }

  /**
   * Recupere l'historique des relances d'une facture
   */
  async getRelanceHistory(factureId: string) {
    return this.prisma.relanceHistory.findMany({
      where: { factureId },
      orderBy: { sentAt: 'desc' },
    });
  }

  /**
   * Recupere toutes les relances planifiees (factures qui vont recevoir une relance)
   */
  async getPlannedRelances() {
    const factures = await this.getUnpaidFactures();

    return factures
      .map((f) => {
        const nextLevel = this.determineNextLevel(
          f.joursRetard,
          f.lastRelance?.level || null,
        );
        return nextLevel ? { ...f, nextLevel } : null;
      })
      .filter((f) => f !== null);
  }

  /**
   * Annule les relances pour une facture (l'exclut des relances auto)
   */
  async cancelRelances(factureId: string, userId?: string) {
    const facture = await this.prisma.facture.update({
      where: { id: factureId },
      data: { excludeRelance: true },
    });

    await this.audit.log({
      userId,
      action: 'RELANCE_CANCEL',
      entite: 'Facture',
      entiteId: factureId,
      details: { factureNumero: facture.numero },
    });

    return facture;
  }

  /**
   * Reactive les relances pour une facture
   */
  async enableRelances(factureId: string, userId?: string) {
    const facture = await this.prisma.facture.update({
      where: { id: factureId },
      data: { excludeRelance: false },
    });

    await this.audit.log({
      userId,
      action: 'RELANCE_ENABLE',
      entite: 'Facture',
      entiteId: factureId,
      details: { factureNumero: facture.numero },
    });

    return facture;
  }

  /**
   * Statistiques des relances
   */
  async getStats(): Promise<RelanceStats> {
    const [total, byLevel, recentSuccess, recentFailed] = await Promise.all([
      this.prisma.relanceHistory.count(),
      this.prisma.relanceHistory.groupBy({
        by: ['level'],
        _count: true,
      }),
      this.prisma.relanceHistory.count({
        where: {
          success: true,
          sentAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.relanceHistory.count({
        where: {
          success: false,
          sentAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const planned = await this.getPlannedRelances();

    return {
      total,
      byLevel: byLevel.reduce(
        (acc, item) => ({ ...acc, [item.level]: item._count }),
        {} as Record<string, number>,
      ),
      last30Days: {
        success: recentSuccess,
        failed: recentFailed,
      },
      planned: planned.length,
      config: this.config,
    };
  }
}
