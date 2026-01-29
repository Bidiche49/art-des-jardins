import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
  createMockClient,
  createMockClientPro,
  createMockChantier,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Clients (e2e)', () => {
  let app: INestApplication;
  let prisma: jest.Mocked<PrismaService>;

  const mockPatron = createMockPatron({ id: 'patron-id-123' });
  const mockEmploye = createMockEmploye({ id: 'employe-id-456' });

  const patronToken = createPatronToken(mockPatron.id, mockPatron.email);
  const employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

  const mockClient1 = createMockClient({ id: 'client-1', nom: 'Dupont', ville: 'Angers' });
  const mockClient2 = createMockClient({ id: 'client-2', nom: 'Martin', ville: 'Nantes' });
  const mockClientPro = createMockClientPro({ id: 'client-pro', ville: 'Angers' });
  const mockChantier1 = createMockChantier('client-1', { id: 'chantier-1' });

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
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn(),
        },
        chantier: {
          findMany: jest.fn(),
        },
        auditLog: {
          create: jest.fn(),
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
    // Setup default user mock for JWT validation
    (prisma.user.findUnique as jest.Mock).mockImplementation(({ where }) => {
      if (where.id === mockPatron.id) return Promise.resolve(mockPatron);
      if (where.id === mockEmploye.id) return Promise.resolve(mockEmploye);
      return Promise.resolve(null);
    });
  });

  describe('GET /clients', () => {
    describe('pagination', () => {
      it('should return paginated list with defaults (page 1, limit 20)', async () => {
        const mockClients = [mockClient1, mockClient2];
        (prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients);
        (prisma.client.count as jest.Mock).mockResolvedValue(2);

        const response = await request(app.getHttpServer())
          .get('/clients')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toEqual({
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        });
        expect(response.body.data).toHaveLength(2);
      });

      it('should return custom pagination (page 2, limit 5)', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient2]);
        (prisma.client.count as jest.Mock).mockResolvedValue(7);

        const response = await request(app.getHttpServer())
          .get('/clients?page=2&limit=5')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(response.body.meta).toEqual({
          total: 7,
          page: 2,
          limit: 5,
          totalPages: 2,
        });
        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 5,
            take: 5,
          }),
        );
      });
    });

    describe('filtering', () => {
      it('should filter by type=particulier', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient1, mockClient2]);
        (prisma.client.count as jest.Mock).mockResolvedValue(2);

        await request(app.getHttpServer())
          .get('/clients?type=particulier')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ type: 'particulier' }),
          }),
        );
      });

      it('should filter by type=professionnel', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClientPro]);
        (prisma.client.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/clients?type=professionnel')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({ type: 'professionnel' }),
          }),
        );
      });

      it('should filter by ville', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient1, mockClientPro]);
        (prisma.client.count as jest.Mock).mockResolvedValue(2);

        await request(app.getHttpServer())
          .get('/clients?ville=Angers')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              ville: { contains: 'Angers', mode: 'insensitive' },
            }),
          }),
        );
      });

      it('should search by nom', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient1]);
        (prisma.client.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/clients?search=Dupont')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: expect.arrayContaining([
                { nom: { contains: 'Dupont', mode: 'insensitive' } },
              ]),
            }),
          }),
        );
      });

      it('should search by email', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient1]);
        (prisma.client.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/clients?search=client@example')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: expect.arrayContaining([
                { email: { contains: 'client@example', mode: 'insensitive' } },
              ]),
            }),
          }),
        );
      });

      it('should combine filters', async () => {
        (prisma.client.findMany as jest.Mock).mockResolvedValue([mockClient1]);
        (prisma.client.count as jest.Mock).mockResolvedValue(1);

        await request(app.getHttpServer())
          .get('/clients?type=particulier&ville=Angers&search=Dupont')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect(200);

        expect(prisma.client.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              type: 'particulier',
              ville: { contains: 'Angers', mode: 'insensitive' },
              OR: expect.any(Array),
            }),
          }),
        );
      });
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/clients')
        .expect(401);
    });
  });

  describe('GET /clients/:id', () => {
    it('should return client with chantiers for existing client', async () => {
      const clientWithChantiers = { ...mockClient1, chantiers: [mockChantier1] };
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(clientWithChantiers);

      const response = await request(app.getHttpServer())
        .get(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(mockClient1.id);
      expect(response.body.nom).toBe(mockClient1.nom);
      expect(response.body.chantiers).toHaveLength(1);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: mockClient1.id },
        include: {
          chantiers: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    });

    it('should return 404 for non-existent client', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/clients/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);

      expect(response.body.message).toContain('non trouve');
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get(`/clients/${mockClient1.id}`)
        .expect(401);
    });
  });

  describe('POST /clients', () => {
    const validClientData = {
      type: 'particulier',
      nom: 'Nouveau',
      prenom: 'Client',
      email: 'nouveau@example.com',
      telephone: '0612345678',
      adresse: '10 rue Test',
      codePostal: '49000',
      ville: 'Angers',
    };

    it('should create client particulier', async () => {
      const createdClient = { id: 'new-client-id', ...validClientData, createdAt: new Date(), updatedAt: new Date() };
      (prisma.client.create as jest.Mock).mockResolvedValue(createdClient);

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(validClientData)
        .expect(201);

      expect(response.body.id).toBe('new-client-id');
      expect(response.body.nom).toBe(validClientData.nom);
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: expect.objectContaining(validClientData),
      });
    });

    it('should create client professionnel with raisonSociale', async () => {
      const proData = {
        type: 'professionnel',
        nom: 'SARL Test',
        raisonSociale: 'SARL Test Entreprise',
        email: 'contact@sarl.com',
        telephone: '0612345678',
        adresse: '20 rue Pro',
        codePostal: '49100',
        ville: 'Angers',
      };
      const createdClient = { id: 'pro-id', ...proData, createdAt: new Date(), updatedAt: new Date() };
      (prisma.client.create as jest.Mock).mockResolvedValue(createdClient);

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(proData)
        .expect(201);

      expect(response.body.type).toBe('professionnel');
      expect(response.body.raisonSociale).toBe(proData.raisonSociale);
    });

    it('should create client syndic', async () => {
      const syndicData = {
        type: 'syndic',
        nom: 'Syndic ABC',
        raisonSociale: 'Copropriété ABC',
        email: 'syndic@copro.com',
        telephone: '0612345678',
        adresse: '30 rue Copro',
        codePostal: '75001',
        ville: 'Paris',
      };
      const createdClient = { id: 'syndic-id', ...syndicData, createdAt: new Date(), updatedAt: new Date() };
      (prisma.client.create as jest.Mock).mockResolvedValue(createdClient);

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(syndicData)
        .expect(201);

      expect(response.body.type).toBe('syndic');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = { ...validClientData, email: 'not-an-email' };

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('email')]),
      );
    });

    it('should return 400 for invalid code postal', async () => {
      const invalidData = { ...validClientData, codePostal: '123' };

      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Code postal invalide');
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${patronToken}`)
        .send({})
        .expect(400);
    });

    it('should allow employe to create clients', async () => {
      (prisma.client.create as jest.Mock).mockResolvedValue({ id: 'new-id', ...validClientData });

      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${employeToken}`)
        .send(validClientData)
        .expect(201);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/clients')
        .send(validClientData)
        .expect(401);
    });
  });

  describe('PUT /clients/:id', () => {
    const updateData = {
      nom: 'Dupont-Modifie',
      telephone: '0698765432',
    };

    it('should update client fully', async () => {
      const fullUpdate = {
        type: 'particulier',
        nom: 'Nouveau Nom',
        prenom: 'Nouveau Prenom',
        email: 'nouveau@email.com',
        telephone: '0612345678',
        adresse: 'Nouvelle Adresse',
        codePostal: '49100',
        ville: 'Nouvelle Ville',
      };
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient1);
      (prisma.client.update as jest.Mock).mockResolvedValue({ ...mockClient1, ...fullUpdate });

      const response = await request(app.getHttpServer())
        .put(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send(fullUpdate)
        .expect(200);

      expect(response.body.nom).toBe(fullUpdate.nom);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: mockClient1.id },
        data: expect.objectContaining(fullUpdate),
      });
    });

    it('should update client partially', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient1);
      (prisma.client.update as jest.Mock).mockResolvedValue({ ...mockClient1, ...updateData });

      const response = await request(app.getHttpServer())
        .put(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nom).toBe(updateData.nom);
    });

    it('should return 404 for non-existent client', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/clients/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .send(updateData)
        .expect(404);
    });

    it('should return 400 for invalid data', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient1);

      await request(app.getHttpServer())
        .put(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ email: 'invalid-email' })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .put(`/clients/${mockClient1.id}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('DELETE /clients/:id', () => {
    it('should delete client when patron', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient1);
      (prisma.client.delete as jest.Mock).mockResolvedValue(mockClient1);

      const response = await request(app.getHttpServer())
        .delete(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body.id).toBe(mockClient1.id);
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: mockClient1.id },
      });
    });

    it('should return 403 when employe', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${mockClient1.id}`)
        .set('Authorization', `Bearer ${employeToken}`)
        .expect(403);

      expect(prisma.client.delete).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent client', async () => {
      (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/clients/non-existent-id')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${mockClient1.id}`)
        .expect(401);
    });
  });
});
