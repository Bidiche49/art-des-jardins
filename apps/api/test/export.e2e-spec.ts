import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
  createMockClient,
  createMockChantier,
  createMockDevis,
  createMockFacture,
  createMockIntervention,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Export (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  // Valid UUIDs (v4 format)
  const PATRON_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const EMPLOYE_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const CLIENT_ID = 'c1111111-1111-4111-8111-111111111111';
  const CHANTIER_ID = 'c2222222-2222-4222-8222-222222222222';
  const DEVIS_ID = 'd1111111-1111-4111-8111-111111111111';
  const FACTURE_ID = 'f1111111-1111-4111-8111-111111111111';
  const INTERVENTION_ID = 'i1111111-1111-4111-8111-111111111111';

  const mockPatron = createMockPatron({ id: PATRON_ID });
  const mockEmploye = createMockEmploye({ id: EMPLOYE_ID });
  const mockClient = createMockClient({ id: CLIENT_ID, createdAt: new Date() });
  const mockChantier = {
    ...createMockChantier(CLIENT_ID, { id: CHANTIER_ID }),
    createdAt: new Date(),
  };
  const mockDevis = {
    ...createMockDevis(CHANTIER_ID, { id: DEVIS_ID }),
    dateEmission: new Date(),
    dateValidite: new Date(),
    createdAt: new Date(),
  };
  const mockFacture = {
    ...createMockFacture(DEVIS_ID, { id: FACTURE_ID }),
    dateEmission: new Date(),
    dateEcheance: new Date(),
    createdAt: new Date(),
  };
  const mockIntervention = {
    ...createMockIntervention(CHANTIER_ID, EMPLOYE_ID, { id: INTERVENTION_ID }),
    date: new Date(),
    heureDebut: new Date(),
    heureFin: new Date(),
  };

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
          findMany: jest.fn(),
        },
        client: {
          findMany: jest.fn(),
        },
        chantier: {
          findMany: jest.fn(),
        },
        devis: {
          findMany: jest.fn(),
        },
        facture: {
          findMany: jest.fn(),
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
    (prisma.user.findUnique as jest.Mock).mockImplementation(({ where }) => {
      if (where.id === PATRON_ID) return Promise.resolve(mockPatron);
      if (where.id === EMPLOYE_ID) return Promise.resolve(mockEmploye);
      return Promise.resolve(null);
    });
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { ...mockPatron, createdAt: new Date() },
      { ...mockEmploye, createdAt: new Date() },
    ]);
    (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient]);
    (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier]);
    (prisma.devis.findMany as jest.Mock).mockResolvedValue([mockDevis]);
    (prisma.facture.findMany as jest.Mock).mockResolvedValue([mockFacture]);
    (prisma.intervention.findMany as jest.Mock).mockResolvedValue([mockIntervention]);
  });

  describe('GET /export/tables', () => {
    it('should return list of exportable tables', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/tables')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.tables).toContain('clients');
      expect(response.body.tables).toContain('chantiers');
      expect(response.body.tables).toContain('devis');
      expect(response.body.tables).toContain('factures');
      expect(response.body.tables).toContain('interventions');
      expect(response.body.tables).toContain('users');
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .get('/export/tables')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/export/tables')
        .expect(401);
    });
  });

  describe('GET /export/csv/:table', () => {
    it('should export clients CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('clients_');
      expect(response.text).toContain('ID;Type;Nom;Prenom;Email');
    });

    it('should export chantiers CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('ID;ClientID;Adresse;CodePostal');
    });

    it('should export devis CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/devis')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('ID;Numero;ChantierID');
    });

    it('should export factures CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/factures')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('ID;Numero;DevisID');
    });

    it('should export interventions CSV', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/interventions')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('ID;ChantierID;EmployeID');
    });

    it('should export users CSV without passwordHash', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/users')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('ID;Email;Nom;Prenom;Role');
      expect(response.text).not.toContain('passwordHash');
    });

    it('should return 400 for invalid table', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/csv/invalid_table')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(400);

      expect(response.body.message).toContain('non exportable');
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .get('/export/csv/clients')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/export/csv/clients')
        .expect(401);
    });
  });

  describe('GET /export/full', () => {
    it('should export ZIP for patron', async () => {
      const response = await request(app.getHttpServer())
        .get('/export/full')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/zip');
      expect(response.headers['content-disposition']).toContain('export_complet_');
      // Check that response body exists (ZIP format)
      expect(response.body).toBeDefined();
    });

    it('should return 403 for employe', async () => {
      await request(app.getHttpServer())
        .get('/export/full')
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/export/full')
        .expect(401);
    });
  });
});
