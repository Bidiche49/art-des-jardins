import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

// Mock uuid before any imports that might use it
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

// Mock the storage service module
jest.mock('../storage/storage.service', () => ({
  StorageService: jest.fn().mockImplementation(() => ({
    isConfigured: jest.fn(),
    checkConnection: jest.fn(),
  })),
}));

// Mock the mail service module
jest.mock('../mail/mail.service', () => ({
  MailService: jest.fn().mockImplementation(() => ({
    isConfigured: jest.fn(),
  })),
}));

import { HealthService } from './health.service';
import { StorageService } from '../storage/storage.service';
import { MailService } from '../mail/mail.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: any;
  let storage: any;
  let mail: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockPrisma = {
      $queryRaw: jest.fn(),
    };

    const mockStorage = {
      isConfigured: jest.fn(),
      checkConnection: jest.fn(),
    };

    const mockMail = {
      isConfigured: jest.fn(),
    };

    const mockConfig = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: StorageService, useValue: mockStorage },
        { provide: MailService, useValue: mockMail },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prisma = module.get(PrismaService);
    storage = module.get(StorageService);
    mail = module.get(MailService);
  });

  describe('checkLiveness', () => {
    it('should return ok status', async () => {
      const result = await service.checkLiveness();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('checkReadiness', () => {
    it('should return ok when database is up', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.checkReadiness();

      expect(result.status).toBe('ok');
      expect(result.database).toBe(true);
    });

    it('should return not_ready when database is down', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      const result = await service.checkReadiness();

      expect(result.status).toBe('not_ready');
      expect(result.database).toBe(false);
    });
  });

  describe('checkDatabase', () => {
    it('should return up when query succeeds', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.checkDatabase();

      expect(result.status).toBe('up');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('should return down when query fails', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      const result = await service.checkDatabase();

      expect(result.status).toBe('down');
      expect(result.error).toBe('Connection refused');
    });
  });

  describe('checkStorage', () => {
    it('should return degraded when not configured', async () => {
      storage.isConfigured.mockReturnValue(false);

      const result = await service.checkStorage();

      expect(result.status).toBe('degraded');
      expect(result.error).toBe('Storage not configured');
    });

    it('should return up when configured and connection succeeds', async () => {
      storage.isConfigured.mockReturnValue(true);
      storage.checkConnection.mockResolvedValue(undefined);

      const result = await service.checkStorage();

      expect(result.status).toBe('up');
      expect(result.error).toBeUndefined();
    });

    it('should return down when connection fails', async () => {
      storage.isConfigured.mockReturnValue(true);
      storage.checkConnection.mockRejectedValue(new Error('Bucket not found'));

      const result = await service.checkStorage();

      expect(result.status).toBe('down');
      expect(result.error).toBe('Bucket not found');
    });
  });

  describe('checkSmtp', () => {
    it('should return degraded when not configured', async () => {
      mail.isConfigured.mockReturnValue(false);

      const result = await service.checkSmtp();

      expect(result.status).toBe('degraded');
      expect(result.error).toBe('SMTP not configured');
    });

    it('should return up when configured', async () => {
      mail.isConfigured.mockReturnValue(true);

      const result = await service.checkSmtp();

      expect(result.status).toBe('up');
      expect(result.error).toBeUndefined();
    });
  });

  describe('getDetailedHealth', () => {
    it('should return healthy when all services are up', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      storage.isConfigured.mockReturnValue(true);
      storage.checkConnection.mockResolvedValue(undefined);
      mail.isConfigured.mockReturnValue(true);

      const result = await service.getDetailedHealth();

      expect(result.status).toBe('healthy');
      expect(result.services.database.status).toBe('up');
      expect(result.services.storage.status).toBe('up');
      expect(result.services.smtp.status).toBe('up');
      expect(result.uptime).toBeGreaterThan(0);
    });

    it('should return unhealthy when database is down', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));
      storage.isConfigured.mockReturnValue(true);
      storage.checkConnection.mockResolvedValue(undefined);
      mail.isConfigured.mockReturnValue(true);

      const result = await service.getDetailedHealth();

      expect(result.status).toBe('unhealthy');
      expect(result.services.database.status).toBe('down');
    });

    it('should return degraded when storage is down but database is up', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      storage.isConfigured.mockReturnValue(true);
      storage.checkConnection.mockRejectedValue(new Error('S3 error'));
      mail.isConfigured.mockReturnValue(true);

      const result = await service.getDetailedHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.database.status).toBe('up');
      expect(result.services.storage.status).toBe('down');
    });

    it('should return degraded when services are not configured', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
      storage.isConfigured.mockReturnValue(false);
      mail.isConfigured.mockReturnValue(false);

      const result = await service.getDetailedHealth();

      expect(result.status).toBe('degraded');
      expect(result.services.storage.status).toBe('degraded');
      expect(result.services.smtp.status).toBe('degraded');
    });
  });
});
