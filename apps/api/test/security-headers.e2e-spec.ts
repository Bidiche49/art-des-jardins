import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JWT_TEST_SECRET } from './helpers/jwt.helper';

describe('Security Headers (e2e)', () => {
  let app: INestApplication;

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
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    // Apply helmet with same config as main.ts
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'", 'https:', 'data:'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
          },
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true,
      })
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      })
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health (security headers verification)', () => {
    it('should return Content-Security-Policy header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const csp = response.headers['content-security-policy'];
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-src 'none'");
    });

    it('should return X-Frame-Options: DENY header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should return X-Content-Type-Options: nosniff header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should return Strict-Transport-Security header with 1 year max-age', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const hsts = response.headers['strict-transport-security'];
      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=31536000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });

    it('should return Referrer-Policy header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.headers['referrer-policy']).toBe(
        'strict-origin-when-cross-origin'
      );
    });

    it('should return X-DNS-Prefetch-Control header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Helmet sets this to 'off' by default
      expect(response.headers['x-dns-prefetch-control']).toBe('off');
    });

    it('should return X-Download-Options header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Helmet sets this to 'noopen' for IE8+ protection
      expect(response.headers['x-download-options']).toBe('noopen');
    });

    it('should return X-Permitted-Cross-Domain-Policies header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.headers['x-permitted-cross-domain-policies']).toBe(
        'none'
      );
    });

    it('should NOT return X-Powered-By header (hidden by helmet)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('All routes should have security headers', () => {
    it('should have security headers on /auth/login route', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({});

      // Even on 400 error, headers should be present
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    it('should have security headers on 404 routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);

      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  });
});
