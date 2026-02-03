import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DeviceTrackingService } from './device-tracking.service';
import { GeoIpService } from './geo-ip.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';

describe('DeviceTrackingService', () => {
  let service: DeviceTrackingService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mailService: MailService;
  let geoIpService: GeoIpService;

  const mockUser = {
    id: 'user-123',
    email: 'test@artjardin.fr',
    nom: 'Dupont',
    prenom: 'Jean',
  };

  const mockDevice = {
    id: 'device-123',
    userId: 'user-123',
    fingerprint: 'abc123',
    deviceName: 'Chrome sur Windows',
    lastIp: '192.168.1.1',
    lastCity: 'Paris',
    lastCountry: 'France',
    firstSeenAt: new Date(),
    lastSeenAt: new Date(),
    trustedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    knownDevice: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    refreshToken: {
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        DEVICE_ACTION_SECRET: 'test-device-secret-key',
        APP_URL: 'http://localhost:3000',
      };
      return config[key];
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue({}),
  };

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  const mockGeoIpService = {
    lookup: jest.fn().mockResolvedValue({
      ip: '203.0.113.1',
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      region: 'Ile-de-France',
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceTrackingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: MailService, useValue: mockMailService },
        { provide: GeoIpService, useValue: mockGeoIpService },
      ],
    }).compile();

    service = module.get<DeviceTrackingService>(DeviceTrackingService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    geoIpService = module.get<GeoIpService>(GeoIpService);
  });

  describe('generateFingerprint', () => {
    it('should generate consistent fingerprint for same input', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0';
      const acceptLanguage = 'fr-FR,fr;q=0.9';

      const fp1 = service.generateFingerprint(userAgent, acceptLanguage);
      const fp2 = service.generateFingerprint(userAgent, acceptLanguage);

      expect(fp1).toBe(fp2);
      expect(fp1).toHaveLength(64); // SHA256 hex
    });

    it('should generate different fingerprints for different inputs', () => {
      const fp1 = service.generateFingerprint('Chrome', 'fr');
      const fp2 = service.generateFingerprint('Firefox', 'fr');
      const fp3 = service.generateFingerprint('Chrome', 'en');

      expect(fp1).not.toBe(fp2);
      expect(fp1).not.toBe(fp3);
    });

    it('should handle missing acceptLanguage', () => {
      const fp = service.generateFingerprint('Chrome');
      expect(fp).toHaveLength(64);
    });
  });

  describe('parseDeviceName', () => {
    it('should detect Chrome on Windows', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0';
      expect(service.parseDeviceName(ua)).toBe('Chrome sur Windows');
    });

    it('should detect Safari on Mac', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15';
      expect(service.parseDeviceName(ua)).toBe('Safari sur Mac');
    });

    it('should detect iPhone', () => {
      const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1';
      expect(service.parseDeviceName(ua)).toBe('iPhone');
    });

    it('should detect Android', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0';
      expect(service.parseDeviceName(ua)).toBe('Android - Pixel 8');
    });

    it('should return generic for unknown browser', () => {
      const ua = 'Unknown/1.0';
      expect(service.parseDeviceName(ua)).toBe('Navigateur inconnu');
    });
  });

  describe('registerDevice', () => {
    const userAgent = 'Mozilla/5.0 Chrome/120.0';
    const ip = '203.0.113.1';

    it('should create new device when not found', async () => {
      mockPrismaService.knownDevice.findUnique.mockResolvedValue(null);
      mockPrismaService.knownDevice.create.mockResolvedValue(mockDevice);

      const result = await service.registerDevice('user-123', userAgent, ip);

      expect(result.isNew).toBe(true);
      expect(result.deviceId).toBe('device-123');
      expect(mockPrismaService.knownDevice.create).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'NEW_DEVICE_DETECTED',
        })
      );
    });

    it('should update existing device', async () => {
      mockPrismaService.knownDevice.findUnique.mockResolvedValue(mockDevice);
      mockPrismaService.knownDevice.update.mockResolvedValue(mockDevice);

      const result = await service.registerDevice('user-123', userAgent, ip);

      expect(result.isNew).toBe(false);
      expect(result.deviceId).toBe('device-123');
      expect(mockPrismaService.knownDevice.update).toHaveBeenCalled();
    });

    it('should enrich with geolocation', async () => {
      mockPrismaService.knownDevice.findUnique.mockResolvedValue(null);
      mockPrismaService.knownDevice.create.mockResolvedValue(mockDevice);

      const result = await service.registerDevice('user-123', userAgent, ip);

      expect(mockGeoIpService.lookup).toHaveBeenCalledWith(ip);
      expect(result.geoLocation).toEqual(
        expect.objectContaining({
          city: 'Paris',
          country: 'France',
        })
      );
    });
  });

  describe('generateActionToken / validateActionToken', () => {
    it('should generate valid JWT token', () => {
      const token = service.generateActionToken('user-123', 'device-123', 'trust');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 'user-123', deviceId: 'device-123', action: 'trust' },
        expect.objectContaining({ expiresIn: '24h' })
      );
      expect(token).toBe('mock-jwt-token');
    });

    it('should validate valid token', () => {
      const payload = {
        userId: 'user-123',
        deviceId: 'device-123',
        action: 'trust' as const,
        iat: Date.now(),
        exp: Date.now() + 86400000,
      };
      mockJwtService.verify.mockReturnValue(payload);

      const result = service.validateActionToken('valid-token');

      expect(result).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = service.validateActionToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('sendNewDeviceAlert', () => {
    it('should send email with correct parameters', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const geoLocation = { ip: '203.0.113.1', city: 'Paris', country: 'France', countryCode: 'FR', region: '' };
      const result = await service.sendNewDeviceAlert(
        'user-123',
        'device-123',
        'Chrome sur Windows',
        '203.0.113.1',
        geoLocation
      );

      expect(result).toBe(true);
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@artjardin.fr',
          subject: expect.stringContaining('Nouvelle connexion'),
          templateName: 'new-login-alert',
          skipBcc: true,
        })
      );
    });

    it('should return false if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.sendNewDeviceAlert('unknown', 'device-123', 'Chrome', '1.2.3.4', null);

      expect(result).toBe(false);
      expect(mockMailService.sendMail).not.toHaveBeenCalled();
    });

    it('should include trust and revoke URLs in email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await service.sendNewDeviceAlert('user-123', 'device-123', 'Chrome', '1.2.3.4', null);

      const emailContent = mockMailService.sendMail.mock.calls[0][0].html;
      expect(emailContent).toContain('/auth/device/trust/');
      expect(emailContent).toContain('/auth/device/revoke/');
    });
  });

  describe('trustDevice', () => {
    it('should mark device as trusted', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(mockDevice);
      mockPrismaService.knownDevice.update.mockResolvedValue(mockDevice);

      const result = await service.trustDevice('device-123', 'user-123');

      expect(result).toBe(true);
      expect(mockPrismaService.knownDevice.update).toHaveBeenCalledWith({
        where: { id: 'device-123' },
        data: { trustedAt: expect.any(Date) },
      });
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DEVICE_TRUSTED' })
      );
    });

    it('should return false if device not found', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(null);

      const result = await service.trustDevice('unknown', 'user-123');

      expect(result).toBe(false);
    });
  });

  describe('revokeDeviceAndSessions', () => {
    it('should delete all sessions and device', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(mockDevice);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          refreshToken: { deleteMany: jest.fn() },
          knownDevice: { delete: jest.fn() },
        });
      });

      const result = await service.revokeDeviceAndSessions('device-123', 'user-123');

      expect(result).toBe(true);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DEVICE_REVOKED_ALL_SESSIONS' })
      );
    });

    it('should return false if device not found', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(null);

      const result = await service.revokeDeviceAndSessions('unknown', 'user-123');

      expect(result).toBe(false);
    });
  });

  describe('getUserDevices', () => {
    it('should return all devices for user', async () => {
      const devices = [mockDevice, { ...mockDevice, id: 'device-456' }];
      mockPrismaService.knownDevice.findMany.mockResolvedValue(devices);

      const result = await service.getUserDevices('user-123');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.knownDevice.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { lastSeenAt: 'desc' },
        select: expect.any(Object),
      });
    });
  });

  describe('deleteDevice', () => {
    it('should delete device and associated tokens', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(mockDevice);
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.knownDevice.delete.mockResolvedValue(mockDevice);

      const result = await service.deleteDevice('device-123', 'user-123');

      expect(result).toBe(true);
      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { deviceId: 'device-123' },
      });
      expect(mockPrismaService.knownDevice.delete).toHaveBeenCalledWith({
        where: { id: 'device-123' },
      });
    });

    it('should return false if device not found', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(null);

      const result = await service.deleteDevice('unknown', 'user-123');

      expect(result).toBe(false);
    });
  });

  describe('getDevicesPaginated', () => {
    it('should return paginated devices with total count', async () => {
      const devices = [
        { ...mockDevice, id: 'device-1' },
        { ...mockDevice, id: 'device-2' },
      ];
      mockPrismaService.knownDevice.findMany.mockResolvedValue(devices);
      mockPrismaService.knownDevice.count.mockResolvedValue(5);

      const result = await service.getDevicesPaginated('user-123', 2, 0);

      expect(result.devices).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(mockPrismaService.knownDevice.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { lastSeenAt: 'desc' },
        skip: 0,
        take: 2,
        select: expect.any(Object),
      });
    });

    it('should handle offset pagination', async () => {
      mockPrismaService.knownDevice.findMany.mockResolvedValue([mockDevice]);
      mockPrismaService.knownDevice.count.mockResolvedValue(3);

      const result = await service.getDevicesPaginated('user-123', 10, 2);

      expect(mockPrismaService.knownDevice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 2,
          take: 10,
        })
      );
    });

    it('should use default values for limit and offset', async () => {
      mockPrismaService.knownDevice.findMany.mockResolvedValue([]);
      mockPrismaService.knownDevice.count.mockResolvedValue(0);

      await service.getDevicesPaginated('user-123');

      expect(mockPrismaService.knownDevice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
    });
  });

  describe('getDeviceById', () => {
    it('should return device if found and belongs to user', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(mockDevice);

      const result = await service.getDeviceById('user-123', 'device-123');

      expect(result).toEqual(mockDevice);
      expect(mockPrismaService.knownDevice.findFirst).toHaveBeenCalledWith({
        where: { id: 'device-123', userId: 'user-123' },
        select: expect.any(Object),
      });
    });

    it('should return null if device not found', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(null);

      const result = await service.getDeviceById('user-123', 'unknown');

      expect(result).toBeNull();
    });
  });

  describe('findDeviceByFingerprint', () => {
    it('should find device by fingerprint', async () => {
      mockPrismaService.knownDevice.findUnique.mockResolvedValue({ id: 'device-123' });

      const result = await service.findDeviceByFingerprint('user-123', 'fp-abc');

      expect(result).toEqual({ id: 'device-123' });
      expect(mockPrismaService.knownDevice.findUnique).toHaveBeenCalledWith({
        where: {
          userId_fingerprint: { userId: 'user-123', fingerprint: 'fp-abc' },
        },
        select: { id: true },
      });
    });

    it('should return null if not found', async () => {
      mockPrismaService.knownDevice.findUnique.mockResolvedValue(null);

      const result = await service.findDeviceByFingerprint('user-123', 'unknown');

      expect(result).toBeNull();
    });
  });

  describe('revokeDevice', () => {
    it('should revoke device and delete refresh tokens', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue({
        ...mockDevice,
        fingerprint: 'other-fingerprint',
      });
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          refreshToken: { deleteMany: jest.fn() },
          knownDevice: { delete: jest.fn() },
        });
      });

      const result = await service.revokeDevice('user-123', 'device-123', 'current-fp');

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DEVICE_REVOKED' })
      );
    });

    it('should return error if device not found', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(null);

      const result = await service.revokeDevice('user-123', 'unknown', 'fp');

      expect(result).toEqual({ success: false, error: 'device_not_found' });
    });

    it('should refuse to revoke current device', async () => {
      const currentFingerprint = 'current-device-fingerprint';
      mockPrismaService.knownDevice.findFirst.mockResolvedValue({
        ...mockDevice,
        fingerprint: currentFingerprint,
      });

      const result = await service.revokeDevice('user-123', 'device-123', currentFingerprint);

      expect(result).toEqual({
        success: false,
        error: 'cannot_revoke_current_device',
      });
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should allow revocation without fingerprint check', async () => {
      mockPrismaService.knownDevice.findFirst.mockResolvedValue(mockDevice);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          refreshToken: { deleteMany: jest.fn() },
          knownDevice: { delete: jest.fn() },
        });
      });

      const result = await service.revokeDevice('user-123', 'device-123');

      expect(result).toEqual({ success: true });
    });
  });
});
