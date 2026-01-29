import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { SendSignatureRequestDto, SignDevisDto } from './dto';

interface SignatureTokenPayload {
  devisId: string;
  type: 'signature';
}

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);
  private readonly signatureTokenExpiry = '7d';
  private readonly frontendUrl: string;
  private readonly patronEmail: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private pdfService: PdfService,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://artjardin.fr';
    this.patronEmail = this.configService.get<string>('PATRON_EMAIL') || '';
  }

  /**
   * Envoie une demande de signature par email
   */
  async sendSignatureRequest(devisId: string, dto: SendSignatureRequestDto) {
    // Recuperer le devis avec client
    const devis = await this.prisma.devis.findUnique({
      where: { id: devisId },
      include: {
        chantier: {
          include: {
            client: true,
          },
        },
        lignes: { orderBy: { ordre: 'asc' } },
        signature: true,
      },
    });

    if (!devis) {
      throw new NotFoundException('Devis non trouve');
    }

    // Verifier que le devis n'est pas deja signe
    if (devis.signature) {
      throw new BadRequestException('Ce devis a deja ete signe');
    }

    // Verifier que le statut permet l'envoi
    if (!['brouillon', 'envoye'].includes(devis.statut)) {
      throw new BadRequestException(
        `Impossible d'envoyer une demande de signature pour un devis au statut "${devis.statut}"`,
      );
    }

    const client = devis.chantier.client;
    const email = dto.email || client.email;

    // Generer le token de signature
    const token = await this.generateSignatureToken(devisId);
    const signatureUrl = `${this.frontendUrl}/signer/${token}`;

    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Creer ou mettre a jour l'entree signature (sans signature pour l'instant)
    await this.prisma.signatureDevis.upsert({
      where: { devisId },
      create: {
        devisId,
        token,
        imageBase64: '', // Sera rempli lors de la signature
        expiresAt,
        ipAddress: '',
        userAgent: '',
        cgvAccepted: false,
      },
      update: {
        token,
        expiresAt,
        imageBase64: '',
        ipAddress: '',
        userAgent: '',
        cgvAccepted: false,
      },
    });

    // Mettre a jour le statut du devis
    await this.prisma.devis.update({
      where: { id: devisId },
      data: { statut: 'envoye' },
    });

    // Envoyer l'email
    await this.mailService.sendMail({
      to: email,
      subject: `Devis N° ${devis.numero} - Art & Jardin`,
      html: this.buildSignatureRequestEmail(
        client.prenom || client.nom,
        devis.numero,
        devis.totalTTC,
        signatureUrl,
        dto.message,
      ),
    });

    return {
      success: true,
      message: 'Demande de signature envoyee',
      email,
      expiresAt,
    };
  }

  /**
   * Recupere les details d'un devis pour signature (public)
   */
  async getDevisForSignature(token: string) {
    // Verifier le token
    const signature = await this.prisma.signatureDevis.findUnique({
      where: { token },
      include: {
        devis: {
          include: {
            chantier: {
              include: {
                client: {
                  select: {
                    nom: true,
                    prenom: true,
                    adresse: true,
                    codePostal: true,
                    ville: true,
                  },
                },
              },
            },
            lignes: { orderBy: { ordre: 'asc' } },
          },
        },
      },
    });

    if (!signature) {
      throw new NotFoundException('Lien de signature invalide');
    }

    // Verifier l'expiration
    if (new Date() > signature.expiresAt) {
      throw new ForbiddenException('Ce lien de signature a expire');
    }

    // Verifier si deja signe
    if (signature.imageBase64) {
      return {
        alreadySigned: true,
        signedAt: signature.signedAt,
        devis: this.formatDevisForPublic(signature.devis),
      };
    }

    return {
      alreadySigned: false,
      devis: this.formatDevisForPublic(signature.devis),
    };
  }

  /**
   * Enregistre la signature du devis (public)
   */
  async signDevis(
    token: string,
    dto: SignDevisDto,
    ipAddress: string,
    userAgent: string,
  ) {
    // Verifier le token
    const signature = await this.prisma.signatureDevis.findUnique({
      where: { token },
      include: {
        devis: {
          include: {
            chantier: {
              include: {
                client: true,
              },
            },
            lignes: {
              orderBy: { ordre: 'asc' },
            },
          },
        },
      },
    });

    if (!signature) {
      throw new NotFoundException('Lien de signature invalide');
    }

    // Verifier l'expiration
    if (new Date() > signature.expiresAt) {
      throw new ForbiddenException('Ce lien de signature a expire');
    }

    // Verifier si deja signe
    if (signature.imageBase64) {
      throw new BadRequestException('Ce devis a deja ete signe');
    }

    // Verifier l'acceptation des CGV
    if (!dto.cgvAccepted) {
      throw new BadRequestException('Vous devez accepter les conditions generales');
    }

    // Valider le format base64
    if (!dto.signatureBase64.startsWith('data:image/')) {
      throw new BadRequestException('Format de signature invalide');
    }

    const now = new Date();

    // Enregistrer la signature
    await this.prisma.$transaction([
      // Mettre a jour SignatureDevis
      this.prisma.signatureDevis.update({
        where: { token },
        data: {
          imageBase64: dto.signatureBase64,
          signedAt: now,
          ipAddress,
          userAgent,
          cgvAccepted: dto.cgvAccepted,
        },
      }),
      // Mettre a jour le Devis
      this.prisma.devis.update({
        where: { id: signature.devisId },
        data: {
          statut: 'signe',
          dateAcceptation: now,
          signatureClient: dto.signatureBase64,
        },
      }),
      // Log audit
      this.prisma.auditLog.create({
        data: {
          action: 'SIGNATURE_DEVIS',
          entite: 'devis',
          entiteId: signature.devisId,
          ipAddress,
          userAgent,
          details: {
            devisNumero: signature.devis.numero,
            clientEmail: signature.devis.chantier.client.email,
          },
        },
      }),
    ]);

    // Generer le PDF signe
    const client = signature.devis.chantier.client;
    const chantier = signature.devis.chantier;
    const devis = signature.devis;
    const clientName = client.prenom
      ? `${client.prenom} ${client.nom}`
      : client.nom;

    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await this.pdfService.generateDevis({
        numero: devis.numero,
        dateCreation: devis.dateEmission,
        dateValidite: devis.dateValidite,
        client: {
          nom: client.nom,
          prenom: client.prenom || undefined,
          adresse: client.adresse,
          codePostal: client.codePostal,
          ville: client.ville,
          email: client.email,
        },
        lignes: (devis as any).lignes?.map((l: any) => ({
          designation: l.description,
          quantite: Number(l.quantite),
          unite: l.unite,
          prixUnitaire: Number(l.prixUnitaireHT),
          montantHT: Number(l.montantHT),
        })) || [],
        totalHT: Number(devis.totalHT),
        tauxTVA: 20,
        montantTVA: Number(devis.totalTVA),
        totalTTC: Number(devis.totalTTC),
        notes: devis.notes || undefined,
        signature: {
          imageBase64: dto.signatureBase64,
          signedAt: now,
          ipAddress,
          reference: `SIG-${signature.id.substring(0, 8).toUpperCase()}`,
        },
      });
    } catch (error) {
      this.logger.error('Failed to generate signed PDF', error);
    }

    // Envoyer l'email de confirmation au client avec PDF en piece jointe
    if (pdfBuffer) {
      await this.mailService.sendSignatureConfirmation(
        client.email,
        clientName,
        devis.numero,
        Number(devis.totalTTC),
        now,
        pdfBuffer,
      );
    } else {
      // Fallback: email sans piece jointe
      await this.mailService.sendMail({
        to: client.email,
        subject: `Confirmation signature - Devis N° ${devis.numero}`,
        html: this.buildSignatureConfirmationEmail(
          client.prenom || client.nom,
          devis.numero,
          Number(devis.totalTTC),
          now,
        ),
      });
    }

    // Envoyer notification au patron
    if (this.patronEmail) {
      await this.mailService.sendSignatureNotification(
        this.patronEmail,
        clientName,
        devis.numero,
        Number(devis.totalTTC),
        now,
        chantier.description || '',
      );
    }

    return {
      success: true,
      message: 'Devis signe avec succes',
      signedAt: now,
    };
  }

  /**
   * Genere un token JWT pour la signature
   */
  private async generateSignatureToken(devisId: string): Promise<string> {
    const payload: SignatureTokenPayload = {
      devisId,
      type: 'signature',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.signatureTokenExpiry,
    });
  }

  /**
   * Formate le devis pour l'affichage public
   */
  private formatDevisForPublic(devis: any) {
    return {
      numero: devis.numero,
      dateEmission: devis.dateEmission,
      dateValidite: devis.dateValidite,
      totalHT: devis.totalHT,
      totalTVA: devis.totalTVA,
      totalTTC: devis.totalTTC,
      conditionsParticulieres: devis.conditionsParticulieres,
      client: {
        nom: devis.chantier.client.prenom
          ? `${devis.chantier.client.prenom} ${devis.chantier.client.nom}`
          : devis.chantier.client.nom,
        adresse: devis.chantier.client.adresse,
        codePostal: devis.chantier.client.codePostal,
        ville: devis.chantier.client.ville,
      },
      chantier: {
        adresse: devis.chantier.adresse,
        codePostal: devis.chantier.codePostal,
        ville: devis.chantier.ville,
        description: devis.chantier.description,
      },
      lignes: devis.lignes.map((ligne: any) => ({
        description: ligne.description,
        quantite: ligne.quantite,
        unite: ligne.unite,
        prixUnitaireHT: ligne.prixUnitaireHT,
        montantHT: ligne.montantHT,
        montantTTC: ligne.montantTTC,
      })),
    };
  }

  /**
   * Construit l'email de demande de signature
   */
  private buildSignatureRequestEmail(
    prenom: string,
    devisNumero: string,
    totalTTC: number,
    signatureUrl: string,
    customMessage?: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; background: #2d5a27; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .amount { font-size: 24px; font-weight: bold; color: #2d5a27; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Art & Jardin</h1>
    </div>
    <div class="content">
      <p>Bonjour ${prenom},</p>

      <p>Veuillez trouver ci-dessous votre devis <strong>N° ${devisNumero}</strong>.</p>

      ${customMessage ? `<p>${customMessage}</p>` : ''}

      <p>Montant total : <span class="amount">${totalTTC.toFixed(2)} € TTC</span></p>

      <p>Pour accepter ce devis, cliquez sur le bouton ci-dessous et signez electroniquement :</p>

      <p style="text-align: center;">
        <a href="${signatureUrl}" class="button">Signer le devis</a>
      </p>

      <p><small>Ce lien est valable 7 jours.</small></p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
      <p>Ce message est envoye automatiquement, merci de ne pas y repondre.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Construit l'email de confirmation de signature
   */
  private buildSignatureConfirmationEmail(
    prenom: string,
    devisNumero: string,
    totalTTC: number,
    signedAt: Date,
  ): string {
    const dateStr = signedAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Art & Jardin</h1>
    </div>
    <div class="content">
      <p>Bonjour ${prenom},</p>

      <div class="success">
        <p><strong>Votre signature a bien ete enregistree.</strong></p>
      </div>

      <p><strong>Devis :</strong> N° ${devisNumero}</p>
      <p><strong>Montant :</strong> ${totalTTC.toFixed(2)} € TTC</p>
      <p><strong>Date de signature :</strong> ${dateStr}</p>

      <p>Nous vous contacterons prochainement pour planifier l'intervention.</p>

      <p>Cordialement,<br>L'equipe Art & Jardin</p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
      <p>Document signe electroniquement conformement aux articles 1366 et 1367 du Code civil.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
