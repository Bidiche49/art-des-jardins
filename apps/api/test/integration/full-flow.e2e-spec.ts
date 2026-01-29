import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
  createMockClient,
  createMockChantier,
  createMockDevis,
  createMockLigneDevis,
  createMockFacture,
} from '../helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from '../helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

/**
 * Tests d'intégration de bout en bout
 * Simule un flow métier complet : Client → Chantier → Devis → Facture → Paiement
 */
describe('Integration Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  // UUIDs
  const PATRON_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const EMPLOYE_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const CLIENT_ID = 'c1111111-1111-4111-8111-111111111111';
  const CHANTIER_ID = 'c2222222-2222-4222-8222-222222222222';
  const DEVIS_ID = 'd1111111-1111-4111-8111-111111111111';
  const FACTURE_ID = 'f1111111-1111-4111-8111-111111111111';
  // INTERVENTION_ID reserved for future tests

  // Mocks
  const mockPatron = createMockPatron({ id: PATRON_ID });
  const mockEmploye = createMockEmploye({ id: EMPLOYE_ID });
  const mockClient = createMockClient({
    id: CLIENT_ID,
    type: 'professionnel',
    nom: 'Entreprise Test',
    raisonSociale: 'SARL Test',
  });
  const mockChantier = createMockChantier(CLIENT_ID, {
    id: CHANTIER_ID,
    adresse: '10 rue Test',
    ville: 'Angers',
    statut: 'lead',
  });
  const mockLignes = [
    createMockLigneDevis(DEVIS_ID, {
      description: 'Tonte pelouse',
      quantite: 100,
      unite: 'm2',
      prixUnitaireHT: 0.5,
      tva: 20,
      montantHT: 50,
      montantTTC: 60,
    }),
    createMockLigneDevis(DEVIS_ID, {
      description: 'Taille haies',
      quantite: 20,
      unite: 'ml',
      prixUnitaireHT: 5,
      tva: 20,
      montantHT: 100,
      montantTTC: 120,
    }),
    createMockLigneDevis(DEVIS_ID, {
      description: 'Evacuation déchets',
      quantite: 1,
      unite: 'forfait',
      prixUnitaireHT: 50,
      tva: 20,
      montantHT: 50,
      montantTTC: 60,
    }),
  ];
  const mockDevis = createMockDevis(CHANTIER_ID, {
    id: DEVIS_ID,
    numero: 'DEV-202601-001',
    statut: 'brouillon',
    totalHT: 200,
    totalTVA: 40,
    totalTTC: 240,
  });
  const mockFacture = createMockFacture(DEVIS_ID, {
    id: FACTURE_ID,
    numero: 'FAC-202601-001',
    statut: 'brouillon',
    totalHT: 200,
    totalTVA: 40,
    totalTTC: 240,
  });

  const patronToken = createPatronToken(PATRON_ID, mockPatron.email);
  const employeToken = createEmployeToken(EMPLOYE_ID, mockEmploye.email);

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
          update: jest.fn(),
        },
        client: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
        },
        chantier: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
        },
        devis: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
        },
        ligneDevis: {
          deleteMany: jest.fn(),
        },
        facture: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
        },
        intervention: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findFirst: jest.fn(),
          findMany: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
        },
        sequence: {
          upsert: jest.fn(),
        },
        auditLog: {
          create: jest.fn(),
          findMany: jest.fn(),
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
    (prisma.sequence.upsert as jest.Mock).mockResolvedValue({ lastValue: 1 });
  });

  describe('Flow 1: Client → Chantier → Devis → Facture → Paiement', () => {
    it('Step 1: Créer un client professionnel', async () => {
      (prisma.client.create as jest.Mock).mockResolvedValue(mockClient);

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({
          type: 'professionnel',
          nom: 'Entreprise Test',
          raisonSociale: 'SARL Test',
          email: 'contact@test.com',
          telephone: '0612345678',
          adresse: '10 rue Test',
          codePostal: '49000',
          ville: 'Angers',
        })
        .expect(201);

      expect(response.body.type).toBe('professionnel');
      expect(response.body.raisonSociale).toBe('SARL Test');
    });

    it('Step 2: Créer un chantier pour le client', async () => {
      (prisma.chantier.create as jest.Mock).mockResolvedValue({
        ...mockChantier,
        client: { id: CLIENT_ID, nom: 'Test', prenom: 'Client' },
      });

      const response = await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({
          clientId: CLIENT_ID,
          adresse: '10 rue Test',
          codePostal: '49000',
          ville: 'Angers',
          typePrestation: ['paysagisme', 'entretien'],
          description: 'Aménagement jardin complet',
        })
        .expect(201);

      expect(response.body.clientId).toBe(CLIENT_ID);
      expect(response.body.statut).toBe('lead');
    });

    it('Step 3: Créer un devis avec 3 lignes et vérifier les calculs', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier);
      (prisma.devis.create as jest.Mock).mockResolvedValue({
        ...mockDevis,
        lignes: mockLignes,
        chantier: { id: CHANTIER_ID, adresse: 'Test', client: { id: CLIENT_ID, nom: 'Test' } },
      });

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({
          chantierId: CHANTIER_ID,
          lignes: [
            { description: 'Tonte pelouse', quantite: 100, unite: 'm2', prixUnitaireHT: 0.5 },
            { description: 'Taille haies', quantite: 20, unite: 'ml', prixUnitaireHT: 5 },
            { description: 'Evacuation déchets', quantite: 1, unite: 'forfait', prixUnitaireHT: 50 },
          ],
        })
        .expect(201);

      // Vérifier les totaux calculés (mocked)
      expect(response.body.totalHT).toBe(200); // 50 + 100 + 50
      expect(response.body.totalTVA).toBe(40); // 20% de 200
      expect(response.body.totalTTC).toBe(240); // 200 + 40
      expect(response.body.statut).toBe('brouillon');
    });

    it('Step 4: Passer le devis en "envoyé"', async () => {
      const devisWithRelations = { ...mockDevis, lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisWithRelations);
      (prisma.devis.update as jest.Mock).mockResolvedValue({
        ...mockDevis,
        statut: 'envoye',
      });

      const response = await request(app.getHttpServer())
        .patch(`/devis/${DEVIS_ID}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'envoye' })
        .expect(200);

      expect(response.body.statut).toBe('envoye');
    });

    it('Step 5: Passer le devis en "accepté" (dateAcceptation set)', async () => {
      const devisEnvoye = { ...mockDevis, statut: 'envoye', lignes: [], factures: [] };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisEnvoye);
      (prisma.devis.update as jest.Mock).mockResolvedValue({
        ...mockDevis,
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
            dateAcceptation: expect.any(Date),
          }),
        }),
      );
    });

    it('Step 6: Créer une facture depuis le devis (lignes copiées)', async () => {
      const devisAccepte = {
        ...mockDevis,
        statut: 'accepte',
        lignes: mockLignes,
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisAccepte);
      (prisma.facture.create as jest.Mock).mockResolvedValue({
        ...mockFacture,
        lignes: mockLignes,
        devis: { numero: 'DEV-202601-001', chantier: { adresse: 'Test', client: { nom: 'Test' } } },
      });

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(201);

      expect(response.body.numero).toMatch(/^FAC-/);
      expect(response.body.totalHT).toBe(200);
      expect(response.body.totalTTC).toBe(240);
    });

    it('Step 7: Marquer la facture comme payée', async () => {
      const factureWithRelations = { ...mockFacture, devis: mockDevis, lignes: mockLignes };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(factureWithRelations);
      (prisma.facture.update as jest.Mock).mockResolvedValue({
        ...mockFacture,
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: 'virement',
        referencePaiement: 'VIR-2026-001',
      });

      const response = await request(app.getHttpServer())
        .patch(`/factures/${FACTURE_ID}/payer`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ modePaiement: 'virement', referencePaiement: 'VIR-2026-001' })
        .expect(200);

      expect(response.body.statut).toBe('payee');
      expect(response.body.modePaiement).toBe('virement');
      expect(response.body.datePaiement).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('Tentative modification devis accepté → 400', async () => {
      const devisAccepte = {
        ...mockDevis,
        statut: 'accepte',
        chantier: mockChantier,
        lignes: mockLignes,
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisAccepte);

      const response = await request(app.getHttpServer())
        .put(`/devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ notes: 'Modification tentée' })
        .expect(400);

      expect(response.body.message).toContain('brouillon');
    });

    it('Tentative suppression facture payée → 400', async () => {
      const facturePayee = {
        ...mockFacture,
        statut: 'payee',
        devis: mockDevis,
        lignes: mockLignes,
      };
      (prisma.facture.findUnique as jest.Mock).mockResolvedValue(facturePayee);

      const response = await request(app.getHttpServer())
        .delete(`/factures/${FACTURE_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('payee');
    });

    it('Tentative création devis sur chantier inexistant → 404', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({
          chantierId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',  // UUID v4 valide
          lignes: [{ description: 'Test', quantite: 1, unite: 'u', prixUnitaireHT: 10 }],
        })
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('Tentative création facture depuis devis brouillon → 400', async () => {
      const devisBrouillon = {
        ...mockDevis,
        statut: 'brouillon',
        lignes: mockLignes,
        factures: [],
      };
      (prisma.devis.findUnique as jest.Mock).mockResolvedValue(devisBrouillon);

      const response = await request(app.getHttpServer())
        .post(`/factures/from-devis/${DEVIS_ID}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('accepte');
    });

    it('Employé ne peut pas supprimer un client → 403', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${CLIENT_ID}`)
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('Employé ne peut pas accéder aux logs audit → 403', async () => {
      await request(app.getHttpServer())
        .get('/audit-logs')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('Employé ne peut pas exporter les données → 403', async () => {
      await request(app.getHttpServer())
        .get('/export/csv/clients')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });
  });
});
