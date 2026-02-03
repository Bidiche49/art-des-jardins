import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { EmailHistoryService } from './email-history.service';
import { DocumentType } from '@art-et-jardin/database';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
  // Phase 9: Options pour historique
  documentType?: DocumentType;
  documentId?: string;
  templateName?: string;
  skipBcc?: boolean; // Pour les cas exceptionnels
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private readonly from: string;
  private readonly bccEmail: string | null;

  constructor(
    private configService: ConfigService,
    private emailHistory: EmailHistoryService,
  ) {
    const host = this.configService.get('SMTP_HOST');
    const port = this.configService.get('SMTP_PORT') || 587;
    const user = this.configService.get('SMTP_USER');
    const password = this.configService.get('SMTP_PASSWORD');
    this.from = this.configService.get('SMTP_FROM') || 'noreply@artjardin.fr';
    this.bccEmail = this.configService.get('COMPANY_BCC_EMAIL') || null;

    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user,
          pass: password,
        },
      });

      this.logger.log(`Mail transporter configured with host: ${host}`);
      if (this.bccEmail) {
        this.logger.log(`BCC copy enabled: ${this.bccEmail}`);
      }
    } else {
      this.logger.warn('Mail service not configured - emails will be logged only');
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  getBccEmail(): string | null {
    return this.bccEmail;
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, html, attachments, documentType, documentId, templateName, skipBcc } = options;

    // Determine BCC - copie automatique sauf si explicitement desactive
    const bcc = !skipBcc && this.bccEmail ? this.bccEmail : undefined;

    // Phase 9: Log l'email AVANT envoi
    const emailId = await this.emailHistory.logEmail({
      to,
      bcc,
      subject,
      templateName: templateName || 'generic',
      documentType,
      documentId,
      attachments: attachments?.map(a => a.filename) || [],
    });

    if (!this.transporter) {
      this.logger.warn(`[DEV] Email would be sent to: ${to}${bcc ? ` (BCC: ${bcc})` : ''}`);
      this.logger.warn(`[DEV] Subject: ${subject}`);
      this.logger.debug(`[DEV] Content: ${html.substring(0, 200)}...`);

      // Marquer comme envoye en dev
      await this.emailHistory.updateStatus(emailId, {
        status: 'sent',
        messageId: `dev-${Date.now()}`,
        sentAt: new Date(),
      });

      return true;
    }

    try {
      const result = await this.transporter.sendMail({
        from: this.from,
        to,
        bcc, // BCC automatique vers l'entreprise
        subject,
        html,
        attachments: attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });

      this.logger.log(`Email sent to ${to}${bcc ? ` (BCC: ${bcc})` : ''}: ${result.messageId}`);

      // Phase 9: Mettre a jour le statut
      await this.emailHistory.updateStatus(emailId, {
        status: 'sent',
        messageId: result.messageId,
        sentAt: new Date(),
      });

      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email to ${to}: ${err.message}`, err.stack);

      // Phase 9: Logger l'echec
      await this.emailHistory.updateStatus(emailId, {
        status: 'failed',
        errorMessage: err.message,
      });

      return false;
    }
  }

  async sendDevis(to: string, devisNumero: string, clientName: string, pdfBuffer: Buffer, devisId?: string): Promise<boolean> {
    const html = `
      <h2>Votre devis ${devisNumero}</h2>
      <p>Bonjour ${clientName},</p>
      <p>Veuillez trouver ci-joint votre devis.</p>
      <p>Ce devis est valable 30 jours.</p>
      <p>N'hesitez pas a nous contacter pour toute question.</p>
      <br>
      <p>Cordialement,</p>
      <p><strong>Art & Jardin</strong></p>
    `;

    return this.sendMail({
      to,
      subject: `Votre devis ${devisNumero} - Art & Jardin`,
      html,
      attachments: [
        {
          filename: `devis-${devisNumero}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
      documentType: 'devis',
      documentId: devisId,
      templateName: 'devis',
    });
  }

  async sendFacture(to: string, factureNumero: string, clientName: string, pdfBuffer: Buffer, factureId?: string): Promise<boolean> {
    const html = `
      <h2>Votre facture ${factureNumero}</h2>
      <p>Bonjour ${clientName},</p>
      <p>Veuillez trouver ci-joint votre facture.</p>
      <p>Merci de proceder au reglement dans les delais indiques.</p>
      <br>
      <p>Cordialement,</p>
      <p><strong>Art & Jardin</strong></p>
    `;

    return this.sendMail({
      to,
      subject: `Votre facture ${factureNumero} - Art & Jardin`,
      html,
      attachments: [
        {
          filename: `facture-${factureNumero}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
      documentType: 'facture',
      documentId: factureId,
      templateName: 'facture',
    });
  }

  async sendRelance(to: string, factureNumero: string, clientName: string, montant: number, joursRetard: number, factureId?: string): Promise<boolean> {
    const html = `
      <h2>Relance - Facture ${factureNumero}</h2>
      <p>Bonjour ${clientName},</p>
      <p>Nous nous permettons de vous relancer concernant la facture ${factureNumero}
         d'un montant de ${montant.toFixed(2)} EUR, en retard de ${joursRetard} jours.</p>
      <p>Si vous avez deja procede au reglement, merci de ne pas tenir compte de ce message.</p>
      <br>
      <p>Cordialement,</p>
      <p><strong>Art & Jardin</strong></p>
    `;

    return this.sendMail({
      to,
      subject: `Relance facture ${factureNumero} - Art & Jardin`,
      html,
      documentType: 'relance',
      documentId: factureId,
      templateName: 'relance',
    });
  }

  /**
   * Email de confirmation de signature au client avec PDF signe en piece jointe
   */
  async sendSignatureConfirmation(
    to: string,
    clientName: string,
    devisNumero: string,
    montantTTC: number,
    signedAt: Date,
    pdfBuffer: Buffer,
    devisId?: string,
  ): Promise<boolean> {
    const dateStr = signedAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .success-icon { font-size: 48px; color: #28a745; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .details-row:last-child { border-bottom: none; }
    .label { color: #666; }
    .value { font-weight: bold; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f0f0f0; border-radius: 0 0 8px 8px; }
    .legal { font-size: 11px; color: #888; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Art & Jardin</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Confirmation de signature</p>
    </div>
    <div class="content">
      <p>Bonjour ${clientName},</p>

      <div class="success-box">
        <div class="success-icon">&#10004;</div>
        <h2 style="margin: 10px 0 5px 0; color: #28a745;">Signature enregistree</h2>
        <p style="margin: 0; color: #666;">Votre accord a bien ete enregistre</p>
      </div>

      <div class="details">
        <div class="details-row">
          <span class="label">Devis N°</span>
          <span class="value">${devisNumero}</span>
        </div>
        <div class="details-row">
          <span class="label">Montant TTC</span>
          <span class="value">${montantTTC.toFixed(2)} €</span>
        </div>
        <div class="details-row">
          <span class="label">Date de signature</span>
          <span class="value">${dateStr}</span>
        </div>
      </div>

      <p>Vous trouverez le devis signe en piece jointe de cet email.</p>

      <p>Nous vous contacterons prochainement pour planifier l'intervention.</p>

      <p>Cordialement,<br><strong>L'equipe Art & Jardin</strong></p>

      <p class="legal">
        Document signe electroniquement conformement aux articles 1366 et 1367 du Code civil.
        Conservez cet email et la piece jointe comme preuve de votre accord.
      </p>
    </div>
    <div class="footer">
      <p>Art & Jardin - Paysagiste a Angers</p>
      <p>Ce message est envoye automatiquement, merci de ne pas y repondre.</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to,
      subject: `Confirmation signature - Devis N° ${devisNumero}`,
      html,
      attachments: [
        {
          filename: `devis-${devisNumero}-signe.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
      documentType: 'devis_signe',
      documentId: devisId,
      templateName: 'signature_confirmation',
    });
  }

  /**
   * Notification au patron quand un client signe un devis
   */
  async sendSignatureNotification(
    patronEmail: string,
    clientName: string,
    devisNumero: string,
    montantTTC: number,
    signedAt: Date,
    chantierDescription: string,
    devisId?: string,
  ): Promise<boolean> {
    const dateStr = signedAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2d5a27; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; }
    .content { padding: 25px; background: #f9f9f9; }
    .alert-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px 20px; margin: 15px 0; }
    .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
    .details-row { padding: 8px 0; border-bottom: 1px solid #eee; }
    .details-row:last-child { border-bottom: none; }
    .label { color: #666; font-size: 13px; }
    .value { font-weight: bold; display: block; margin-top: 3px; }
    .amount { font-size: 24px; color: #2d5a27; }
    .footer { padding: 15px; text-align: center; font-size: 11px; color: #888; }
    .cta { text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">Nouveau devis signe</h2>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>${clientName}</strong> vient de signer le devis <strong>${devisNumero}</strong>
      </div>

      <div class="details">
        <div class="details-row">
          <span class="label">Client</span>
          <span class="value">${clientName}</span>
        </div>
        <div class="details-row">
          <span class="label">Devis</span>
          <span class="value">${devisNumero}</span>
        </div>
        <div class="details-row">
          <span class="label">Chantier</span>
          <span class="value">${chantierDescription || 'Non specifie'}</span>
        </div>
        <div class="details-row">
          <span class="label">Montant TTC</span>
          <span class="value amount">${montantTTC.toFixed(2)} €</span>
        </div>
        <div class="details-row">
          <span class="label">Signe le</span>
          <span class="value">${dateStr}</span>
        </div>
      </div>

      <p>Pensez a contacter le client pour planifier l'intervention.</p>
    </div>
    <div class="footer">
      <p>Notification automatique - Art & Jardin</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendMail({
      to: patronEmail,
      subject: `[SIGNE] Devis ${devisNumero} - ${clientName}`,
      html,
      documentType: 'devis_signe',
      documentId: devisId,
      templateName: 'signature_notification',
      skipBcc: true, // Pas de BCC pour les notifications internes
    });
  }
}
