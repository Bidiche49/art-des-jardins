import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TwoFactorService } from './two-factor.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';

// Mock otplib — service uses `authenticator` object, not top-level exports
jest.mock('otplib', () => ({
  authenticator: {
    generateSecret: jest.fn(() => 'JBSWY3DPEHPK3PXP'.repeat(2)), // 32 chars base32
    generate: jest.fn(() => '123456'),
    verify: jest.fn(({ token }: { token: string; secret: string }) => token === '123456'),
    keyuri: jest.fn((email: string, issuer: string, secret: string) =>
      `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
    ),
  },
}));

import { authenticator } from 'otplib';

describe('TwoFactorService', () => {
  let service: TwoFactorService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    email: 'patron@artjardin.fr',
    role: 'patron',
    twoFactorSecret: null,
    twoFactorEnabled: false,
    recoveryCodes: [],
    twoFactorAttempts: 0,
    twoFactorLockedUntil: null,
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        TWO_FACTOR_ENCRYPTION_KEY: 'test-encryption-key-32-chars!!!',
        TWO_FACTOR_REQUIRED_ROLES: 'patron',
      };
      return config[key];
    }),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwoFactorService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<TwoFactorService>(TwoFactorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('setup2FA', () => {
    it('should generate QR code and secret for user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: false,
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.setup2FA('user-123');

      expect(result).toHaveProperty('qrCode');
      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('otpauthUrl');
      expect(result.qrCode).toMatch(/^data:image\/png;base64,/);
      expect(result.secret).toHaveLength(32); // Base32 secret
      expect(result.otpauthUrl).toContain('otpauth://totp/');
      expect(result.otpauthUrl).toContain('Art%20%26%20Jardin');
    });

    it('should throw if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.setup2FA('unknown')).rejects.toThrow(BadRequestException);
    });

    it('should throw if 2FA already enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: true,
      });

      await expect(service.setup2FA('user-123')).rejects.toThrow(BadRequestException);
    });

    it('should store encrypted secret in database', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      await service.setup2FA('user-123');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          twoFactorSecret: expect.stringContaining(':'), // Encrypted format
          twoFactorEnabled: false,
          recoveryCodes: [],
        }),
      });
    });
  });

  describe('verify2FASetup', () => {
    it('should activate 2FA with valid code and return recovery codes', async () => {
      const secret = authenticator.generateSecret();

      // Mock encrypted secret
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: false,
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const validToken = authenticator.generate(secret);
      const result = await service.verify2FASetup('user-123', validToken);

      expect(result.success).toBe(true);
      expect(result.recoveryCodes).toHaveLength(10);
      expect(result.recoveryCodes![0]).toHaveLength(8); // 8 hex chars
    });

    it('should reject invalid code', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: false,
      });

      const result = await service.verify2FASetup('user-123', '000000');

      expect(result.success).toBe(false);
      expect(result.recoveryCodes).toBeUndefined();
    });

    it('should throw if 2FA not configured', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: null,
      });

      await expect(service.verify2FASetup('user-123', '123456')).rejects.toThrow(BadRequestException);
    });

    it('should throw if 2FA already enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: 'encrypted',
        twoFactorEnabled: true,
      });

      await expect(service.verify2FASetup('user-123', '123456')).rejects.toThrow(BadRequestException);
    });
  });

  describe('verify2FACode', () => {
    it('should verify valid TOTP code', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        twoFactorAttempts: 0,
        twoFactorLockedUntil: null,
        recoveryCodes: [],
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const validToken = authenticator.generate(secret);
      const result = await service.verify2FACode('user-123', validToken);

      expect(result).toBe(true);
    });

    it('should reject invalid code and increment attempts', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        twoFactorAttempts: 0,
        twoFactorLockedUntil: null,
        recoveryCodes: [],
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.verify2FACode('user-123', '000000');

      expect(result).toBe(false);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({ twoFactorAttempts: 1 }),
      });
    });

    it('should lock account after 5 failed attempts', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        twoFactorAttempts: 4,
        twoFactorLockedUntil: null,
        recoveryCodes: [],
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      await expect(service.verify2FACode('user-123', '000000')).rejects.toThrow(
        'Trop de tentatives. Compte verrouillé pour 15 minutes.'
      );

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          twoFactorAttempts: 5,
          twoFactorLockedUntil: expect.any(Date),
        }),
      });
    });

    it('should reject if account is locked', async () => {
      const secret = authenticator.generateSecret();
      const lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        twoFactorAttempts: 5,
        twoFactorLockedUntil: lockUntil,
        recoveryCodes: [],
      });

      await expect(service.verify2FACode('user-123', '123456')).rejects.toThrow(
        /Trop de tentatives. Réessayez dans \d+ minute/
      );
    });

    it('should accept recovery code and remove it', async () => {
      const secret = authenticator.generateSecret();
      const recoveryCode = 'ABCD1234';
      const hashedCode = await bcrypt.hash(recoveryCode, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        twoFactorAttempts: 0,
        twoFactorLockedUntil: null,
        recoveryCodes: [hashedCode],
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.verify2FACode('user-123', recoveryCode);

      expect(result).toBe(true);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: expect.objectContaining({
          recoveryCodes: [],
          twoFactorAttempts: 0,
          twoFactorLockedUntil: null,
        }),
      });
    });

    it('should throw if 2FA not enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: false,
      });

      await expect(service.verify2FACode('user-123', '123456')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('disable2FA', () => {
    it('should disable 2FA with valid code', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
        role: 'patron',
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const validToken = authenticator.generate(secret);
      const result = await service.disable2FA('user-123', validToken);

      expect(result.success).toBe(true);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          twoFactorSecret: null,
          twoFactorEnabled: false,
          recoveryCodes: [],
          twoFactorAttempts: 0,
          twoFactorLockedUntil: null,
        },
      });
    });

    it('should reject invalid code when disabling', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
      });

      await expect(service.disable2FA('user-123', '000000')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if 2FA not enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: false,
      });

      await expect(service.disable2FA('user-123', '123456')).rejects.toThrow(BadRequestException);
    });
  });

  describe('regenerateRecoveryCodes', () => {
    it('should generate new recovery codes with valid 2FA code', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
      });
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const validToken = authenticator.generate(secret);
      const result = await service.regenerateRecoveryCodes('user-123', validToken);

      expect(result.recoveryCodes).toHaveLength(10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { recoveryCodes: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it('should reject invalid code', async () => {
      const secret = authenticator.generateSecret();

      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorSecret: service['encrypt'](secret),
        twoFactorEnabled: true,
      });

      await expect(service.regenerateRecoveryCodes('user-123', '000000')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('is2FARequired', () => {
    it('should return true for patron role', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        role: 'patron',
      });

      const result = await service.is2FARequired('user-123');
      expect(result).toBe(true);
    });

    it('should return false for employe role', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        role: 'employe',
      });

      const result = await service.is2FARequired('user-123');
      expect(result).toBe(false);
    });

    it('should return false for unknown user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.is2FARequired('unknown');
      expect(result).toBe(false);
    });
  });

  describe('is2FAEnabled', () => {
    it('should return true when 2FA is enabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: true,
      });

      const result = await service.is2FAEnabled('user-123');
      expect(result).toBe(true);
    });

    it('should return false when 2FA is disabled', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: false,
      });

      const result = await service.is2FAEnabled('user-123');
      expect(result).toBe(false);
    });

    it('should return false for unknown user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.is2FAEnabled('unknown');
      expect(result).toBe(false);
    });
  });

  describe('encryption', () => {
    it('should encrypt and decrypt correctly', () => {
      const originalText = 'test-secret-value';

      const encrypted = service['encrypt'](originalText);
      expect(encrypted).not.toBe(originalText);
      expect(encrypted).toContain(':'); // Format: iv:authTag:encrypted

      const decrypted = service['decrypt'](encrypted);
      expect(decrypted).toBe(originalText);
    });

    it('should produce different ciphertext for same plaintext (random IV)', () => {
      const originalText = 'test-secret-value';

      const encrypted1 = service['encrypt'](originalText);
      const encrypted2 = service['encrypt'](originalText);

      expect(encrypted1).not.toBe(encrypted2);
      expect(service['decrypt'](encrypted1)).toBe(originalText);
      expect(service['decrypt'](encrypted2)).toBe(originalText);
    });
  });
});
