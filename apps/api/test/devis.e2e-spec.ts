import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
  createMockChantier,
  createMockDevis,
  createMockLigneDevis,
  createMockClient,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Devis (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  // Valid UUIDs (v4 format)
  const PATRON_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const EMPLOYE_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const CLIENT_ID = 'c1111111-1111-4111-8111-111111111111';
  const CHANTIER_ID = 'c2222222-2222-4222-8222-222222222222';
  const DEVIS_ID = 'd1111111-1111-4111-8111-111111111111';
  const DEVIS_ID_2 = 'd2222222-2222-4222-8222-222222222222';
  const FACTURE_ID = 'f1111111-1111-4111-8111-111111111111';

  const mockPatron = createMockPatron({ id: PATRON_ID });
  const mockEmploye = createMockEmploye({ id: EMPLOYE_ID });
  const mockClient = createMockClient({ id: CLIENT_ID });
  const mockChantier = createMockChantier(CLIENT_ID, { id: CHANTIER_ID });

  const mockDevis = createMockDevis(CHANTIER_ID, {
    id: DEVIS_ID,
    numero: 'DEV-202601-001',
    statut: 'brouillon',
  });

  const mockDevisEnvoye = createMockDevis(CHANTIER_ID, {
    id: DEVIS_ID_2,
    numero: 'DEV-202601-002',
    statut: 'envoye',
  });

  const mockLigne1 = createMockLigneDevis(DEVIS_ID, {
    description: 'Tonte pelouse',
    quantite: 100,
    prixUnitaireHT: 0.5,
    tva: 20,
  });

  const mockLigne2 = createMockLigneDevis(DEVIS_ID, {
    description: 'Taille haies',
    quantite: 50,
    prixUnitaireHT: 2,
    tva: 20,
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
        chantier: {
          findUnique: jest.fn(),
        },
        devis: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn(),
        },
        ligneDevis: {
          deleteMany: jest.fn(),
        },
        sequence: {
          upsert: jest.fn(),
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

  describe('GET /devis', () => {
    beforeEach(() => {
      (prisma.devis.findMany as jest.Mock).mockResolvedValue([mockDevis, mockDevisEnvoye]);
      (prisma.devis.count as jest.Mock).mockResolvedValue(2);
    });

    it('should return paginated list', async () => {
      const response = await request(app.getHttpServer())
        .get('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter by chantierId', async () => {
      await request(app.getHttpServer())
        .get(`/devis?chantierId=${CHANTIER_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ chantierId: CHANTIER_ID }),
        }),
      );
    });

    it('should filter by clientId via chantier', async () => {
      await request(app.getHttpServer())
        .get(`/devis?clientId=${CLIENT_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ chantier: { clientId: CLIENT_ID } }),
        }),
      );
    });

    it('should filter by statut', async () => {
      await request(app.getHttpServer())
        .get('/devis?statut=brouillon')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'brouillon' }),
        }),
      );
    });

    it('should filter by date range', async () => {
      await request(app.getHttpServer())
        .get('/devis?dateDebut=2026-01-01&dateFin=2026-01-31')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dateEmission: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('should search by numero', async () => {
      await request(app.getHttpServer())
        .get('/devis?search=DEV-202601')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.devis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            numero: { contains: 'DEV-202601', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/devis')
        .expect(401);
    });
  });

  describe('GET /devis/:id', () => {
    it('should return devis with lignes for existing devis', async () => {
      const devisWithRelations = {
        ...mockDevis,
        chantier: { ...mockChantier, client: mockClient },
        lignes: [mockLigne1, mockLigne2],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithRelations);

      const response = await request(app.getHttpServer())
        .get(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(DEVIS_ID);
      expect(response.body.lignes).toHaveLength(2);
      expect(response.body.chantier).toBeDefined();
      expect(response.body.chantier.client).toBeDefined();
    });

    it('should return 404 for non-existent devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/devis/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get(`/devis/${DEVIS_ID}`)
        .expect(401);
    });
  });

  describe('POST /devis', () => {
    const getValidDevisData = () => ({
      chantierId: CHANTIER_ID,
      lignes: [
        { description: 'Tonte', quantite: 100, unite: 'm2', prixUnitaireHT: 0.5 },
        { description: 'Taille', quantite: 10, unite: 'h', prixUnitaireHT: 35 },
      ],
    });

    beforeEach(() => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier);
      (prisma.sequence.upsert as jest.Mock).mockResolvedValue({ id: 'DEV-202601', lastValue: 1 });
    });

    it('should create devis with auto-generated numero', async () => {
      const createdDevis = {
        id: 'new-devis-id',
        numero: 'DEV-202601-001',
        chantierId: CHANTIER_ID,
        statut: 'brouillon',
        totalHT: 400,
        totalTVA: 80,
        totalTTC: 480,
        lignes: [
          { description: 'Tonte', quantite: 100, montantHT: 50, montantTTC: 60 },
          { description: 'Taille', quantite: 10, montantHT: 350, montantTTC: 420 },
        ],
        chantier: { id: CHANTIER_ID, adresse: 'Test', client: { id: CLIENT_ID, nom: 'Test' } },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.devis.create as jest.Mock).mockResolvedValue(createdDevis);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(getValidDevisData())
        .expect(201);

      expect(response.body.numero).toMatch(/^DEV-\d{6}-\d{3}$/);
      expect(response.body.statut).toBe('brouillon');
    });

    it('should calculate HT/TVA/TTC correctly', async () => {
      // 100m2 * 0.5 = 50 HT + 10 TVA = 60 TTC
      // 10h * 35 = 350 HT + 70 TVA = 420 TTC
      // Total: 400 HT + 80 TVA = 480 TTC
      const createdDevis = {
        id: 'new-devis-id',
        numero: 'DEV-202601-001',
        totalHT: 400,
        totalTVA: 80,
        totalTTC: 480,
        lignes: [],
        chantier: { id: CHANTIER_ID },
      };
      (prisma.devis.create as jest.Mock).mockResolvedValue(createdDevis);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(getValidDevisData())
        .expect(201);

      expect(response.body.totalHT).toBe(400);
      expect(response.body.totalTVA).toBe(80);
      expect(response.body.totalTTC).toBe(480);
    });

    it('should handle decimal quantities', async () => {
      const dataWithDecimal = {
        chantierId: CHANTIER_ID,
        lignes: [
          { description: 'Test', quantite: 2.5, unite: 'h', prixUnitaireHT: 40 },
        ],
      };
      // 2.5 * 40 = 100 HT + 20 TVA = 120 TTC
      const createdDevis = {
        id: 'new-id',
        numero: 'DEV-202601-001',
        totalHT: 100,
        totalTVA: 20,
        totalTTC: 120,
        lignes: [],
        chantier: { id: CHANTIER_ID },
      };
      (prisma.devis.create as jest.Mock).mockResolvedValue(createdDevis);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(dataWithDecimal)
        .expect(201);

      expect(response.body.totalHT).toBe(100);
    });

    it('should handle custom TVA rates', async () => {
      const dataWithCustomTVA = {
        chantierId: CHANTIER_ID,
        lignes: [
          { description: 'Test 10%', quantite: 100, unite: 'u', prixUnitaireHT: 1, tva: 10 },
          { description: 'Test 5.5%', quantite: 100, unite: 'u', prixUnitaireHT: 1, tva: 5.5 },
        ],
      };
      // 100 HT + 10 TVA (10%) = 110 TTC
      // 100 HT + 5.5 TVA (5.5%) = 105.5 TTC
      // Total: 200 HT + 15.5 TVA = 215.5 TTC
      const createdDevis = {
        id: 'new-id',
        numero: 'DEV-202601-001',
        totalHT: 200,
        totalTVA: 15.5,
        totalTTC: 215.5,
        lignes: [],
        chantier: { id: CHANTIER_ID },
      };
      (prisma.devis.create as jest.Mock).mockResolvedValue(createdDevis);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(dataWithCustomTVA)
        .expect(201);

      expect(response.body.totalHT).toBe(200);
      expect(response.body.totalTVA).toBe(15.5);
    });

    it('should set default validity to 30 days', async () => {
      const createdDevis = {
        id: 'new-id',
        numero: 'DEV-202601-001',
        dateEmission: new Date(),
        dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lignes: [],
        chantier: { id: CHANTIER_ID },
      };
      (prisma.devis.create as jest.Mock).mockResolvedValue(createdDevis);

      await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(getValidDevisData())
        .expect(201);

      expect(prisma.devis.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dateValidite: expect.any(Date),
          }),
        }),
      );
    });

    it('should return 404 for non-existent chantier', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(getValidDevisData())
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('should return 400 for invalid lignes', async () => {
      const invalidData = {
        chantierId: CHANTIER_ID,
        lignes: [
          { description: 'Invalid', quantite: -1, unite: 'm2', prixUnitaireHT: 10 },
        ],
      };

      await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 400 for missing lignes', async () => {
      await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ chantierId: CHANTIER_ID })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/devis')
        .send(getValidDevisData())
        .expect(401);
    });
  });

  describe('PUT /devis/:id', () => {
    it('should update devis in brouillon status', async () => {
      const devisWithLignes = {
        ...mockDevis,
        statut: 'brouillon',
        chantier: mockChantier,
        lignes: [mockLigne1],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithLignes);
      (prisma.ligneDevis.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.devis.update as jest.Mock).mockResolvedValue({
        ...devisWithLignes,
        conditionsParticulieres: 'Updated',
        lignes: [mockLigne1],
      });

      const response = await request(app.getHttpServer())
        .put(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ conditionsParticulieres: 'Updated' })
        .expect(200);

      expect(response.body.conditionsParticulieres).toBe('Updated');
    });

    it('should recalculate totals when updating lignes', async () => {
      const devisWithLignes = {
        ...mockDevis,
        statut: 'brouillon',
        chantier: mockChantier,
        lignes: [mockLigne1],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithLignes);
      (prisma.ligneDevis.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.devis.update as jest.Mock).mockResolvedValue({
        ...devisWithLignes,
        totalHT: 200,
        totalTVA: 40,
        totalTTC: 240,
        lignes: [{ description: 'New', quantite: 4, prixUnitaireHT: 50, montantHT: 200 }],
      });

      const response = await request(app.getHttpServer())
        .put(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({
          lignes: [{ description: 'New', quantite: 4, unite: 'u', prixUnitaireHT: 50 }],
        })
        .expect(200);

      expect(response.body.totalHT).toBe(200);
    });

    it('should return 400 when updating non-brouillon devis', async () => {
      const envoyeDevis = {
        ...mockDevis,
        statut: 'envoye',
        chantier: mockChantier,
        lignes: [],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(envoyeDevis);

      const response = await request(app.getHttpServer())
        .put(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ notes: 'Test' })
        .expect(400);

      expect(response.body.message).toContain('brouillon');
    });

    it('should return 404 for non-existent devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/devis/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ notes: 'Test' })
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .put(`/devis/${DEVIS_ID}`)
        .send({ notes: 'Test' })
        .expect(401);
    });
  });

  describe('PATCH /devis/:id/statut', () => {
    it('should update from brouillon to envoye', async () => {
      const devis = { ...mockDevis, statut: 'brouillon', lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devis);
      (prisma.devis.update as jest.Mock).mockResolvedValue({ ...devis, statut: 'envoye' });

      const response = await request(app.getHttpServer())
        .patch(`/devis/${DEVIS_ID}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'envoye' })
        .expect(200);

      expect(response.body.statut).toBe('envoye');
    });

    it('should set dateAcceptation when accepting', async () => {
      const devis = { ...mockDevis, statut: 'envoye', lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devis);
      (prisma.devis.update as jest.Mock).mockResolvedValue({
        ...devis,
        statut: 'accepte',
        dateAcceptation: new Date(),
      });

      const response = await request(app.getHttpServer())
        .patch(`/devis/${DEVIS_ID}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'accepte' })
        .expect(200);

      expect(response.body.statut).toBe('accepte');
      expect(prisma.devis.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            statut: 'accepte',
            dateAcceptation: expect.any(Date),
          }),
        }),
      );
    });

    it('should update from envoye to refuse', async () => {
      const devis = { ...mockDevis, statut: 'envoye', lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devis);
      (prisma.devis.update as jest.Mock).mockResolvedValue({ ...devis, statut: 'refuse' });

      const response = await request(app.getHttpServer())
        .patch(`/devis/${DEVIS_ID}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'refuse' })
        .expect(200);

      expect(response.body.statut).toBe('refuse');
    });

    it('should return 404 for non-existent devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch('/devis/non-existent-id/statut')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'envoye' })
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/devis/${DEVIS_ID}/statut`)
        .send({ statut: 'envoye' })
        .expect(401);
    });
  });

  describe('DELETE /devis/:id', () => {
    it('should delete devis without factures', async () => {
      const devis = { ...mockDevis, lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devis);
      (prisma.devis.delete as jest.Mock).mockResolvedValue(devis);

      const response = await request(app.getHttpServer())
        .delete(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(DEVIS_ID);
    });

    it('should return 400 when devis has factures', async () => {
      const devisWithFactures = {
        ...mockDevis,
        lignes: [],
        factures: [{ id: FACTURE_ID, numero: 'FAC-001', statut: 'brouillon' }],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithFactures);

      const response = await request(app.getHttpServer())
        .delete(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('factures');
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .delete(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/devis/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/devis/${DEVIS_ID}`)
        .expect(401);
    });
  });
});
