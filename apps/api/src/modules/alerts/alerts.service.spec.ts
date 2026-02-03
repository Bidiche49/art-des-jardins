import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

// Mock uuid before any imports that might use it
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

// Mock modules with ESM dependencies
jest.mock('../storage/storage.service', () => ({
  StorageService: jest.fn(),
}));

jest.mock('../mail/mail.service', () => ({
  MailService: jest.fn(),
}));

jest.mock('../health/health.service', () => ({
  HealthService: jest.fn(),
}));

import { AlertsService } from './alerts.service';
import { MailService } from '../mail/mail.service';
import { HealthService } from '../health/health.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let prisma: any;
  let mail: any;
  let health: any;

  const mockConfig = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        ALERTS_ENABLED: 'true',
        ALERTS_EMAIL: 'alerts@test.com',
        SERVICE_DOWN_THRESHOLD: '300000',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockPrisma = {
      backupHistory: {
        findFirst: jest.fn(),
      },
      emailHistory: {
        count: jest.fn(),
      },
    };

    const mockMail = {
      sendMail: jest.fn(),
    };

    const mockHealth = {
      getDetailedHealth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailService, useValue: mockMail },
        { provide: HealthService, useValue: mockHealth },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prisma = module.get(PrismaService);
    mail = module.get(MailService);
    health = module.get(HealthService);
  });

  describe('getConfig', () => {
    it('should return the alerts configuration', () => {
      const config = service.getConfig();

      expect(config).toEqual({
        enabled: true,
        email: 'alerts@test.com',
        serviceDownThresholdMs: 300000,
      });
    });
  });

  describe('isEnabled', () => {
    it('should return true when enabled and email is configured', () => {
      expect(service.isEnabled()).toBe(true);
    });
  });

  describe('checkAndAlert', () => {
    it('should not send alerts when all services are up', async () => {
      health.getDetailedHealth.mockResolvedValue({
        status: 'healthy',
        services: {
          database: { status: 'up', latencyMs: 5, lastCheck: new Date() },
          storage: { status: 'up', latencyMs: 10, lastCheck: new Date() },
          smtp: { status: 'up', latencyMs: 2, lastCheck: new Date() },
        },
        timestamp: new Date(),
        uptime: 1000,
        version: '1.0.0',
      });
      prisma.backupHistory.findFirst.mockResolvedValue(null);
      prisma.emailHistory.count.mockResolvedValue(0);

      await service.checkAndAlert();

      expect(mail.sendMail).not.toHaveBeenCalled();
    });

    it('should track service down but not alert immediately', async () => {
      health.getDetailedHealth.mockResolvedValue({
        status: 'unhealthy',
        services: {
          database: { status: 'down', latencyMs: 0, lastCheck: new Date(), error: 'Connection refused' },
          storage: { status: 'up', latencyMs: 10, lastCheck: new Date() },
          smtp: { status: 'up', latencyMs: 2, lastCheck: new Date() },
        },
        timestamp: new Date(),
        uptime: 1000,
        version: '1.0.0',
      });
      prisma.backupHistory.findFirst.mockResolvedValue(null);
      prisma.emailHistory.count.mockResolvedValue(0);

      await service.checkAndAlert();

      // Should not send alert immediately (threshold not reached)
      expect(mail.sendMail).not.toHaveBeenCalled();
    });

    it('should alert when backup failed', async () => {
      health.getDetailedHealth.mockResolvedValue({
        status: 'healthy',
        services: {
          database: { status: 'up', latencyMs: 5, lastCheck: new Date() },
          storage: { status: 'up', latencyMs: 10, lastCheck: new Date() },
          smtp: { status: 'up', latencyMs: 2, lastCheck: new Date() },
        },
        timestamp: new Date(),
        uptime: 1000,
        version: '1.0.0',
      });
      prisma.backupHistory.findFirst.mockResolvedValue({
        id: 'backup-1',
        fileName: 'backup-test.sql.gz',
        status: 'failed',
        errorMessage: 'Disk full',
        createdAt: new Date(),
      });
      prisma.emailHistory.count.mockResolvedValue(0);
      mail.sendMail.mockResolvedValue(true);

      await service.checkAndAlert();

      expect(mail.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'alerts@test.com',
          subject: expect.stringContaining('Echec backup'),
        }),
      );
    });

    it('should alert when too many emails failed', async () => {
      health.getDetailedHealth.mockResolvedValue({
        status: 'healthy',
        services: {
          database: { status: 'up', latencyMs: 5, lastCheck: new Date() },
          storage: { status: 'up', latencyMs: 10, lastCheck: new Date() },
          smtp: { status: 'up', latencyMs: 2, lastCheck: new Date() },
        },
        timestamp: new Date(),
        uptime: 1000,
        version: '1.0.0',
      });
      prisma.backupHistory.findFirst.mockResolvedValue(null);
      prisma.emailHistory.count.mockResolvedValue(15); // > 10
      mail.sendMail.mockResolvedValue(true);

      await service.checkAndAlert();

      expect(mail.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'alerts@test.com',
          subject: expect.stringContaining('Echecs emails'),
        }),
      );
    });
  });

  describe('sendAlert', () => {
    it('should send an alert email', async () => {
      mail.sendMail.mockResolvedValue(true);

      const result = await service.sendAlert({
        type: 'SERVICE_DOWN',
        service: 'database',
        message: 'Database is down',
        timestamp: new Date(),
      });

      expect(result).toBe(true);
      expect(mail.sendMail).toHaveBeenCalledWith({
        to: 'alerts@test.com',
        subject: expect.stringContaining('Service database indisponible'),
        html: expect.stringContaining('SERVICE_DOWN'),
        skipBcc: true,
      });
    });

    it('should use correct subject for recovery alerts', async () => {
      mail.sendMail.mockResolvedValue(true);

      await service.sendAlert({
        type: 'SERVICE_RECOVERED',
        service: 'database',
        message: 'Database is back',
        timestamp: new Date(),
      });

      expect(mail.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Service database retabli'),
        }),
      );
    });
  });

  describe('getStats', () => {
    it('should return stats with current state', async () => {
      const stats = await service.getStats();

      expect(stats.enabled).toBe(true);
      expect(stats.config).toMatchObject({
        enabled: true,
        email: 'alerts@test.com',
      });
      expect(stats.currentlyDown).toEqual([]);
    });
  });
});

describe('AlertsService - disabled', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const mockConfigDisabled = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          ALERTS_ENABLED: 'false',
          ALERTS_EMAIL: '',
          SERVICE_DOWN_THRESHOLD: '300000',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: {} },
        { provide: MailService, useValue: { sendMail: jest.fn() } },
        { provide: HealthService, useValue: {} },
        { provide: ConfigService, useValue: mockConfigDisabled },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should not be enabled when ALERTS_ENABLED is false', () => {
    expect(service.isEnabled()).toBe(false);
  });

  it('should not send alerts when disabled', async () => {
    const result = await service.sendAlert({
      type: 'SERVICE_DOWN',
      service: 'test',
      message: 'Test',
      timestamp: new Date(),
    });

    expect(result).toBe(false);
  });
});
