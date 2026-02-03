import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService, RefreshTokenPayload } from './refresh-token.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@artjardin.fr',
    role: 'employe',
    actif: true,
    nom: 'Dupont',
    prenom: 'Jean',
  };

  const mockRefreshToken = {
    id: 'token-123',
    userId: 'user-123',
    token: 'jwt-refresh-token',
    deviceId: 'device-123',
    familyId: 'family-123',
    usedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    revokedAt: null,
    createdAt: new Date(),
    user: mockUser,
  };

  const mockPrismaService = {
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-jwt-secret-key',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('new-jwt-token'),
    verify: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createRefreshToken', () => {
    it('should create and store a new refresh token', async () => {
      mockPrismaService.refreshToken.create.mockResolvedValue(mockRefreshToken);

      const token = await service.createRefreshToken(
        'user-123',
        'test@artjardin.fr',
        'employe',
        'device-123',
      );

      expect(token).toBe('new-jwt-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'user-123',
          email: 'test@artjardin.fr',
          role: 'employe',
          familyId: expect.any(String),
          jti: expect.any(String),
        }),
        expect.objectContaining({
          secret: 'test-jwt-secret-key',
          expiresIn: '7d',
        }),
      );
      expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          token: 'new-jwt-token',
          deviceId: 'device-123',
          familyId: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });

    it('should use existing familyId when provided', async () => {
      mockPrismaService.refreshToken.create.mockResolvedValue(mockRefreshToken);

      await service.createRefreshToken(
        'user-123',
        'test@artjardin.fr',
        'employe',
        'device-123',
        'existing-family-id',
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          familyId: 'existing-family-id',
        }),
        expect.any(Object),
      );
    });
  });

  describe('rotateRefreshToken', () => {
    const validPayload: RefreshTokenPayload = {
      sub: 'user-123',
      email: 'test@artjardin.fr',
      role: 'employe',
      familyId: 'family-123',
      jti: 'token-123',
    };

    it('should rotate token and return new pair', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      mockPrismaService.refreshToken.update.mockResolvedValue({ ...mockRefreshToken, usedAt: new Date() });
      mockPrismaService.refreshToken.create.mockResolvedValue(mockRefreshToken);

      const result = await service.rotateRefreshToken('old-refresh-token', '127.0.0.1', 'Chrome');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-123' },
        data: { usedAt: expect.any(Date) },
      });
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'TOKEN_ROTATED',
          details: expect.objectContaining({
            familyId: 'family-123',
          }),
        }),
      );
    });

    it('should throw when token not found in database', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.rotateRefreshToken('old-token'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw when user is inactive', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        user: { ...mockUser, actif: false },
      });

      await expect(service.rotateRefreshToken('old-token'))
        .rejects
        .toThrow('Compte desactive');
    });

    it('should throw when token is expired', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000), // Expired
      });

      await expect(service.rotateRefreshToken('old-token'))
        .rejects
        .toThrow('Token expire');
    });

    it('should throw when token is revoked', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        revokedAt: new Date(),
      });

      await expect(service.rotateRefreshToken('old-token'))
        .rejects
        .toThrow('Token revoque');
    });

    it('should detect replay attack and revoke family', async () => {
      mockJwtService.verify.mockReturnValue(validPayload);
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        usedAt: new Date(), // Already used - replay!
      });
      mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await expect(service.rotateRefreshToken('old-token', '127.0.0.1', 'Chrome'))
        .rejects
        .toThrow('Utilisation suspecte detectee');

      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          familyId: 'family-123',
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'TOKEN_REPLAY_DETECTED',
        }),
      );
    });

    it('should throw when JWT is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.rotateRefreshToken('invalid-token'))
        .rejects
        .toThrow('Token invalide ou expire');
    });
  });

  describe('revokeTokenFamily', () => {
    it('should revoke all tokens in family', async () => {
      mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 5 });

      const count = await service.revokeTokenFamily('family-123', 'test_reason');

      expect(count).toBe(5);
      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          familyId: 'family-123',
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });
    });
  });

  describe('revokeAllUserTokens', () => {
    it('should revoke all user tokens', async () => {
      mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 10 });

      const count = await service.revokeAllUserTokens('user-123', 'logout');

      expect(count).toBe(10);
      expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });
    });
  });

  describe('revokeToken', () => {
    it('should revoke specific token', async () => {
      mockPrismaService.refreshToken.update.mockResolvedValue(mockRefreshToken);

      const result = await service.revokeToken('token-123');

      expect(result).toBe(true);
      expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-123' },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should return false when token not found', async () => {
      mockPrismaService.refreshToken.update.mockRejectedValue(new Error('Not found'));

      const result = await service.revokeToken('unknown');

      expect(result).toBe(false);
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should delete expired and revoked tokens', async () => {
      mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 25 });

      const count = await service.cleanupExpiredTokens();

      expect(count).toBe(25);
      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { expiresAt: { lt: expect.any(Date) } },
            { revokedAt: { not: null } },
          ],
        },
      });
    });
  });

  describe('expiration calculation', () => {
    it('should handle days format', async () => {
      mockPrismaService.refreshToken.create.mockResolvedValue(mockRefreshToken);

      await service.createRefreshToken('user-123', 'test@test.fr', 'employe');

      const createCall = mockPrismaService.refreshToken.create.mock.calls[0][0];
      const expiresAt = createCall.data.expiresAt as Date;
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      // Should be approximately 7 days (with some tolerance)
      expect(diff).toBeGreaterThan(6 * 24 * 60 * 60 * 1000);
      expect(diff).toBeLessThan(8 * 24 * 60 * 60 * 1000);
    });
  });
});
