import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RelancesService } from './relances.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../audit/audit.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RelancesService', () => {
  let service: RelancesService;
  let prisma: jest.Mocked<PrismaService>;
  let mail: jest.Mocked<MailService>;
  let audit: jest.Mocked<AuditService>;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        RELANCE_ENABLED: 'true',
        RELANCE_J1: '30',
        RELANCE_J2: '45',
        RELANCE_J3: '60',
      };
      return config[key];
    }),
  };

  const mockPrisma = {
    facture: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    relanceHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockMail = {
    sendMail: jest.fn(),
  };

  const mockAudit = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelancesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailService, useValue: mockMail },
        { provide: AuditService, useValue: mockAudit },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RelancesService>(RelancesService);
    prisma = module.get(PrismaService);
    mail = module.get(MailService);
    audit = module.get(AuditService);
  });

  describe('getConfig', () => {
    it('should return the relance configuration', () => {
      const config = service.getConfig();

      expect(config).toEqual({
        enabled: true,
        j1: 30,
        j2: 45,
        j3: 60,
      });
    });
  });

  describe('isEnabled', () => {
    it('should return true when enabled', () => {
      expect(service.isEnabled()).toBe(true);
    });
  });

  describe('calculateDaysOverdue', () => {
    it('should return positive days for overdue invoices', () => {
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() - 35);

      const days = service.calculateDaysOverdue(dateEcheance);

      expect(days).toBe(35);
    });

    it('should return 0 for invoices due today', () => {
      const dateEcheance = new Date();
      dateEcheance.setHours(0, 0, 0, 0);

      const days = service.calculateDaysOverdue(dateEcheance);

      expect(days).toBe(0);
    });

    it('should return negative days for invoices not yet due', () => {
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() + 10);

      const days = service.calculateDaysOverdue(dateEcheance);

      expect(days).toBe(-10);
    });
  });

  describe('determineNextLevel', () => {
    it('should return null for invoices with less than J1 days overdue', () => {
      const result = service.determineNextLevel(25, null);
      expect(result).toBeNull();
    });

    it('should return rappel_amical for first reminder at J1', () => {
      const result = service.determineNextLevel(30, null);
      expect(result).toBe('rappel_amical');
    });

    it('should return rappel_amical for J1 < days < J2 with no previous relance', () => {
      const result = service.determineNextLevel(40, null);
      expect(result).toBe('rappel_amical');
    });

    it('should return null when already sent rappel_amical but not yet at J2', () => {
      const result = service.determineNextLevel(40, 'rappel_amical');
      expect(result).toBeNull();
    });

    it('should return rappel_ferme at J2 after rappel_amical', () => {
      const result = service.determineNextLevel(45, 'rappel_amical');
      expect(result).toBe('rappel_ferme');
    });

    it('should return null when already sent rappel_ferme but not yet at J3', () => {
      const result = service.determineNextLevel(55, 'rappel_ferme');
      expect(result).toBeNull();
    });

    it('should return mise_en_demeure at J3 after rappel_ferme', () => {
      const result = service.determineNextLevel(60, 'rappel_ferme');
      expect(result).toBe('mise_en_demeure');
    });

    it('should return null when already sent mise_en_demeure', () => {
      const result = service.determineNextLevel(90, 'mise_en_demeure');
      expect(result).toBeNull();
    });
  });

  describe('getUnpaidFactures', () => {
    it('should return unpaid invoices with client info', async () => {
      const mockFactures = [
        {
          id: 'facture-1',
          numero: 'FAC-2026-001',
          dateEcheance: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          totalTTC: 1500,
          excludeRelance: false,
          devis: {
            chantier: {
              client: {
                id: 'client-1',
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean@example.com',
                excludeRelance: false,
              },
            },
          },
          relances: [],
        },
      ];

      mockPrisma.facture.findMany.mockResolvedValue(mockFactures);

      const result = await service.getUnpaidFactures();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'facture-1',
        numero: 'FAC-2026-001',
        client: {
          id: 'client-1',
          nom: 'Dupont',
        },
      });
      expect(result[0].joursRetard).toBeGreaterThanOrEqual(34);
    });

    it('should exclude clients with excludeRelance flag', async () => {
      const mockFactures = [
        {
          id: 'facture-1',
          numero: 'FAC-2026-001',
          dateEcheance: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          totalTTC: 1500,
          excludeRelance: false,
          devis: {
            chantier: {
              client: {
                id: 'client-1',
                nom: 'VIP Client',
                prenom: null,
                email: 'vip@example.com',
                excludeRelance: true, // Client VIP
              },
            },
          },
          relances: [],
        },
      ];

      mockPrisma.facture.findMany.mockResolvedValue(mockFactures);

      const result = await service.getUnpaidFactures();

      expect(result).toHaveLength(0);
    });

    it('should include last relance info when available', async () => {
      const lastRelanceDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const mockFactures = [
        {
          id: 'facture-1',
          numero: 'FAC-2026-001',
          dateEcheance: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
          totalTTC: 1500,
          excludeRelance: false,
          devis: {
            chantier: {
              client: {
                id: 'client-1',
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean@example.com',
                excludeRelance: false,
              },
            },
          },
          relances: [
            {
              level: 'rappel_amical',
              sentAt: lastRelanceDate,
            },
          ],
        },
      ];

      mockPrisma.facture.findMany.mockResolvedValue(mockFactures);

      const result = await service.getUnpaidFactures();

      expect(result[0].lastRelance).toEqual({
        level: 'rappel_amical',
        sentAt: lastRelanceDate,
      });
    });
  });

  describe('sendRelance', () => {
    const mockFacture = {
      id: 'facture-1',
      numero: 'FAC-2026-001',
      dateEcheance: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      totalTTC: 1500,
      statut: 'envoyee',
      devis: {
        chantier: {
          client: {
            id: 'client-1',
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean@example.com',
          },
        },
      },
    };

    it('should throw NotFoundException if facture does not exist', async () => {
      mockPrisma.facture.findUnique.mockResolvedValue(null);

      await expect(
        service.sendRelance('non-existent', 'rappel_amical'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if facture is not envoyee', async () => {
      mockPrisma.facture.findUnique.mockResolvedValue({
        ...mockFacture,
        statut: 'payee',
      });

      await expect(
        service.sendRelance('facture-1', 'rappel_amical'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should send email and create relance history on success', async () => {
      mockPrisma.facture.findUnique.mockResolvedValue(mockFacture);
      mockMail.sendMail.mockResolvedValue(true);
      mockPrisma.relanceHistory.create.mockResolvedValue({
        id: 'relance-1',
        factureId: 'facture-1',
        level: 'rappel_amical',
        success: true,
      });

      const result = await service.sendRelance(
        'facture-1',
        'rappel_amical',
        'user-1',
        true,
      );

      expect(result.success).toBe(true);
      expect(mockMail.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jean@example.com',
          documentType: 'relance',
          templateName: 'relance_rappel_amical',
        }),
      );
      expect(mockPrisma.relanceHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          factureId: 'facture-1',
          level: 'rappel_amical',
          success: true,
        }),
      });
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          action: 'RELANCE_MANUAL',
          entite: 'Facture',
        }),
      );
    });

    it('should log failure when email fails', async () => {
      mockPrisma.facture.findUnique.mockResolvedValue(mockFacture);
      mockMail.sendMail.mockResolvedValue(false);
      mockPrisma.relanceHistory.create.mockResolvedValue({
        id: 'relance-1',
        success: false,
      });

      const result = await service.sendRelance('facture-1', 'rappel_amical');

      expect(result.success).toBe(false);
      expect(mockPrisma.relanceHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          success: false,
          errorMessage: 'Email sending failed',
        }),
      });
    });

    it('should use RELANCE_AUTO action for automatic relances', async () => {
      mockPrisma.facture.findUnique.mockResolvedValue(mockFacture);
      mockMail.sendMail.mockResolvedValue(true);
      mockPrisma.relanceHistory.create.mockResolvedValue({ id: 'relance-1' });

      await service.sendRelance('facture-1', 'rappel_amical', undefined, false);

      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'RELANCE_AUTO',
        }),
      );
    });
  });

  describe('cancelRelances', () => {
    it('should set excludeRelance to true', async () => {
      mockPrisma.facture.update.mockResolvedValue({
        id: 'facture-1',
        numero: 'FAC-2026-001',
        excludeRelance: true,
      });

      const result = await service.cancelRelances('facture-1', 'user-1');

      expect(mockPrisma.facture.update).toHaveBeenCalledWith({
        where: { id: 'facture-1' },
        data: { excludeRelance: true },
      });
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'RELANCE_CANCEL',
        }),
      );
    });
  });

  describe('enableRelances', () => {
    it('should set excludeRelance to false', async () => {
      mockPrisma.facture.update.mockResolvedValue({
        id: 'facture-1',
        numero: 'FAC-2026-001',
        excludeRelance: false,
      });

      const result = await service.enableRelances('facture-1', 'user-1');

      expect(mockPrisma.facture.update).toHaveBeenCalledWith({
        where: { id: 'facture-1' },
        data: { excludeRelance: false },
      });
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'RELANCE_ENABLE',
        }),
      );
    });
  });

  describe('getRelanceHistory', () => {
    it('should return relance history for a facture', async () => {
      const mockHistory = [
        { id: 'relance-1', level: 'rappel_amical', sentAt: new Date() },
        { id: 'relance-2', level: 'rappel_ferme', sentAt: new Date() },
      ];
      mockPrisma.relanceHistory.findMany.mockResolvedValue(mockHistory);

      const result = await service.getRelanceHistory('facture-1');

      expect(result).toEqual(mockHistory);
      expect(mockPrisma.relanceHistory.findMany).toHaveBeenCalledWith({
        where: { factureId: 'facture-1' },
        orderBy: { sentAt: 'desc' },
      });
    });
  });

  describe('getStats', () => {
    it('should return comprehensive statistics', async () => {
      mockPrisma.relanceHistory.count.mockResolvedValue(100);
      mockPrisma.relanceHistory.groupBy.mockResolvedValue([
        { level: 'rappel_amical', _count: 50 },
        { level: 'rappel_ferme', _count: 30 },
        { level: 'mise_en_demeure', _count: 20 },
      ]);
      mockPrisma.facture.findMany.mockResolvedValue([]);

      // Mock pour les compteurs last30Days
      mockPrisma.relanceHistory.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80)  // success last 30 days
        .mockResolvedValueOnce(5);  // failed last 30 days

      const result = await service.getStats();

      expect(result.total).toBe(100);
      expect(result.byLevel).toEqual({
        rappel_amical: 50,
        rappel_ferme: 30,
        mise_en_demeure: 20,
      });
      expect(result.config).toMatchObject({
        enabled: true,
        j1: 30,
        j2: 45,
        j3: 60,
      });
    });
  });
});
