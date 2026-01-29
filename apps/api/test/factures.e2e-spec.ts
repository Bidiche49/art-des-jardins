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
  createMockFacture,
  createMockLigneDevis,
  createMockClient,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Factures (e2e)', () => {
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
  const FACTURE_ID_2 = 'f2222222-2222-4222-8222-222222222222';

  const mockPatron = createMockPatron({ id: PATRON_ID });
  const mockEmploye = createMockEmploye({ id: EMPLOYE_ID });
  const mockClient = createMockClient({ id: CLIENT_ID });
  const mockChantier = createMockChantier(CLIENT_ID, { id: CHANTIER_ID });

  const mockDevisAccepte = createMockDevis(CHANTIER_ID, {
    id: DEVIS_ID,
    numero: 'DEV-202601-001',
    statut: 'accepte',
    totalHT: 1000,
    totalTVA: 200,
    totalTTC: 1200,
  });

  const mockDevisBrouillon = createMockDevis(CHANTIER_ID, {
    id: DEVIS_ID_2,
    numero: 'DEV-202601-002',
    statut: 'brouillon',
  });

  const mockLigneDevis = createMockLigneDevis(DEVIS_ID, {
    description: 'Test',
    quantite: 10,
    prixUnitaireHT: 100,
    montantHT: 1000,
    montantTTC: 1200,
  });

  const mockFacture = createMockFacture(DEVIS_ID, {
    id: FACTURE_ID,
    numero: 'FAC-202601-001',
    statut: 'brouillon',
    totalHT: 1000,
    totalTVA: 200,
    totalTTC: 1200,
  });

  const mockFacturePayee = createMockFacture(DEVIS_ID, {
    id: FACTURE_ID_2,
    numero: 'FAC-202601-002',
    statut: 'payee',
    datePaiement: new Date(),
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
        devis: {
          findUnique: jest.fn(),
        },
        facture: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn(),
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

  describe('POST /factures/from-devis/:devisId', () => {
    beforeEach(() => {
      (prisma.sequence.upsert as jest.Mock).mockResolvedValue({ id: 'FAC-202601', lastValue: 1 });
    });

    it('should create facture from accepted devis', async () => {
      const devisWithLignes = {
        ...mockDevisAccepte,
        lignes: [mockLigneDevis],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithLignes);

      const createdFacture = {
        id: 'new-facture-id',
        numero: 'FAC-202601-001',
        devisId: DEVIS_ID,
        statut: 'brouillon',
        totalHT: 1000,
        totalTVA: 200,
        totalTTC: 1200,
        lignes: [{ description: 'Test', montantHT: 1000 }],
        devis: { numero: 'DEV-202601-001', chantier: { adresse: 'Test', client: { nom: 'Test' } } },
      };
      (prisma.facture.create as jest.Mock).mockResolvedValue(createdFacture);

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(201);

      expect(response.body.numero).toMatch(/^FAC-\d{6}-\d{3}$/);
      expect(response.body.totalHT).toBe(1000);
      expect(response.body.totalTTC).toBe(1200);
    });

    it('should copy lignes from devis', async () => {
      const devisWithLignes = {
        ...mockDevisAccepte,
        lignes: [mockLigneDevis],
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithLignes);

      const createdFacture = {
        id: 'new-facture-id',
        numero: 'FAC-202601-001',
        lignes: [{ description: 'Test', montantHT: 1000, montantTTC: 1200 }],
        devis: { numero: 'DEV-202601-001' },
      };
      (prisma.facture.create as jest.Mock).mockResolvedValue(createdFacture);

      await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(201);

      expect(prisma.facture.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            lignes: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({
                  description: mockLigneDevis.description,
                }),
              ]),
            }),
          }),
        }),
      );
    });

    it('should return 400 for brouillon devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue({
        ...mockDevisBrouillon,
        lignes: [],
        factures: [],
      });

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID_2}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('accepte');
    });

    it('should return 400 for refuse devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue({
        ...mockDevisAccepte,
        statut: 'refuse',
        lignes: [],
        factures: [],
      });

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('accepte');
    });

    it('should return 400 if devis already has facture', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue({
        ...mockDevisAccepte,
        lignes: [mockLigneDevis],
        factures: [mockFacture],
      });

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('deja une facture');
    });

    it('should return 404 for non-existent devis', async () => {
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/factures/from-devis/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .expect(401);
    });
  });

  describe('GET /factures', () => {
    beforeEach(() => {
      (prisma.facture.findMany as jest.Mock).mockResolvedValue([mockFacture, mockFacturePayee]);
      (prisma.facture.count as jest.Mock).mockResolvedValue(2);
    });

    it('should return paginated list', async () => {
      const response = await request(app.getHttpServer())
        .get('/factures')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter by devisId', async () => {
      await request(app.getHttpServer())
        .get(`/factures?devisId=${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ devisId: DEVIS_ID }),
        }),
      );
    });

    it('should filter by clientId', async () => {
      await request(app.getHttpServer())
        .get(`/factures?clientId=${CLIENT_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            devis: { chantier: { clientId: CLIENT_ID } },
          }),
        }),
      );
    });

    it('should filter by statut', async () => {
      await request(app.getHttpServer())
        .get('/factures?statut=payee')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'payee' }),
        }),
      );
    });

    it('should filter by date range', async () => {
      await request(app.getHttpServer())
        .get('/factures?dateDebut=2026-01-01&dateFin=2026-01-31')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
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

    it('should filter enRetard=true', async () => {
      await request(app.getHttpServer())
        .get('/factures?enRetard=true')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dateEcheance: { lt: expect.any(Date) },
            statut: { notIn: ['payee', 'annulee'] },
          }),
        }),
      );
    });

    it('should search by numero', async () => {
      await request(app.getHttpServer())
        .get('/factures?search=FAC-202601')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.facture.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            numero: { contains: 'FAC-202601', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/factures')
        .expect(401);
    });
  });

  describe('GET /factures/:id', () => {
    it('should return facture with lignes and devis', async () => {
      const factureWithRelations = {
        ...mockFacture,
        devis: { ...mockDevisAccepte, chantier: { ...mockChantier, client: mockClient } },
        lignes: [{ description: 'Test', montantHT: 1000 }],
      };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);

      const response = await request(app.getHttpServer())
        .get(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(FACTURE_ID);
      expect(response.body.devis).toBeDefined();
      expect(response.body.lignes).toBeDefined();
    });

    it('should return 404 for non-existent facture', async () => {
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/factures/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);

      expect(response.body.message).toContain('non trouvee');
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get(`/factures/${FACTURE_ID}`)
        .expect(401);
    });
  });

  describe('PUT /factures/:id', () => {
    it('should update mentions legales', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.update as jest.Mock).mockResolvedValue({
        ...factureWithRelations,
        mentionsLegales: 'Updated mentions',
      });

      const response = await request(app.getHttpServer())
        .put(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ mentionsLegales: 'Updated mentions' })
        .expect(200);

      expect(response.body.mentionsLegales).toBe('Updated mentions');
    });

    it('should update notes', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.update as jest.Mock).mockResolvedValue({
        ...factureWithRelations,
        notes: 'New notes',
      });

      const response = await request(app.getHttpServer())
        .put(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ notes: 'New notes' })
        .expect(200);

      expect(response.body.notes).toBe('New notes');
    });

    it('should return 404 for non-existent facture', async () => {
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/factures/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ notes: 'Test' })
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .put(`/factures/${FACTURE_ID}`)
        .send({ notes: 'Test' })
        .expect(401);
    });
  });

  describe('PATCH /factures/:id/payer', () => {
    it('should mark facture as paid', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.update as jest.Mock).mockResolvedValue({
        ...factureWithRelations,
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: 'virement',
        referencePaiement: 'VIR-123',
      });

      const response = await request(app.getHttpServer())
        .patch(`/factures/${FACTURE_ID}/payer`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ modePaiement: 'virement', referencePaiement: 'VIR-123' })
        .expect(200);

      expect(response.body.statut).toBe('payee');
      expect(response.body.modePaiement).toBe('virement');
      expect(response.body.datePaiement).toBeDefined();
    });

    it('should set datePaiement automatically', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.update as jest.Mock).mockResolvedValue({
        ...factureWithRelations,
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: 'cheque',
      });

      await request(app.getHttpServer())
        .patch(`/factures/${FACTURE_ID}/payer`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ modePaiement: 'cheque' })
        .expect(200);

      expect(prisma.facture.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            datePaiement: expect.any(Date),
          }),
        }),
      );
    });

    it('should return 404 for non-existent facture', async () => {
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch('/factures/non-existent-id/payer')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ modePaiement: 'virement' })
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/factures/${FACTURE_ID}/payer`)
        .send({ modePaiement: 'virement' })
        .expect(401);
    });
  });

  describe('DELETE /factures/:id', () => {
    it('should delete brouillon facture', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.delete as jest.Mock).mockResolvedValue(mockFacture);

      const response = await request(app.getHttpServer())
        .delete(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(FACTURE_ID);
    });

    it('should return 400 for paid facture', async () => {
      const facturePayeeWithRelations = { ...mockFacturePayee, devis: mockDevisAccepte, lignes: [] };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(facturePayeeWithRelations);

      const response = await request(app.getHttpServer())
        .delete(`/factures/${FACTURE_ID_2}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('payee');
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .delete(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent facture', async () => {
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/factures/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/factures/${FACTURE_ID}`)
        .expect(401);
    });
  });
});
