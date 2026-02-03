import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SecurityAlertService, SecurityEvent } from './security-alert.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

describe('SecurityAlertService', () => {
  let service: SecurityAlertService;
  let prisma: PrismaService;
  let mail: MailService;

  const mockPrismaService = {
    auditLog: {
      count: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        SECURITY_ALERT_THRESHOLD: '5',
        SECURITY_ALERT_WINDOW_MINUTES: '10',
        SECURITY_ALERT_EMAIL: 'admin@test.com',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityAlertService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SecurityAlertService>(SecurityAlertService);
    prisma = module.get<PrismaService>(PrismaService);
    mail = module.get<MailService>(MailService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return the configuration', () => {
      const config = service.getConfig();
      expect(config.threshold).toBe(5);
      expect(config.windowMinutes).toBe(10);
      expect(config.email).toBe('admin@test.com');
    });
  });

  describe('isEnabled', () => {
    it('should return true when email is configured', () => {
      expect(service.isEnabled()).toBe(true);
    });
  });

  describe('checkAndAlert', () => {
    const baseEvent: SecurityEvent = {
      action: 'LOGIN_FAILED',
      userId: 'user-123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    };

    describe('when below threshold', () => {
      it('should not send alert when LOGIN_FAILED count is below threshold', async () => {
        mockPrismaService.auditLog.count.mockResolvedValue(4); // Below threshold of 5

        await service.checkAndAlert(baseEvent);

        expect(mockPrismaService.auditLog.count).toHaveBeenCalled();
        expect(mockPrismaService.auditLog.create).not.toHaveBeenCalled();
        expect(mockMailService.sendMail).not.toHaveBeenCalled();
      });

      it('should not send alert for 0 failed attempts', async () => {
        mockPrismaService.auditLog.count.mockResolvedValue(0);

        await service.checkAndAlert(baseEvent);

        expect(mockPrismaService.auditLog.create).not.toHaveBeenCalled();
        expect(mockMailService.sendMail).not.toHaveBeenCalled();
      });
    });

    describe('when at or above threshold', () => {
      it('should trigger alert when LOGIN_FAILED count equals threshold', async () => {
        mockPrismaService.auditLog.count.mockResolvedValue(5); // Equals threshold
        mockPrismaService.auditLog.create.mockResolvedValue({ id: 'log-1' });
        mockMailService.sendMail.mockResolvedValue(true);

        await service.checkAndAlert(baseEvent);

        // Should create SUSPICIOUS_ACTIVITY log
        expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              action: 'SUSPICIOUS_ACTIVITY',
              entite: 'security',
              userId: 'user-123',
              ipAddress: '192.168.1.1',
            }),
          }),
        );

        // Should send email
        expect(mockMailService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'admin@test.com',
            subject: expect.stringContaining('SECURITE'),
            skipBcc: true,
          }),
        );
      });

      it('should trigger alert when LOGIN_FAILED count exceeds threshold', async () => {
        mockPrismaService.auditLog.count.mockResolvedValue(10); // Above threshold
        mockPrismaService.auditLog.create.mockResolvedValue({ id: 'log-1' });
        mockMailService.sendMail.mockResolvedValue(true);

        await service.checkAndAlert(baseEvent);

        expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
        expect(mockMailService.sendMail).toHaveBeenCalled();
      });
    });

    describe('bruteforce by IP detection', () => {
      it('should detect bruteforce by IP with higher threshold', async () => {
        // First call for userId, second for IP
        mockPrismaService.auditLog.count
          .mockResolvedValueOnce(3) // userId count (below threshold)
          .mockResolvedValueOnce(10); // IP count (equals 2x threshold)
        mockPrismaService.auditLog.create.mockResolvedValue({ id: 'log-1' });
        mockMailService.sendMail.mockResolvedValue(true);

        await service.checkAndAlert(baseEvent);

        // Should log SUSPICIOUS_ACTIVITY for IP-based bruteforce
        expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              action: 'SUSPICIOUS_ACTIVITY',
              details: expect.objectContaining({
                alertType: 'BRUTEFORCE_IP_DETECTED',
              }),
            }),
          }),
        );
      });

      it('should not alert for IP below double threshold', async () => {
        mockPrismaService.auditLog.count
          .mockResolvedValueOnce(3) // userId count
          .mockResolvedValueOnce(9); // IP count (below 2x threshold of 10)

        await service.checkAndAlert(baseEvent);

        expect(mockPrismaService.auditLog.create).not.toHaveBeenCalled();
        expect(mockMailService.sendMail).not.toHaveBeenCalled();
      });
    });

    describe('non-security events', () => {
      it('should ignore non LOGIN_FAILED events', async () => {
        const event: SecurityEvent = {
          action: 'LOGIN_SUCCESS',
          userId: 'user-123',
        };

        await service.checkAndAlert(event);

        expect(mockPrismaService.auditLog.count).not.toHaveBeenCalled();
        expect(mockPrismaService.auditLog.create).not.toHaveBeenCalled();
        expect(mockMailService.sendMail).not.toHaveBeenCalled();
      });

      it('should ignore LOGIN_FAILED without userId', async () => {
        const event: SecurityEvent = {
          action: 'LOGIN_FAILED',
          // No userId, no ipAddress
        };

        await service.checkAndAlert(event);

        expect(mockPrismaService.auditLog.count).not.toHaveBeenCalled();
      });
    });

    describe('query parameters', () => {
      it('should query with correct time window', async () => {
        mockPrismaService.auditLog.count.mockResolvedValue(3);

        const beforeTest = Date.now();
        await service.checkAndAlert(baseEvent);
        const afterTest = Date.now();

        expect(mockPrismaService.auditLog.count).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              action: 'LOGIN_FAILED',
              userId: 'user-123',
              createdAt: {
                gte: expect.any(Date),
              },
            }),
          }),
        );

        // Verify the window is approximately 10 minutes
        const call = mockPrismaService.auditLog.count.mock.calls[0][0];
        const windowStart = call.where.createdAt.gte.getTime();
        const expectedWindowStart = beforeTest - 10 * 60 * 1000;
        expect(windowStart).toBeGreaterThanOrEqual(expectedWindowStart - 1000);
        expect(windowStart).toBeLessThanOrEqual(afterTest - 10 * 60 * 1000 + 1000);
      });
    });
  });
});
