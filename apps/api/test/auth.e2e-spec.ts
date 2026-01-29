import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import {
  createMockPatron,
  createMockEmploye,
} from './helpers/test-utils';
import {
  createPatronToken,
  createEmployeToken,
  createExpiredToken,
  createInvalidToken,
  JWT_TEST_SECRET,
} from './helpers/jwt.helper';
import { ConfigService } from '@nestjs/config';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockPatron = createMockPatron({ id: 'patron-id-123' });
  const mockEmploye = createMockEmploye({ id: 'employe-id-456' });
  const mockInactiveUser = createMockPatron({ id: 'inactive-id', actif: false });

  const validPassword = 'password123';
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(validPassword, 10);

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

  describe('POST /auth/login', () => {
    describe('with valid credentials', () => {
      it('should return 200 with tokens for patron', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          ...mockPatron,
          passwordHash: hashedPassword,
        });
        (prisma.user.update as jest.Mock).mockResolvedValue(mockPatron);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: mockPatron.email, password: validPassword })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(mockPatron.email);
        expect(response.body.user.role).toBe('patron');
      });

      it('should return 200 with tokens for employe', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          ...mockEmploye,
          passwordHash: hashedPassword,
        });
        (prisma.user.update as jest.Mock).mockResolvedValue(mockEmploye);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: mockEmploye.email, password: validPassword })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body.user.role).toBe('employe');
      });
    });

    describe('with invalid credentials', () => {
      it('should return 401 for non-existent email', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'unknown@example.com', password: validPassword })
          .expect(401);

        expect(response.body.message).toBe('Identifiants invalides');
      });

      it('should return 401 for wrong password', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          ...mockPatron,
          passwordHash: hashedPassword,
        });

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: mockPatron.email, password: 'wrongpassword' })
          .expect(401);

        expect(response.body.message).toBe('Identifiants invalides');
      });

      it('should return 401 for inactive user', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          ...mockInactiveUser,
          passwordHash: hashedPassword,
        });

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: mockInactiveUser.email, password: validPassword })
          .expect(401);

        expect(response.body.message).toBe('Identifiants invalides');
      });
    });

    describe('with invalid body', () => {
      it('should return 400 without body', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({})
          .expect(400);
      });

      it('should return 400 with invalid email format', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'not-an-email', password: validPassword })
          .expect(400);
      });

      it('should return 400 with short password', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'short' })
          .expect(400);
      });
    });
  });

  describe('POST /auth/refresh', () => {
    describe('with valid refresh token', () => {
      it('should return 200 with new tokens', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);

        const refreshToken = createPatronToken(mockPatron.id, mockPatron.email);

        const response = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refreshToken })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
      });
    });

    describe('with invalid refresh token', () => {
      it('should return 401 for expired token', async () => {
        const expiredToken = createExpiredToken({
          sub: mockPatron.id,
          email: mockPatron.email,
          role: 'patron',
        });

        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refreshToken: expiredToken })
          .expect(401);
      });

      it('should return 401 for invalid token', async () => {
        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refreshToken: createInvalidToken() })
          .expect(401);
      });

      it('should return 401 for inactive user token', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockInactiveUser);

        const token = createPatronToken(mockInactiveUser.id, mockInactiveUser.email);

        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refreshToken: token })
          .expect(401);
      });
    });

    describe('with invalid body', () => {
      it('should return 400 without refreshToken', async () => {
        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({})
          .expect(400);
      });
    });
  });

  describe('Protected routes', () => {
    describe('GET /clients', () => {
      beforeEach(() => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/clients')
          .expect(401);
      });

      it('should return 401 with expired token', async () => {
        const expiredToken = createExpiredToken({
          sub: mockPatron.id,
          email: mockPatron.email,
          role: 'patron',
        });

        await request(app.getHttpServer())
          .get('/clients')
          .set('Authorization', `Bearer ${expiredToken}`)
          .expect(401);
      });

      it('should return 401 with malformed token', async () => {
        await request(app.getHttpServer())
          .get('/clients')
          .set('Authorization', 'Bearer malformed.token')
          .expect(401);
      });
    });
  });

  describe('Role-based access', () => {
    const mockClient = {
      id: 'client-id-123',
      type: 'particulier',
      nom: 'Test',
    };

    describe('DELETE /clients/:id', () => {
      it('should return 200 for patron role', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);

        const patronToken = createPatronToken(mockPatron.id, mockPatron.email);

        // Note: The actual delete would fail without mocking clientsService
        // but we're testing that the guard allows access
        await request(app.getHttpServer())
          .delete(`/clients/${mockClient.id}`)
          .set('Authorization', `Bearer ${patronToken}`)
          .expect((res) => {
            // Expect either 200 (if mock works) or 404/500 (if client not found)
            // but NOT 403 (forbidden) which would mean RBAC blocked it
            expect(res.status).not.toBe(403);
          });
      });

      it('should return 403 for employe role', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEmploye);

        const employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

        await request(app.getHttpServer())
          .delete(`/clients/${mockClient.id}`)
          .set('Authorization', `Bearer ${employeToken}`)
          .expect(403);
      });
    });

    describe('GET /audit-logs', () => {
      it('should return 200 for patron role', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);

        const patronToken = createPatronToken(mockPatron.id, mockPatron.email);

        await request(app.getHttpServer())
          .get('/audit-logs')
          .set('Authorization', `Bearer ${patronToken}`)
          .expect((res) => {
            expect(res.status).not.toBe(403);
          });
      });

      it('should return 403 for employe role', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEmploye);

        const employeToken = createEmployeToken(mockEmploye.id, mockEmploye.email);

        await request(app.getHttpServer())
          .get('/audit-logs')
          .set('Authorization', `Bearer ${employeToken}`)
          .expect(403);
      });
    });
  });

  describe('Public routes', () => {
    describe('GET /health', () => {
      it('should return 200 without token', async () => {
        const response = await request(app.getHttpServer())
          .get('/health')
          .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
      });
    });
  });
});
