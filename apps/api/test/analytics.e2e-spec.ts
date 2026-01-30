import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { createMockPatron, createMockEmploye } from './helpers/test-utils';
import { ConfigService } from '@nestjs/config';
import {
  JWT_TEST_SECRET,
  createPatronToken,
  createEmployeToken,
} from './helpers/jwt.helper';

describe('Analytics (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockPatron = createMockPatron({ id: 'patron-id-123' });
  const mockEmploye = createMockEmploye({ id: 'employe-id-456' });

  let patronToken: string;
  let employeToken: string;

  beforeAll(async () => {
    patronToken = createPatronToken(mockPatron.id, mockPatron.email);
    employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            JWT_SECRET: JWT_TEST_SECRET,
            JWT_EXPIRES_IN: '15m',
          };
          return config[key];
        }),
      })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(),
        },
        client: {
          count: jest.fn(),
          findMany: jest.fn(),
        },
        chantier: {
          count: jest.fn(),
          findMany: jest.fn(),
        },
        devis: {
          count: jest.fn(),
          findMany: jest.fn(),
          aggregate: jest.fn(),
        },
        facture: {
          count: jest.fn(),
          findMany: jest.fn(),
          aggregate: jest.fn(),
        },
        intervention: {
          count: jest.fn(),
          findMany: jest.fn(),
          aggregate: jest.fn(),
        },
        $queryRaw: jest.fn(),
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);
  });

  describe('GET /analytics/dashboard', () => {
    it('should return 200 with dashboard KPIs for patron', async () => {
      (prisma.client.count as jest.Mock).mockResolvedValue(50);
      (prisma.chantier.count as jest.Mock).mockResolvedValue(30);
      (prisma.devis.count as jest.Mock).mockResolvedValue(45);
      (prisma.facture.count as jest.Mock).mockResolvedValue(35);
      (prisma.devis.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 50000 },
      });
      (prisma.facture.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 40000 },
      });

      const response = await request(app.getHttpServer())
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalClients', 50);
      expect(response.body).toHaveProperty('totalChantiers', 30);
      expect(response.body).toHaveProperty('totalDevis', 45);
      expect(response.body).toHaveProperty('totalFactures', 35);
      expect(response.body).toHaveProperty('caDevis', 50000);
      expect(response.body).toHaveProperty('caFacture', 40000);
    });

    it('should return 403 for employe', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEmploye);

      await request(app.getHttpServer())
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/analytics/dashboard')
        .expect(401);
    });
  });

  describe('GET /analytics/revenue', () => {
    it('should return 200 with monthly revenue data', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([
        { month: '2026-01', revenue: 10000, invoiced: 8000 },
        { month: '2026-02', revenue: 12000, invoiced: 10000 },
      ]);

      const response = await request(app.getHttpServer())
        .get('/analytics/revenue?year=2026')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should accept date range parameters', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/analytics/revenue?startDate=2026-01-01&endDate=2026-06-30')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);
    });
  });

  describe('GET /analytics/clients', () => {
    it('should return 200 with client statistics', async () => {
      (prisma.client.count as jest.Mock).mockResolvedValue(100);
      (prisma.client.findMany as jest.Mock).mockResolvedValue([
        { type: 'particulier', _count: 60 },
        { type: 'professionnel', _count: 30 },
        { type: 'syndic', _count: 10 },
      ]);

      const response = await request(app.getHttpServer())
        .get('/analytics/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total', 100);
      expect(response.body).toHaveProperty('byType');
    });
  });

  describe('GET /analytics/chantiers', () => {
    it('should return 200 with chantier statistics by status', async () => {
      (prisma.chantier.count as jest.Mock).mockResolvedValue(50);
      (prisma.chantier.findMany as jest.Mock).mockResolvedValue([
        { statut: 'en_cours', _count: 20 },
        { statut: 'termine', _count: 25 },
        { statut: 'lead', _count: 5 },
      ]);

      const response = await request(app.getHttpServer())
        .get('/analytics/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total', 50);
      expect(response.body).toHaveProperty('byStatut');
    });
  });

  describe('GET /analytics/devis', () => {
    it('should return 200 with devis statistics and conversion rate', async () => {
      (prisma.devis.count as jest.Mock)
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(40); // accepted
      (prisma.devis.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 150000 },
        _avg: { totalTTC: 1500 },
      });

      const response = await request(app.getHttpServer())
        .get('/analytics/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total', 100);
      expect(response.body).toHaveProperty('accepted', 40);
      expect(response.body).toHaveProperty('conversionRate');
      expect(response.body).toHaveProperty('totalAmount', 150000);
      expect(response.body).toHaveProperty('averageAmount', 1500);
    });
  });

  describe('GET /analytics/finance/reports', () => {
    it('should return 200 with financial reports data', async () => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'facture-1',
          totalTTC: 1000,
          statut: 'payee',
          dateEmission: new Date('2026-01-15'),
        },
        {
          id: 'facture-2',
          totalTTC: 2000,
          statut: 'envoyee',
          dateEmission: new Date('2026-01-20'),
        },
      ]);
      (prisma.facture.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 3000 },
      });

      const response = await request(app.getHttpServer())
        .get('/analytics/finance/reports?period=monthly&year=2026&month=1')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('factures');
      expect(response.body).toHaveProperty('totalRevenue');
    });

    it('should support different report periods', async () => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.facture.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 0 },
      });

      await request(app.getHttpServer())
        .get('/analytics/finance/reports?period=quarterly&year=2026&quarter=1')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/analytics/finance/reports?period=yearly&year=2026')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);
    });
  });

  describe('GET /analytics/finance/unpaid', () => {
    it('should return 200 with unpaid invoices', async () => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'facture-1',
          totalTTC: 1500,
          statut: 'envoyee',
          dateEcheance: new Date('2026-01-01'),
          devis: {
            chantier: { client: { nom: 'Client A' } },
          },
        },
      ]);
      (prisma.facture.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalTTC: 1500 },
      });

      const response = await request(app.getHttpServer())
        .get('/analytics/finance/unpaid')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('factures');
      expect(response.body).toHaveProperty('totalUnpaid', 1500);
    });
  });

  describe('GET /analytics/interventions', () => {
    it('should return 200 with intervention statistics', async () => {
      (prisma.intervention.count as jest.Mock).mockResolvedValue(200);
      (prisma.intervention.aggregate as jest.Mock).mockResolvedValue({
        _sum: { dureeMinutes: 12000 },
        _avg: { dureeMinutes: 60 },
      });

      const response = await request(app.getHttpServer())
        .get('/analytics/interventions')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total', 200);
      expect(response.body).toHaveProperty('totalHours');
      expect(response.body).toHaveProperty('avgDuration');
    });

    it('should filter by date range', async () => {
      (prisma.intervention.count as jest.Mock).mockResolvedValue(50);
      (prisma.intervention.aggregate as jest.Mock).mockResolvedValue({
        _sum: { dureeMinutes: 3000 },
        _avg: { dureeMinutes: 60 },
      });

      await request(app.getHttpServer())
        .get('/analytics/interventions?startDate=2026-01-01&endDate=2026-01-31')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);
    });
  });

  describe('GET /analytics/export', () => {
    it('should return 200 with CSV data', async () => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([
        { numero: 'FAC-001', totalTTC: 1000, dateEmission: new Date() },
      ]);

      const response = await request(app.getHttpServer())
        .get('/analytics/export?type=factures&format=csv')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
    });

    it('should support JSON format', async () => {
      (prisma.devis.findMany as jest.Mock).mockResolvedValue([
        { numero: 'DEV-001', totalTTC: 2000, dateEmission: new Date() },
      ]);

      const response = await request(app.getHttpServer())
        .get('/analytics/export?type=devis&format=json')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
