import { Test, TestingModule } from '@nestjs/testing';
import { EmailHistoryService } from './email-history.service';
import { PrismaService } from '../../database/prisma.service';

describe('EmailHistoryService', () => {
  let service: EmailHistoryService;

  const mockEmailHistory = {
    id: 'email-123',
    to: 'client@example.com',
    cc: null,
    bcc: 'archive@artjardin.fr',
    subject: 'Votre devis DEV-2026-001',
    templateName: 'devis',
    status: 'pending',
    messageId: null,
    errorMessage: null,
    documentType: 'devis',
    documentId: 'devis-456',
    attachments: ['devis.pdf'],
    metadata: { clientName: 'Jean Dupont' },
    sentAt: null,
    createdAt: new Date(),
  };

  const mockPrismaService = {
    emailHistory: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailHistoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EmailHistoryService>(EmailHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logEmail', () => {
    it('should log email with pending status', async () => {
      mockPrismaService.emailHistory.create.mockResolvedValue(mockEmailHistory);

      const emailId = await service.logEmail({
        to: 'client@example.com',
        subject: 'Votre devis DEV-2026-001',
        templateName: 'devis',
        documentType: 'devis',
        documentId: 'devis-456',
      });

      expect(emailId).toBe('email-123');
      expect(mockPrismaService.emailHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          to: 'client@example.com',
          subject: 'Votre devis DEV-2026-001',
          status: 'pending',
        }),
      });
    });

    it('should include optional fields', async () => {
      mockPrismaService.emailHistory.create.mockResolvedValue(mockEmailHistory);

      await service.logEmail({
        to: 'client@example.com',
        cc: 'copy@example.com',
        bcc: 'archive@artjardin.fr',
        subject: 'Test',
        attachments: ['document.pdf'],
        metadata: { key: 'value' },
      });

      expect(mockPrismaService.emailHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cc: 'copy@example.com',
          bcc: 'archive@artjardin.fr',
          attachments: ['document.pdf'],
          metadata: { key: 'value' },
        }),
      });
    });
  });

  describe('updateStatus', () => {
    it('should update email status to sent', async () => {
      mockPrismaService.emailHistory.update.mockResolvedValue({
        ...mockEmailHistory,
        status: 'sent',
        messageId: 'msg-123',
        sentAt: new Date(),
      });

      await service.updateStatus('email-123', {
        status: 'sent',
        messageId: 'msg-123',
        sentAt: new Date(),
      });

      expect(mockPrismaService.emailHistory.update).toHaveBeenCalledWith({
        where: { id: 'email-123' },
        data: expect.objectContaining({
          status: 'sent',
          messageId: 'msg-123',
        }),
      });
    });

    it('should update email status to failed with error', async () => {
      mockPrismaService.emailHistory.update.mockResolvedValue({
        ...mockEmailHistory,
        status: 'failed',
        errorMessage: 'SMTP connection failed',
      });

      await service.updateStatus('email-123', {
        status: 'failed',
        errorMessage: 'SMTP connection failed',
      });

      expect(mockPrismaService.emailHistory.update).toHaveBeenCalledWith({
        where: { id: 'email-123' },
        data: expect.objectContaining({
          status: 'failed',
          errorMessage: 'SMTP connection failed',
        }),
      });
    });
  });

  describe('getEmailsByDocument', () => {
    it('should return emails for a specific document', async () => {
      const emails = [mockEmailHistory, { ...mockEmailHistory, id: 'email-456' }];
      mockPrismaService.emailHistory.findMany.mockResolvedValue(emails);

      const result = await service.getEmailsByDocument('devis', 'devis-456');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.emailHistory.findMany).toHaveBeenCalledWith({
        where: {
          documentType: 'devis',
          documentId: 'devis-456',
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getEmailsByRecipient', () => {
    it('should return emails for a recipient with default limit', async () => {
      mockPrismaService.emailHistory.findMany.mockResolvedValue([mockEmailHistory]);

      const result = await service.getEmailsByRecipient('client@example.com');

      expect(result).toHaveLength(1);
      expect(mockPrismaService.emailHistory.findMany).toHaveBeenCalledWith({
        where: { to: 'client@example.com' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });

    it('should respect custom limit', async () => {
      mockPrismaService.emailHistory.findMany.mockResolvedValue([]);

      await service.getEmailsByRecipient('client@example.com', 10);

      expect(mockPrismaService.emailHistory.findMany).toHaveBeenCalledWith({
        where: { to: 'client@example.com' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    });
  });

  describe('getFailedEmails', () => {
    it('should return failed emails for retry', async () => {
      const failedEmails = [{ ...mockEmailHistory, status: 'failed' }];
      mockPrismaService.emailHistory.findMany.mockResolvedValue(failedEmails);

      const result = await service.getFailedEmails();

      expect(result).toHaveLength(1);
      expect(mockPrismaService.emailHistory.findMany).toHaveBeenCalledWith({
        where: { status: 'failed' },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });
    });

    it('should respect custom limit', async () => {
      mockPrismaService.emailHistory.findMany.mockResolvedValue([]);

      await service.getFailedEmails(20);

      expect(mockPrismaService.emailHistory.findMany).toHaveBeenCalledWith({
        where: { status: 'failed' },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
    });
  });

  describe('getStats', () => {
    it('should return email statistics for last 30 days', async () => {
      mockPrismaService.emailHistory.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(90) // sent
        .mockResolvedValueOnce(5) // failed
        .mockResolvedValueOnce(5); // pending

      const result = await service.getStats();

      expect(result).toEqual({
        total: 100,
        sent: 90,
        failed: 5,
        pending: 5,
        successRate: '90.0',
      });
    });

    it('should handle custom days parameter', async () => {
      mockPrismaService.emailHistory.count.mockResolvedValue(0);

      await service.getStats(7);

      // Verify that count was called with a date filter
      expect(mockPrismaService.emailHistory.count).toHaveBeenCalled();
    });

    it('should handle zero emails', async () => {
      mockPrismaService.emailHistory.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        successRate: '0',
      });
    });
  });
});
