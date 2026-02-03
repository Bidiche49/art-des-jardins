import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { DocumentArchiveService } from '../document-archive/document-archive.service';
import { DevisStatut, FactureStatut } from '@art-et-jardin/database';

export interface AutoSendResult {
  sent: boolean;
  archived: boolean;
  emailId?: string;
  archiveId?: string;
  error?: string;
}

@Injectable()
export class AutoSendService {
  private readonly logger = new Logger(AutoSendService.name);
  private readonly autoSendEnabled: boolean;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailService: MailService,
    private pdfService: PdfService,
    private archiveService: DocumentArchiveService,
  ) {
    this.autoSendEnabled = this.configService.get('AUTO_SEND_ENABLED') !== 'false';

    if (this.autoSendEnabled) {
      this.logger.log('Auto-send service enabled');
    }
  }

  /**
   * Traiter un changement de statut de devis
   */
  async onDevisStatusChange(
    devisId: string,
    oldStatut: DevisStatut,
    newStatut: DevisStatut,
  ): Promise<AutoSendResult> {
    if (!this.autoSendEnabled) {
      return { sent: false, archived: false };
    }

    this.logger.debug(`Devis ${devisId}: ${oldStatut} -> ${newStatut}`);

    // Envoyer quand le devis passe en "envoye"
    if (newStatut === 'envoye' && oldStatut !== 'envoye') {
      return this.sendDevis(devisId);
    }

    // Envoyer le devis signe quand il est signe
    if (newStatut === 'signe' && oldStatut !== 'signe') {
      return this.sendSignedDevis(devisId);
    }

    return { sent: false, archived: false };
  }

  /**
   * Traiter un changement de statut de facture
   */
  async onFactureStatusChange(
    factureId: string,
    oldStatut: FactureStatut,
    newStatut: FactureStatut,
  ): Promise<AutoSendResult> {
    if (!this.autoSendEnabled) {
      return { sent: false, archived: false };
    }

    this.logger.debug(`Facture ${factureId}: ${oldStatut} -> ${newStatut}`);

    // Envoyer quand la facture passe en "envoyee"
    if (newStatut === 'envoyee' && oldStatut !== 'envoyee') {
      return this.sendFacture(factureId);
    }

    return { sent: false, archived: false };
  }

  /**
   * Envoyer un devis au client
   */
  private async sendDevis(devisId: string): Promise<AutoSendResult> {
    try {
      const devis = await this.prisma.devis.findUnique({
        where: { id: devisId },
        include: {
          chantier: {
            include: { client: true },
          },
          lignes: { orderBy: { ordre: 'asc' } },
        },
      });

      if (!devis) {
        return { sent: false, archived: false, error: 'Devis not found' };
      }

      const client = devis.chantier.client;
      const clientName = client.prenom
        ? `${client.prenom} ${client.nom}`
        : client.raisonSociale || client.nom;

      // Calculer le taux de TVA moyen (simplification)
      const tauxTVA = devis.lignes.length > 0 ? devis.lignes[0].tva : 20;

      // Generer le PDF
      const pdfBuffer = await this.pdfService.generateDevis({
        numero: devis.numero,
        dateCreation: devis.dateEmission,
        dateValidite: devis.dateValidite,
        client: {
          nom: clientName,
          adresse: client.adresse,
          codePostal: client.codePostal,
          ville: client.ville,
          email: client.email,
        },
        lignes: devis.lignes.map((l) => ({
          designation: l.description,
          quantite: l.quantite,
          unite: l.unite,
          prixUnitaire: l.prixUnitaireHT,
          montantHT: l.montantHT,
        })),
        totalHT: devis.totalHT,
        tauxTVA,
        montantTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        notes: devis.conditionsParticulieres || undefined,
      });

      // Archiver le PDF
      const archiveResult = await this.archiveService.archiveDocument({
        documentType: 'devis',
        documentId: devisId,
        documentNumero: devis.numero,
        pdfBuffer,
        metadata: { sentAt: new Date(), sentTo: client.email },
      });

      // Envoyer l'email
      const sent = await this.mailService.sendDevis(
        client.email,
        devis.numero,
        clientName,
        pdfBuffer,
        devisId,
      );

      this.logger.log(`Auto-sent devis ${devis.numero} to ${client.email}`);

      return {
        sent,
        archived: true,
        archiveId: archiveResult.id,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to auto-send devis ${devisId}: ${err.message}`);
      return { sent: false, archived: false, error: err.message };
    }
  }

  /**
   * Envoyer un devis signe au client
   */
  private async sendSignedDevis(devisId: string): Promise<AutoSendResult> {
    try {
      const devis = await this.prisma.devis.findUnique({
        where: { id: devisId },
        include: {
          chantier: {
            include: { client: true },
          },
          lignes: { orderBy: { ordre: 'asc' } },
          signature: true,
        },
      });

      if (!devis || !devis.signature) {
        return { sent: false, archived: false, error: 'Devis or signature not found' };
      }

      const client = devis.chantier.client;
      const clientName = client.prenom
        ? `${client.prenom} ${client.nom}`
        : client.raisonSociale || client.nom;

      // Calculer le taux de TVA moyen
      const tauxTVA = devis.lignes.length > 0 ? devis.lignes[0].tva : 20;

      // Generer le PDF avec signature
      const pdfBuffer = await this.pdfService.generateDevis({
        numero: devis.numero,
        dateCreation: devis.dateEmission,
        dateValidite: devis.dateValidite,
        client: {
          nom: clientName,
          adresse: client.adresse,
          codePostal: client.codePostal,
          ville: client.ville,
          email: client.email,
        },
        lignes: devis.lignes.map((l) => ({
          designation: l.description,
          quantite: l.quantite,
          unite: l.unite,
          prixUnitaire: l.prixUnitaireHT,
          montantHT: l.montantHT,
        })),
        totalHT: devis.totalHT,
        tauxTVA,
        montantTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        notes: devis.conditionsParticulieres || undefined,
        signature: {
          imageBase64: devis.signature.imageBase64,
          signedAt: devis.signature.signedAt,
          ipAddress: devis.signature.ipAddress,
          reference: devis.signature.token,
        },
      });

      // Archiver le PDF signe
      const archiveResult = await this.archiveService.archiveDocument({
        documentType: 'devis_signe',
        documentId: devisId,
        documentNumero: devis.numero,
        pdfBuffer,
        metadata: {
          signedAt: devis.signature.signedAt,
          sentTo: client.email,
        },
      });

      // Envoyer la confirmation
      const sent = await this.mailService.sendSignatureConfirmation(
        client.email,
        clientName,
        devis.numero,
        devis.totalTTC,
        devis.signature.signedAt,
        pdfBuffer,
        devisId,
      );

      this.logger.log(`Auto-sent signed devis ${devis.numero} to ${client.email}`);

      return {
        sent,
        archived: true,
        archiveId: archiveResult.id,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to auto-send signed devis ${devisId}: ${err.message}`);
      return { sent: false, archived: false, error: err.message };
    }
  }

  /**
   * Envoyer une facture au client
   */
  private async sendFacture(factureId: string): Promise<AutoSendResult> {
    try {
      const facture = await this.prisma.facture.findUnique({
        where: { id: factureId },
        include: {
          devis: {
            include: {
              chantier: {
                include: { client: true },
              },
            },
          },
          lignes: { orderBy: { ordre: 'asc' } },
        },
      });

      if (!facture) {
        return { sent: false, archived: false, error: 'Facture not found' };
      }

      const client = facture.devis.chantier.client;
      const clientName = client.prenom
        ? `${client.prenom} ${client.nom}`
        : client.raisonSociale || client.nom;

      // Calculer le taux de TVA moyen
      const tauxTVA = facture.lignes.length > 0 ? facture.lignes[0].tva : 20;

      // Generer le PDF
      const pdfBuffer = await this.pdfService.generateFacture({
        numero: facture.numero,
        dateCreation: facture.dateEmission,
        dateEcheance: facture.dateEcheance,
        devisNumero: facture.devis.numero,
        client: {
          nom: clientName,
          adresse: client.adresse,
          codePostal: client.codePostal,
          ville: client.ville,
          email: client.email,
        },
        lignes: facture.lignes.map((l) => ({
          designation: l.description,
          quantite: l.quantite,
          unite: l.unite,
          prixUnitaire: l.prixUnitaireHT,
          montantHT: l.montantHT,
        })),
        totalHT: facture.totalHT,
        tauxTVA,
        montantTVA: facture.totalTVA,
        totalTTC: facture.totalTTC,
        notes: facture.mentionsLegales || undefined,
      });

      // Archiver le PDF
      const archiveResult = await this.archiveService.archiveDocument({
        documentType: 'facture',
        documentId: factureId,
        documentNumero: facture.numero,
        pdfBuffer,
        metadata: { sentAt: new Date(), sentTo: client.email },
      });

      // Envoyer l'email
      const sent = await this.mailService.sendFacture(
        client.email,
        facture.numero,
        clientName,
        pdfBuffer,
        factureId,
      );

      this.logger.log(`Auto-sent facture ${facture.numero} to ${client.email}`);

      return {
        sent,
        archived: true,
        archiveId: archiveResult.id,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to auto-send facture ${factureId}: ${err.message}`);
      return { sent: false, archived: false, error: err.message };
    }
  }

  /**
   * Force l'envoi d'un document (manuellement)
   */
  async forceSendDevis(devisId: string): Promise<AutoSendResult> {
    return this.sendDevis(devisId);
  }

  async forceSendFacture(factureId: string): Promise<AutoSendResult> {
    return this.sendFacture(factureId);
  }
}
