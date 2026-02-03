import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { createMockUser, createMockPatron } from '../../../test/helpers/test-utils';

// Mock otplib before importing services that use it
jest.mock('otplib', () => ({
  generateSecret: jest.fn(() => 'JBSWY3DPEHPK3PXP'.repeat(2)),
  generate: jest.fn(async () => '123456'),
  verify: jest.fn(async ({ token }: { token: string }) => token === '123456'),
  generateURI: jest.fn(() => 'otpauth://totp/Test'),
}));

jest.mock('bcrypt');

import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { DeviceTrackingService } from './device-tracking.service';
import { RefreshTokenService } from './refresh-token.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserFindUnique: jest.Mock;
  let mockUserUpdate: jest.Mock;
  let mockJwtSign: jest.Mock;
  let mockJwtVerify: jest.Mock;
  let mockConfigGet: jest.Mock;
  let mockVerify2FACode: jest.Mock;
  let mockAuditLog: jest.Mock;
  let mockRegisterDevice: jest.Mock;
  let mockSendNewDeviceAlert: jest.Mock;
  let mockCreateRefreshToken: jest.Mock;
  let mockRotateRefreshToken: jest.Mock;
  let mockRevokeAllUserTokens: jest.Mock;
  let mockCleanupExpiredTokens: jest.Mock;

  const mockUser = createMockUser({
    id: 'user-123',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    role: 'employe',
    actif: true,
    twoFactorEnabled: false,
  });

  const mockPatron = createMockPatron({
    id: 'patron-123',
    email: 'patron@example.com',
    passwordHash: 'hashed-password',
    twoFactorEnabled: false,
  });

  beforeEach(async () => {
    mockUserFindUnique = jest.fn();
    mockUserUpdate = jest.fn();
    mockJwtSign = jest.fn();
    mockJwtVerify = jest.fn();
    mockConfigGet = jest.fn();
    mockVerify2FACode = jest.fn();
    mockAuditLog = jest.fn().mockResolvedValue({});
    mockRegisterDevice = jest.fn().mockResolvedValue(null);
    mockSendNewDeviceAlert = jest.fn().mockResolvedValue(true);
    mockCreateRefreshToken = jest.fn().mockResolvedValue('refresh-token');
    mockRotateRefreshToken = jest.fn().mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    mockRevokeAllUserTokens = jest.fn().mockResolvedValue(1);
    mockCleanupExpiredTokens = jest.fn().mockResolvedValue(0);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: mockUserFindUnique,
              update: mockUserUpdate,
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: mockJwtSign,
            verify: mockJwtVerify,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: mockConfigGet,
          },
        },
        {
          provide: TwoFactorService,
          useValue: {
            verify2FACode: mockVerify2FACode,
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: mockAuditLog,
          },
        },
        {
          provide: DeviceTrackingService,
          useValue: {
            registerDevice: mockRegisterDevice,
            sendNewDeviceAlert: mockSendNewDeviceAlert,
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            createRefreshToken: mockCreateRefreshToken,
            rotateRefreshToken: mockRotateRefreshToken,
            revokeAllUserTokens: mockRevokeAllUserTokens,
            cleanupExpiredTokens: mockCleanupExpiredTokens,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('should return user and tokens with valid credentials', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockUserUpdate.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtSign.mockReturnValue('access-token');
      mockCreateRefreshToken.mockResolvedValue('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          nom: mockUser.nom,
          prenom: mockUser.prenom,
          role: mockUser.role,
          twoFactorEnabled: false,
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
      expect(mockCreateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
        mockUser.role,
        undefined,
      );
    });

    it('should update derniereConnexion on successful login', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockUserUpdate.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtSign.mockReturnValue('token');
      mockCreateRefreshToken.mockResolvedValue('refresh-token');

      await service.login(loginDto);

      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { derniereConnexion: expect.any(Date) },
      });
    });

    it('should throw UnauthorizedException with non-existent email', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Identifiants invalides',
      );
    });

    it('should throw UnauthorizedException with incorrect password', async () => {
      mockUserFindUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Identifiants invalides',
      );
    });

    it('should throw UnauthorizedException with inactive user', async () => {
      const inactiveUser = { ...mockUser, actif: false };
      mockUserFindUnique.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Identifiants invalides',
      );
    });

    it('should return correct role for patron', async () => {
      mockUserFindUnique.mockResolvedValue(mockPatron);
      mockUserUpdate.mockResolvedValue(mockPatron);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtSign.mockReturnValue('token');
      mockCreateRefreshToken.mockResolvedValue('refresh-token');

      const result = await service.login({
        email: 'patron@example.com',
        password: 'password',
      });

      expect('user' in result).toBe(true);
      if ('user' in result && result.user) {
        expect(result.user.role).toBe('patron');
      }
    });

    it('should require 2FA code when user has 2FA enabled', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true };
      mockUserFindUnique.mockResolvedValue(userWith2FA);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        requires2FA: true,
        userId: userWith2FA.id,
        message: 'Code 2FA requis',
      });
    });

    it('should complete login with valid 2FA code', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true };
      mockUserFindUnique.mockResolvedValue(userWith2FA);
      mockUserUpdate.mockResolvedValue(userWith2FA);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockVerify2FACode.mockResolvedValue(true);
      mockJwtSign.mockReturnValue('access-token');
      mockCreateRefreshToken.mockResolvedValue('refresh-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
        totpCode: '123456',
      });

      expect(mockVerify2FACode).toHaveBeenCalledWith(userWith2FA.id, '123456');
      expect('user' in result).toBe(true);
    });

    it('should throw UnauthorizedException with invalid 2FA code', async () => {
      const userWith2FA = { ...mockUser, twoFactorEnabled: true };
      mockUserFindUnique.mockResolvedValue(userWith2FA);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockVerify2FACode.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password123',
          totpCode: '000000',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    const refreshToken = 'valid-refresh-token';

    it('should return new tokens with valid refresh token', async () => {
      mockRotateRefreshToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const result = await service.refresh(refreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(mockRotateRefreshToken).toHaveBeenCalledWith(refreshToken, undefined, undefined);
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      mockRotateRefreshToken.mockRejectedValue(new UnauthorizedException('Token invalide ou expire'));

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should pass ipAddress and userAgent to rotation service', async () => {
      mockRotateRefreshToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      await service.refresh(refreshToken, '127.0.0.1', 'TestAgent');

      expect(mockRotateRefreshToken).toHaveBeenCalledWith(refreshToken, '127.0.0.1', 'TestAgent');
    });
  });

  describe('logout', () => {
    it('should revoke all tokens and return success', async () => {
      mockRevokeAllUserTokens.mockResolvedValue(3);

      const result = await service.logout('user-123', undefined, '127.0.0.1', 'TestAgent');

      expect(result).toEqual({ success: true, revokedCount: 3 });
      expect(mockRevokeAllUserTokens).toHaveBeenCalledWith('user-123', 'logout');
      expect(mockAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          action: 'TOKEN_REVOKED',
          details: { revokedCount: 3 },
        }),
      );
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should call refresh token service cleanup', async () => {
      mockCleanupExpiredTokens.mockResolvedValue(10);

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(10);
      expect(mockCleanupExpiredTokens).toHaveBeenCalled();
    });
  });
});
