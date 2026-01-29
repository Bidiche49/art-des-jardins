import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private readonly from: string;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('SMTP_HOST');
    const port = this.configService.get('SMTP_PORT') || 587;
    const user = this.configService.get('SMTP_USER');
    const password = this.configService.get('SMTP_PASSWORD');
    this.from = this.configService.get('SMTP_FROM') || 'noreply@artjardin.fr';

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
    } else {
      this.logger.warn('Mail service not configured - emails will be logged only');
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, html, attachments } = options;

    if (!this.transporter) {
      this.logger.warn(`[DEV] Email would be sent to: ${to}`);
      this.logger.warn(`[DEV] Subject: ${subject}`);
      this.logger.debug(`[DEV] Content: ${html.substring(0, 200)}...`);
      return true; // Pretend it worked in dev
    }

    try {
      const result = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
        attachments: attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });

      this.logger.log(`Email sent to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email to ${to}: ${err.message}`, err.stack);
      return false;
    }
  }

  async sendDevis(to: string, devisNumero: string, clientName: string, pdfBuffer: Buffer): Promise<boolean> {
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
    });
  }

  async sendFacture(to: string, factureNumero: string, clientName: string, pdfBuffer: Buffer): Promise<boolean> {
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
    });
  }

  async sendRelance(to: string, factureNumero: string, clientName: string, montant: number, joursRetard: number): Promise<boolean> {
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
    });
  }
}
