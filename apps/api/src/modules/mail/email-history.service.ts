import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailStatus, DocumentType } from '@art-et-jardin/database';

export interface LogEmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  templateName?: string;
  documentType?: DocumentType;
  documentId?: string;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateEmailStatusOptions {
  status: EmailStatus;
  messageId?: string;
  errorMessage?: string;
  sentAt?: Date;
}

@Injectable()
export class EmailHistoryService {
  private readonly logger = new Logger(EmailHistoryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log un email avant envoi (status = pending)
   */
  async logEmail(options: LogEmailOptions): Promise<string> {
    const record = await this.prisma.emailHistory.create({
      data: {
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        templateName: options.templateName,
        documentType: options.documentType,
        documentId: options.documentId,
        attachments: options.attachments || [],
        metadata: options.metadata as object,
        status: 'pending',
      },
    });

    this.logger.debug(`Email logged with id ${record.id}: ${options.subject} to ${options.to}`);
    return record.id;
  }

  /**
   * Met a jour le statut d'un email apres tentative d'envoi
   */
  async updateStatus(emailId: string, options: UpdateEmailStatusOptions): Promise<void> {
    await this.prisma.emailHistory.update({
      where: { id: emailId },
      data: {
        status: options.status,
        messageId: options.messageId,
        errorMessage: options.errorMessage,
        sentAt: options.sentAt,
      },
    });

    this.logger.debug(`Email ${emailId} status updated to ${options.status}`);
  }

  /**
   * Recupere l'historique des emails pour un document
   */
  async getEmailsByDocument(documentType: DocumentType, documentId: string): Promise<unknown[]> {
    return this.prisma.emailHistory.findMany({
      where: {
        documentType,
        documentId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Recupere l'historique des emails pour un destinataire
   */
  async getEmailsByRecipient(email: string, limit = 50): Promise<unknown[]> {
    return this.prisma.emailHistory.findMany({
      where: { to: email },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Recupere les emails en echec pour retry
   */
  async getFailedEmails(limit = 100): Promise<unknown[]> {
    return this.prisma.emailHistory.findMany({
      where: { status: 'failed' },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  /**
   * Statistiques des emails
   */
  async getStats(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [total, sent, failed, pending] = await Promise.all([
      this.prisma.emailHistory.count({ where: { createdAt: { gte: since } } }),
      this.prisma.emailHistory.count({ where: { createdAt: { gte: since }, status: 'sent' } }),
      this.prisma.emailHistory.count({ where: { createdAt: { gte: since }, status: 'failed' } }),
      this.prisma.emailHistory.count({ where: { createdAt: { gte: since }, status: 'pending' } }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? ((sent / total) * 100).toFixed(1) : '0',
    };
  }
}
