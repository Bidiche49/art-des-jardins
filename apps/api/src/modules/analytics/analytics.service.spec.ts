import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../database/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    facture: {
      aggregate: jest.fn(),
    },
    devis: {
      findMany: jest.fn(),
    },
    intervention: {
      count: jest.fn(),
    },
    client: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    beforeEach(() => {
      mockPrismaService.facture.aggregate.mockResolvedValue({ _sum: { totalTTC: 10000 } });
      mockPrismaService.devis.findMany
        .mockResolvedValueOnce([
          { statut: 'signe', totalTTC: 5000 },
          { statut: 'envoye', totalTTC: 3000 },
          { statut: 'refuse', totalTTC: 2000 },
        ])
        .mockResolvedValueOnce([{ totalTTC: 5000 }]);
      mockPrismaService.intervention.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(60);
      mockPrismaService.client.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(20);
    });

    it('should return dashboard KPIs', async () => {
      const result = await service.getDashboard();

      expect(result.revenue).toBeDefined();
      expect(result.devis).toBeDefined();
      expect(result.interventions).toBeDefined();
      expect(result.clients).toBeDefined();
      expect(result.monthlyRevenue).toBeDefined();
    });

    it('should use provided year and month', async () => {
      const result = await service.getDashboard(2025, 6);

      expect(result).toBeDefined();
      expect(mockPrismaService.facture.aggregate).toHaveBeenCalled();
    });

    it('should calculate correct devis conversion rate', async () => {
      mockPrismaService.devis.findMany
        .mockReset()
        .mockResolvedValueOnce([
          { statut: 'signe', totalTTC: 5000 },
          { statut: 'envoye', totalTTC: 3000 },
        ])
        .mockResolvedValueOnce([{ totalTTC: 5000 }]);

      const result = await service.getDashboard();

      expect(result.devis.total).toBe(2);
      expect(result.devis.accepted).toBe(1);
      expect(result.devis.conversionRate).toBe(50);
    });

    it('should handle zero devis without division error', async () => {
      mockPrismaService.devis.findMany
        .mockReset()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getDashboard();

      expect(result.devis.total).toBe(0);
      expect(result.devis.conversionRate).toBe(0);
    });

    it('should return monthly revenue for each month', async () => {
      const result = await service.getDashboard();

      expect(result.monthlyRevenue).toHaveLength(12);
      expect(result.monthlyRevenue[0].month).toBe('Jan');
      expect(result.monthlyRevenue[11].month).toBe('Dec');
    });
  });
});
