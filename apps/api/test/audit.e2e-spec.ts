import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
  createMockAuditLog,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Audit (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  // Valid UUIDs (v4 format)
  const PATRON_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const EMPLOYE_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const CLIENT_ID = 'c1111111-1111-4111-8111-111111111111';
  const AUDIT_LOG_ID = 'a1111111-1111-4111-8111-111111111111';

  const mockPatron = createMockPatron({ id: PATRON_ID });
  const mockEmploye = createMockEmploye({ id: EMPLOYE_ID });

  const mockAuditLog1 = createMockAuditLog({
    id: AUDIT_LOG_ID,
    userId: PATRON_ID,
    action: 'CREATE',
    entite: 'Client',
    entiteId: CLIENT_ID,
    details: { nom: 'Test Client' },
    ipAddress: '127.0.0.1',
    userAgent: 'Jest Test',
  });

  const mockAuditLog2 = createMockAuditLog({
    id: 'a2222222-2222-4222-8222-222222222222',
    userId: PATRON_ID,
    action: 'UPDATE',
    entite: 'Client',
    entiteId: CLIENT_ID,
    details: { nom: 'Updated Client' },
  });

  const mockAuditLog3 = createMockAuditLog({
    id: 'a3333333-3333-4333-8333-333333333333',
    userId: EMPLOYE_ID,
    action: 'DELETE',
    entite: 'Devis',
    entiteId: 'd1111111-1111-4111-8111-111111111111',
  });

  const patronToken = createPatronToken(mockPatron.id, mockPatron.email);
  const employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            JWT_SECRET: JWT_TEST_SECRET,
            JWT_EXPIRES_IN: '15m',
            JWT_REFRESH_EXPIRES_IN: '7d',
          };
          return config[key];
        }),
      })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(),
        },
        auditLog: {
          findMany: jest.fn(),
          create: jest.fn(),
          count: jest.fn(),
        },
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
    (prisma.user.findUnique as jest.Mock).mockImplementation(({ where }) => {
      if (where.id === PATRON_ID) return Promise.resolve(mockPatron);
      if (where.id === EMPLOYE_ID) return Promise.resolve(mockEmploye);
      return Promise.resolve(null);
    });
  });

  describe('GET /audit-logs', () => {
    beforeEach(() => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([
        { ...mockAuditLog1, user: mockPatron },
        { ...mockAuditLog2, user: mockPatron },
        { ...mockAuditLog3, user: mockEmploye },
      ]);
      (prisma.auditLog.count as jest.Mock).mockResolvedValue(3);
    });

    it('should return paginated list for patron', async () => {
      const response = await request(app.getHttpServer())
        .get('/audit-logs')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter by userId', async () => {
      await request(app.getHttpServer())
        .get(`/audit-logs?userId=${PATRON_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: PATRON_ID }),
        }),
      );
    });

    it('should filter by action', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs?action=CREATE')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: { contains: 'CREATE', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by entite', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs?entite=Client')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ entite: 'Client' }),
        }),
      );
    });

    it('should filter by date range', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs?dateDebut=2026-01-01&dateFin=2026-01-31')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs')
        .expect(401);
    });
  });

  describe('GET /audit-logs/export', () => {
    beforeEach(() => {
      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue([
        { ...mockAuditLog1, user: mockPatron },
        { ...mockAuditLog2, user: mockPatron },
      ]);
    });

    it('should export CSV for patron', async () => {
      const response = await request(app.getHttpServer())
        .get('/audit-logs/export')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.text).toContain('Date;Utilisateur;Email;Action;Entite');
    });

    it('should include correct headers in CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/audit-logs/export')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      const lines = response.text.split('\n');
      const headers = lines[0]!.split(';');
      expect(headers).toContain('Date');
      expect(headers).toContain('Utilisateur');
      expect(headers).toContain('Email');
      expect(headers).toContain('Action');
      expect(headers).toContain('Entite');
      expect(headers).toContain('EntiteId');
      expect(headers).toContain('IP');
      expect(headers).toContain('Details');
    });

    it('should filter export by entite', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs/export?entite=Client')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ entite: 'Client' }),
        }),
      );
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs/export')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs/export')
        .expect(401);
    });
  });
});
