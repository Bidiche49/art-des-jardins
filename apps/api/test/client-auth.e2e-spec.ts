import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { createMockClient } from './helpers/test-utils';
import { ConfigService } from '@nestjs/config';
import { JWT_TEST_SECRET } from './helpers/jwt.helper';

describe('ClientAuth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockClient = createMockClient({ id: 'client-id-123' });

  const mockAuthToken = {
    id: 'token-id-123',
    clientId: mockClient.id,
    token: 'valid-magic-token',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    used: false,
    createdAt: new Date(),
  };

  const mockExpiredToken = {
    ...mockAuthToken,
    id: 'expired-token-id',
    token: 'expired-magic-token',
    expiresAt: new Date(Date.now() - 60 * 1000),
  };

  const mockUsedToken = {
    ...mockAuthToken,
    id: 'used-token-id',
    token: 'used-magic-token',
    used: true,
  };

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
            CLIENT_PORTAL_URL: 'http://localhost:5173/client',
            SMTP_HOST: 'smtp.test.com',
            SMTP_FROM: 'noreply@test.com',
          };
          return config[key];
        }),
      })
      .overrideProvider(PrismaService)
      .useValue({
        client: {
          findUnique: jest.fn(),
          findFirst: jest.fn(),
        },
        clientAuthToken: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findFirst: jest.fn(),
          update: jest.fn(),
          deleteMany: jest.fn(),
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
  });

  describe('POST /client-auth/request-link', () => {
    describe('with valid email', () => {
      it('should return 200 and send magic link for existing client', async () => {
        (prisma.client.findFirst as jest.Mock).mockResolvedValue(mockClient);
        (prisma.clientAuthToken.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
        (prisma.clientAuthToken.create as jest.Mock).mockResolvedValue(mockAuthToken);

        const response = await request(app.getHttpServer())
          .post('/client-auth/request-link')
          .send({ email: mockClient.email })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        expect(prisma.client.findFirst).toHaveBeenCalledWith({
          where: { email: mockClient.email },
        });
      });

      it('should return 200 even for non-existent client (security)', async () => {
        (prisma.client.findFirst as jest.Mock).mockResolvedValue(null);

        const response = await request(app.getHttpServer())
          .post('/client-auth/request-link')
          .send({ email: 'unknown@example.com' })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      });
    });

    describe('with invalid body', () => {
      it('should return 400 without email', async () => {
        await request(app.getHttpServer())
          .post('/client-auth/request-link')
          .send({})
          .expect(400);
      });

      it('should return 400 with invalid email format', async () => {
        await request(app.getHttpServer())
          .post('/client-auth/request-link')
          .send({ email: 'not-an-email' })
          .expect(400);
      });
    });
  });

  describe('POST /client-auth/verify', () => {
    describe('with valid token', () => {
      it('should return 200 with JWT for valid magic link token', async () => {
        (prisma.clientAuthToken.findFirst as jest.Mock).mockResolvedValue({
          ...mockAuthToken,
          client: mockClient,
        });
        (prisma.clientAuthToken.update as jest.Mock).mockResolvedValue({
          ...mockAuthToken,
          used: true,
        });

        const response = await request(app.getHttpServer())
          .post('/client-auth/verify')
          .send({ token: mockAuthToken.token })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('client');
        expect(response.body.client.id).toBe(mockClient.id);
        expect(prisma.clientAuthToken.update).toHaveBeenCalledWith({
          where: { id: mockAuthToken.id },
          data: { used: true },
        });
      });
    });

    describe('with invalid token', () => {
      it('should return 401 for expired token', async () => {
        (prisma.clientAuthToken.findFirst as jest.Mock).mockResolvedValue({
          ...mockExpiredToken,
          client: mockClient,
        });

        const response = await request(app.getHttpServer())
          .post('/client-auth/verify')
          .send({ token: mockExpiredToken.token })
          .expect(401);

        expect(response.body.message).toContain('expire');
      });

      it('should return 401 for already used token', async () => {
        (prisma.clientAuthToken.findFirst as jest.Mock).mockResolvedValue({
          ...mockUsedToken,
          client: mockClient,
        });

        const response = await request(app.getHttpServer())
          .post('/client-auth/verify')
          .send({ token: mockUsedToken.token })
          .expect(401);

        expect(response.body.message).toContain('utilise');
      });

      it('should return 401 for non-existent token', async () => {
        (prisma.clientAuthToken.findFirst as jest.Mock).mockResolvedValue(null);

        await request(app.getHttpServer())
          .post('/client-auth/verify')
          .send({ token: 'invalid-token' })
          .expect(401);
      });
    });

    describe('with invalid body', () => {
      it('should return 400 without token', async () => {
        await request(app.getHttpServer())
          .post('/client-auth/verify')
          .send({})
          .expect(400);
      });
    });
  });
});
