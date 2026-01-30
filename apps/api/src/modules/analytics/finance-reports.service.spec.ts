import { Test, TestingModule } from '@nestjs/testing';
import { FinanceReportsService } from './finance-reports.service';
import { PrismaService } from '../../database/prisma.service';

describe('FinanceReportsService', () => {
  let service: FinanceReportsService;

  const mockPrismaService = {
    facture: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    devis: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceReportsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FinanceReportsService>(FinanceReportsService);
    jest.clearAllMocks();
  });

  describe('getRevenueByPeriod', () => {
    it('should return monthly revenue for the year', async () => {
      mockPrismaService.facture.aggregate.mockResolvedValue({
        _sum: { totalTTC: 5000 },
        _count: 10,
      });

      const result = await service.getRevenueByPeriod(2026);

      expect(result).toHaveLength(12);
      expect(result[0].period).toBe('Janvier');
      expect(result[11].period).toBe('Decembre');
      expect(mockPrismaService.facture.aggregate).toHaveBeenCalledTimes(12);
    });

    it('should handle months with no revenue', async () => {
      mockPrismaService.facture.aggregate.mockResolvedValue({
        _sum: { totalTTC: null },
        _count: 0,
      });

      const result = await service.getRevenueByPeriod(2026);

      expect(result[0].revenue).toBe(0);
      expect(result[0].count).toBe(0);
    });
  });

  describe('getRevenueByClient', () => {
    const mockFactures = [
      {
        id: 'f1',
        totalTTC: 3000,
        devis: {
          chantier: {
            client: { id: 'client-1', nom: 'Dupont', prenom: 'Jean' },
          },
        },
      },
      {
        id: 'f2',
        totalTTC: 2000,
        devis: {
          chantier: {
            client: { id: 'client-1', nom: 'Dupont', prenom: 'Jean' },
          },
        },
      },
      {
        id: 'f3',
        totalTTC: 1500,
        devis: {
          chantier: {
            client: { id: 'client-2', nom: 'Martin', prenom: null },
          },
        },
      },
    ];

    it('should aggregate revenue by client sorted by revenue', async () => {
      mockPrismaService.facture.findMany.mockResolvedValue(mockFactures);

      const result = await service.getRevenueByClient(2026);

      expect(result).toHaveLength(2);
      expect(result[0].clientId).toBe('client-1');
      expect(result[0].clientName).toBe('Jean Dupont');
      expect(result[0].revenue).toBe(5000);
      expect(result[0].invoiceCount).toBe(2);
      expect(result[1].clientId).toBe('client-2');
      expect(result[1].revenue).toBe(1500);
    });
  });

  describe('getRevenueByPrestation', () => {
    it('should aggregate revenue by prestation type', async () => {
      mockPrismaService.facture.findMany.mockResolvedValue([
        {
          totalTTC: 4000,
          devis: { chantier: { typePrestation: ['amenagement', 'plantation'] } },
        },
        {
          totalTTC: 2000,
          devis: { chantier: { typePrestation: ['elagage'] } },
        },
      ]);

      const result = await service.getRevenueByPrestation(2026);

      expect(result.length).toBeGreaterThan(0);
      expect(result.find((r) => r.prestation === 'elagage')?.revenue).toBe(2000);
    });
  });

  describe('getUnpaidInvoices', () => {
    it('should return overdue unpaid invoices', async () => {
      const overdueDate = new Date();
      overdueDate.setDate(overdueDate.getDate() - 30);

      mockPrismaService.facture.findMany.mockResolvedValue([
        {
          id: 'f1',
          numero: 'F-2026-001',
          totalTTC: 2500,
          dateEcheance: overdueDate,
          devis: {
            chantier: {
              client: { id: 'client-1', nom: 'Dupont', prenom: 'Jean' },
            },
          },
        },
      ]);

      const result = await service.getUnpaidInvoices();

      expect(result).toHaveLength(1);
      expect(result[0].numero).toBe('F-2026-001');
      expect(result[0].clientName).toBe('Jean Dupont');
      expect(result[0].daysOverdue).toBeGreaterThanOrEqual(29);
    });
  });

  describe('getForecast', () => {
    it('should return accepted devis without factures', async () => {
      mockPrismaService.devis.findMany.mockResolvedValue([
        {
          id: 'd1',
          numero: 'D-2026-001',
          totalTTC: 8000,
          dateAcceptation: new Date('2026-01-15'),
          chantier: {
            client: { id: 'client-1', nom: 'Dupont', prenom: 'Jean' },
          },
        },
      ]);

      const result = await service.getForecast();

      expect(result).toHaveLength(1);
      expect(result[0].devisNumero).toBe('D-2026-001');
      expect(result[0].totalTTC).toBe(8000);
    });

    it('should use createdAt when dateAcceptation is null', async () => {
      const createdAt = new Date('2026-01-10');
      mockPrismaService.devis.findMany.mockResolvedValue([
        {
          id: 'd1',
          numero: 'D-2026-001',
          totalTTC: 5000,
          dateAcceptation: null,
          createdAt,
          chantier: {
            client: { id: 'client-1', nom: 'Dupont', prenom: null },
          },
        },
      ]);

      const result = await service.getForecast();

      expect(result[0].dateAcceptation).toEqual(createdAt);
      expect(result[0].clientName).toBe('Dupont');
    });
  });

  describe('getFinancialSummary', () => {
    it('should return aggregated financial summary', async () => {
      mockPrismaService.facture.aggregate
        .mockResolvedValueOnce({ _sum: { totalTTC: 50000 }, _count: 25 })
        .mockResolvedValueOnce({ _sum: { totalTTC: 10000 }, _count: 5 })
        .mockResolvedValueOnce({ _sum: { totalTTC: 5000 }, _count: 2 });

      const result = await service.getFinancialSummary(2026);

      expect(result.paid.amount).toBe(50000);
      expect(result.paid.count).toBe(25);
      expect(result.pending.amount).toBe(10000);
      expect(result.pending.count).toBe(5);
      expect(result.unpaidOverdue.amount).toBe(5000);
      expect(result.unpaidOverdue.count).toBe(2);
    });

    it('should handle null sums', async () => {
      mockPrismaService.facture.aggregate.mockResolvedValue({
        _sum: { totalTTC: null },
        _count: 0,
      });

      const result = await service.getFinancialSummary(2026);

      expect(result.paid.amount).toBe(0);
    });
  });
});
