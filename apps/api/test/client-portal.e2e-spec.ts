import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockClient,
  createMockChantier,
  createMockDevis,
  createMockFacture,
  createMockIntervention,
} from './helpers/test-utils';
import { ConfigService } from '@nestjs/config';
import { JWT_TEST_SECRET, createClientToken } from './helpers/jwt.helper';

describe('ClientPortal (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockClient = createMockClient({ id: 'client-id-123' });
  const mockOtherClient = createMockClient({ id: 'other-client-id' });
  const mockChantier = createMockChantier(mockClient.id, { id: 'chantier-id-123' });
  const mockDevis = createMockDevis(mockChantier.id, {
    id: 'devis-id-123',
    statut: 'envoye',
  });
  const mockFacture = createMockFacture(mockDevis.id, {
    id: 'facture-id-123',
    statut: 'envoyee',
  });
  const mockIntervention = createMockIntervention(mockChantier.id, 'employe-id', {
    id: 'intervention-id-123',
  });

  let clientToken: string;

  beforeAll(async () => {
    clientToken = createClientToken(mockClient.id, mockClient.email);

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
        client: {
          findUnique: jest.fn(),
        },
        chantier: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
        },
        devis: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
        },
        facture: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
        },
        intervention: {
          findMany: jest.fn(),
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
    (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
  });

  describe('GET /client-portal/dashboard', () => {
    it('should return 200 with dashboard data for authenticated client', async () => {
      (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier]);
      (prisma.devis.findMany as jest.Mock).mockResolvedValue([mockDevis]);
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([mockFacture]);

      const response = await request(app.getHttpServer())
        .get('/client-portal/dashboard')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('client');
      expect(response.body).toHaveProperty('chantiersEnCours');
      expect(response.body).toHaveProperty('devisEnAttente');
      expect(response.body).toHaveProperty('facturesImpayees');
      expect(response.body.client.id).toBe(mockClient.id);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/client-portal/dashboard')
        .expect(401);
    });
  });

  describe('GET /client-portal/devis', () => {
    it('should return 200 with client devis list', async () => {
      (prisma.devis.findMany as jest.Mock).mockResolvedValue([
        { ...mockDevis, chantier: mockChantier },
      ]);

      const response = await request(app.getHttpServer())
        .get('/client-portal/devis')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            chantier: { clientId: mockClient.id },
          }),
        }),
      );
    });

    it('should filter by status if provided', async () => {
      (prisma.devis.findMany as jest.Mock).mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/client-portal/devis?statut=envoye')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            statut: 'envoye',
          }),
        }),
      );
    });
  });

  describe('GET /client-portal/devis/:id', () => {
    it('should return 200 with devis details for own devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue({
        ...mockDevis,
        chantier: mockChantier,
        lignes: [],
      });

      const response = await request(app.getHttpServer())
        .get(`/client-portal/devis/${mockDevis.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body.id).toBe(mockDevis.id);
    });

    it('should return 404 for devis belonging to another client', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue({
        ...mockDevis,
        chantier: { ...mockChantier, clientId: mockOtherClient.id },
      });

      await request(app.getHttpServer())
        .get(`/client-portal/devis/${mockDevis.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(404);
    });
  });

  describe('GET /client-portal/factures', () => {
    it('should return 200 with client factures list', async () => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([
        { ...mockFacture, devis: { ...mockDevis, chantier: mockChantier } },
      ]);

      const response = await request(app.getHttpServer())
        .get('/client-portal/factures')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /client-portal/chantiers', () => {
    it('should return 200 with client chantiers list', async () => {
      (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier]);

      const response = await request(app.getHttpServer())
        .get('/client-portal/chantiers')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(prisma.chantier.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clientId: mockClient.id },
        }),
      );
    });
  });

  describe('GET /client-portal/chantiers/:id', () => {
    it('should return 200 with chantier details and timeline', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue({
        ...mockChantier,
        client: mockClient,
        devis: [mockDevis],
      });
      (prisma.intervention.findMany as jest.Mock).mockResolvedValue([
        mockIntervention,
      ]);

      const response = await request(app.getHttpServer())
        .get(`/client-portal/chantiers/${mockChantier.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('chantier');
      expect(response.body).toHaveProperty('timeline');
      expect(response.body.chantier.id).toBe(mockChantier.id);
    });

    it('should return 404 for chantier belonging to another client', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue({
        ...mockChantier,
        clientId: mockOtherClient.id,
      });

      await request(app.getHttpServer())
        .get(`/client-portal/chantiers/${mockChantier.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(404);
    });
  });
});
