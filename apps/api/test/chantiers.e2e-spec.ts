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
  createMockIntervention,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Chantiers (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  const mockPatron = createMockPatron({ id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' });
  const mockEmploye = createMockEmploye({ id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' });

  const patronToken = createPatronToken(mockPatron.id, mockPatron.email);
  const employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

  const mockClient1 = createMockClient({ id: 'a1111111-1111-4111-8111-111111111111' });
  const mockChantier1 = createMockChantier('a1111111-1111-4111-8111-111111111111', {
    id: 'a2222222-2222-4222-8222-222222222222',
    ville: 'Angers',
    statut: 'lead',
  });
  const mockChantier2 = createMockChantier('a1111111-1111-4111-8111-111111111111', {
    id: 'a3333333-3333-4333-8333-333333333333',
    ville: 'Nantes',
    statut: 'en_cours',
    responsableId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  });
  const mockDevis1 = createMockDevis('a2222222-2222-4222-8222-222222222222', { id: 'a4444444-4444-4444-8444-444444444444' });
  const mockIntervention1 = createMockIntervention('a2222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', { id: 'a5555555-5555-4555-8555-555555555555' });

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
          findUnique: jest.fn(),
        },
        chantier: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn(),
        },
        devis: {
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
      if (where.id === mockPatron.id) return Promise.resolve(mockPatron);
      if (where.id === mockEmploye.id) return Promise.resolve(mockEmploye);
      return Promise.resolve(null);
    });
  });

  describe('GET /chantiers', () => {
    describe('pagination', () => {
      it('should return paginated list with defaults', async () => {
        const mockChantiers = [mockChantier1, mockChantier2];
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue(mockChantiers);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(2);

        const response = await request(app.getHttpServer())
          .get('/chantiers')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta.total).toBe(2);
        expect(response.body.data).toHaveLength(2);
      });
    });

    describe('filtering', () => {
      it('should filter by clientId', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier1, mockChantier2]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(2);

        await request(app.getHttpServer())
          .get('/chantiers?clientId=a1111111-1111-4111-8111-111111111111')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ clientId: 'a1111111-1111-4111-8111-111111111111' }),
          }),
        );
      });

      it('should filter by statut=lead', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier1]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/chantiers?statut=lead')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ statut: 'lead' }),
          }),
        );
      });

      it('should filter by statut=en_cours', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier2]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/chantiers?statut=en_cours')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ statut: 'en_cours' }),
          }),
        );
      });

      it('should filter by responsableId', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier2]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get(`/chantiers?responsableId=${mockEmploye.id}`)
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ responsableId: mockEmploye.id }),
          }),
        );
      });

      it('should filter by ville', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier1]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/chantiers?ville=Angers')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              ville: { contains: 'Angers', mode: 'insensitive' },
            }),
          }),
        );
      });

      it('should search by full-text', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier1]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/chantiers?search=jardin')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: expect.arrayContaining([
                { description: { contains: 'jardin', mode: 'insensitive' } },
              ]),
            }),
          }),
        );
      });

      it('should combine filters', async () => {
        (prisma.chantier.findMany as jest.Mock).mockResolvedValue([mockChantier1]);
        (prisma.chantier.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/chantiers?clientId=a1111111-1111-4111-8111-111111111111&statut=lead&ville=Angers')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.chantier.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              clientId: 'a1111111-1111-4111-8111-111111111111',
              statut: 'lead',
              ville: { contains: 'Angers', mode: 'insensitive' },
            }),
          }),
        );
      });
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/chantiers')
        .expect(401);
    });
  });

  describe('GET /chantiers/:id', () => {
    it('should return chantier with relations for existing chantier', async () => {
      const chantierWithRelations = {
        ...mockChantier1,
        client: mockClient1,
        responsable: mockEmploye,
        devis: [mockDevis1],
        interventions: [{ ...mockIntervention1, employe: mockEmploye }],
      };
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(chantierWithRelations);

      const response = await request(app.getHttpServer())
        .get(`/chantiers/${mockChantier1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(mockChantier1.id);
      expect(response.body.client).toBeDefined();
      expect(response.body.devis).toHaveLength(1);
      expect(response.body.interventions).toHaveLength(1);
    });

    it('should return 404 for non-existent chantier', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/chantiers/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get(`/chantiers/${mockChantier1.id}`)
        .expect(401);
    });
  });

  describe('POST /chantiers', () => {
    const getValidChantierData = () => ({
      clientId: 'a1111111-1111-4111-8111-111111111111',  // UUID valide fixe
      adresse: '10 rue des Fleurs',
      codePostal: '49000',
      ville: 'Angers',
      typePrestation: ['paysagisme'],
      description: 'Aménagement jardin',
    });

    it('should create chantier with valid data', async () => {
      const createdChantier = {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        ...getValidChantierData(),
        statut: 'lead',
        client: { id: 'a1111111-1111-4111-8111-111111111111', nom: 'Test', prenom: 'Client' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.chantier.create as jest.Mock).mockResolvedValue(createdChantier);

      const response = await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(getValidChantierData())
        .expect(201);

      expect(response.body.id).toBe('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
      expect(response.body.clientId).toBe(getValidChantierData().clientId);
    });

    it('should create chantier with responsable', async () => {
      const dataWithResponsable = { ...getValidChantierData(), responsableId: mockEmploye.id };
      const createdChantier = {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        ...dataWithResponsable,
        statut: 'lead',
        client: { id: 'a1111111-1111-4111-8111-111111111111', nom: 'Test', prenom: 'Client' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.chantier.create as jest.Mock).mockResolvedValue(createdChantier);

      const response = await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(dataWithResponsable);

      if (response.status !== 201) {
        console.log('Responsable Error:', response.body, 'Data:', dataWithResponsable);
      }
      expect(response.status).toBe(201);
      expect(response.body.responsableId).toBe(mockEmploye.id);
    });

    it('should create chantier with GPS coordinates', async () => {
      const dataWithGPS = { ...getValidChantierData(), latitude: 47.4784, longitude: -0.5632 };
      const createdChantier = {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        ...dataWithGPS,
        statut: 'lead',
        client: { id: mockClient1.id, nom: 'Test', prenom: 'Client' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.chantier.create as jest.Mock).mockResolvedValue(createdChantier);

      const response = await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(dataWithGPS);

      if (response.status !== 201) {
        console.log('GPS Error:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body.latitude).toBe(47.4784);
      expect(response.body.longitude).toBe(-0.5632);
    });

    it('should create chantier with multiple typePrestation', async () => {
      const dataWithMultipleTypes = {
        ...getValidChantierData(),
        typePrestation: ['paysagisme', 'entretien', 'elagage'],
      };
      const createdChantier = {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        ...dataWithMultipleTypes,
        statut: 'lead',
        client: { id: 'a1111111-1111-4111-8111-111111111111', nom: 'Test', prenom: 'Client' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.chantier.create as jest.Mock).mockResolvedValue(createdChantier);

      const response = await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(dataWithMultipleTypes)
        .expect(201);

      expect(response.body.typePrestation).toHaveLength(3);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({})
        .expect(400);
    });

    it('should return 400 for invalid clientId format', async () => {
      const invalidData = { ...getValidChantierData(), clientId: 'not-a-uuid' };

      await request(app.getHttpServer())
        .post('/chantiers')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/chantiers')
        .send(getValidChantierData())
        .expect(401);
    });
  });

  describe('PUT /chantiers/:id', () => {
    const updateData = {
      description: 'Description mise à jour',
      surface: 200,
    };

    it('should update chantier fully', async () => {
      const fullUpdate = {
        adresse: 'Nouvelle adresse',
        codePostal: '49100',
        ville: 'Nouvelle ville',
        typePrestation: ['elagage'],
        description: 'Nouvelle description',
      };
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier1);
      (prisma.chantier.update as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        ...fullUpdate,
        client: { id: 'a1111111-1111-4111-8111-111111111111', nom: 'Test', prenom: 'Client' },
      });

      const response = await request(app.getHttpServer())
        .put(`/chantiers/${mockChantier1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send(fullUpdate)
        .expect(200);

      expect(response.body.description).toBe(fullUpdate.description);
    });

    it('should update chantier partially', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier1);
      (prisma.chantier.update as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        ...updateData,
        client: { id: 'a1111111-1111-4111-8111-111111111111', nom: 'Test', prenom: 'Client' },
      });

      const response = await request(app.getHttpServer())
        .put(`/chantiers/${mockChantier1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.surface).toBe(updateData.surface);
    });

    it('should return 404 for non-existent chantier', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/chantiers/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(updateData)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .put(`/chantiers/${mockChantier1.id}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('PATCH /chantiers/:id/statut', () => {
    it('should update statut from lead to visite_planifiee', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier1);
      (prisma.chantier.update as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        statut: 'visite_planifiee',
      });

      const response = await request(app.getHttpServer())
        .patch(`/chantiers/${mockChantier1.id}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'visite_planifiee' })
        .expect(200);

      expect(response.body.statut).toBe('visite_planifiee');
    });

    it('should update statut to devis_envoye', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        statut: 'visite_planifiee',
      });
      (prisma.chantier.update as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        statut: 'devis_envoye',
      });

      const response = await request(app.getHttpServer())
        .patch(`/chantiers/${mockChantier1.id}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'devis_envoye' })
        .expect(200);

      expect(response.body.statut).toBe('devis_envoye');
    });

    it('should update statut to accepte', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        statut: 'devis_envoye',
      });
      (prisma.chantier.update as jest.Mock).mockResolvedValue({
        ...mockChantier1,
        statut: 'accepte',
      });

      const response = await request(app.getHttpServer())
        .patch(`/chantiers/${mockChantier1.id}/statut`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'accepte' })
        .expect(200);

      expect(response.body.statut).toBe('accepte');
    });

    it('should return 404 for non-existent chantier', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch('/chantiers/non-existent-id/statut')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ statut: 'en_cours' })
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/chantiers/${mockChantier1.id}/statut`)
        .send({ statut: 'en_cours' })
        .expect(401);
    });
  });

  describe('DELETE /chantiers/:id', () => {
    it('should delete chantier when patron', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(mockChantier1);
      (prisma.chantier.delete as jest.Mock).mockResolvedValue(mockChantier1);

      const response = await request(app.getHttpServer())
        .delete(`/chantiers/${mockChantier1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(mockChantier1.id);
      expect(prisma.chantier.delete).toHaveBeenCalledWith({
        where: { id: mockChantier1.id },
      });
    });

    it('should return 403 when employe', async () => {
      await request(app.getHttpServer())
        .delete(`/chantiers/${mockChantier1.id}`)
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);

      expect(prisma.chantier.delete).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent chantier', async () => {
      (prisma.chantier.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/chantiers/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/chantiers/${mockChantier1.id}`)
        .expect(401);
    });
  });
});
