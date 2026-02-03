import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Mock otplib before importing services that use it
jest.mock('otplib', () => ({
  generateSecret: jest.fn(() => 'JBSWY3DPEHPK3PXP'),
  generate: jest.fn(async () => '123456'),
  verify: jest.fn(async ({ token }: { token: string }) => token === '123456'),
  generateURI: jest.fn(() => 'otpauth://totp/Test'),
}));

import { WebAuthnController } from './webauthn.controller';
import { WebAuthnService } from './webauthn.service';
import { AuthService } from './auth.service';

describe('WebAuthnController', () => {
  let controller: WebAuthnController;
  let webAuthnService: WebAuthnService;
  let authService: AuthService;

  const mockUser = {
    sub: 'user-123',
    email: 'patron@artjardin.fr',
    role: 'PATRON',
  };

  const mockRequest = {
    user: mockUser,
    ip: '127.0.0.1',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'x-forwarded-for': undefined,
      'accept-language': 'fr-FR',
    },
  };

  const mockWebAuthnService = {
    startRegistration: jest.fn(),
    finishRegistration: jest.fn(),
    startAuthentication: jest.fn(),
    finishAuthentication: jest.fn(),
    getUserCredentials: jest.fn(),
    deleteCredential: jest.fn(),
  };

  const mockAuthService = {
    generateTokensForUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebAuthnController],
      providers: [
        { provide: WebAuthnService, useValue: mockWebAuthnService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<WebAuthnController>(WebAuthnController);
    webAuthnService = module.get<WebAuthnService>(WebAuthnService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('getRegisterOptions', () => {
    it('should return registration options for authenticated user', async () => {
      const options = {
        challenge: 'test-challenge',
        rp: { name: 'Art & Jardin', id: 'localhost' },
        user: { id: 'user-123', name: 'patron@artjardin.fr', displayName: 'Jean Dupont' },
      };
      mockWebAuthnService.startRegistration.mockResolvedValue(options);

      const result = await controller.getRegisterOptions(mockRequest as any);

      expect(result).toEqual(options);
      expect(mockWebAuthnService.startRegistration).toHaveBeenCalledWith('user-123');
    });
  });

  describe('verifyRegistration', () => {
    const validDto = {
      response: JSON.stringify({
        id: 'cred-id',
        rawId: 'raw-id',
        response: { clientDataJSON: 'data', attestationObject: 'obj' },
        type: 'public-key',
      }),
      deviceName: 'Mon iPhone',
    };

    it('should verify and register credential', async () => {
      mockWebAuthnService.finishRegistration.mockResolvedValue({
        success: true,
        credentialId: 'new-cred-id',
      });

      const result = await controller.verifyRegistration(mockRequest as any, validDto);

      expect(result.success).toBe(true);
      expect(result.credentialId).toBe('new-cred-id');
      expect(mockWebAuthnService.finishRegistration).toHaveBeenCalledWith(
        'user-123',
        JSON.parse(validDto.response),
        'Mon iPhone',
      );
    });

    it('should throw BadRequestException for invalid JSON', async () => {
      const invalidDto = { response: 'not-valid-json', deviceName: undefined };

      await expect(controller.verifyRegistration(mockRequest as any, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should pass undefined deviceName if not provided', async () => {
      const dtoWithoutDeviceName = {
        response: validDto.response,
        deviceName: undefined,
      };
      mockWebAuthnService.finishRegistration.mockResolvedValue({
        success: true,
        credentialId: 'new-cred-id',
      });

      await controller.verifyRegistration(mockRequest as any, dtoWithoutDeviceName);

      expect(mockWebAuthnService.finishRegistration).toHaveBeenCalledWith(
        'user-123',
        JSON.parse(validDto.response),
        undefined,
      );
    });
  });

  describe('getLoginOptions', () => {
    it('should return authentication options without email', async () => {
      const options = {
        challenge: 'auth-challenge',
        rpId: 'localhost',
        timeout: 60000,
      };
      mockWebAuthnService.startAuthentication.mockResolvedValue(options);

      const result = await controller.getLoginOptions({});

      expect(result).toEqual(options);
      expect(mockWebAuthnService.startAuthentication).toHaveBeenCalledWith(undefined);
    });

    it('should return authentication options with email', async () => {
      const options = {
        challenge: 'auth-challenge',
        rpId: 'localhost',
        allowCredentials: [{ id: 'cred-1', transports: ['internal'] }],
      };
      mockWebAuthnService.startAuthentication.mockResolvedValue(options);

      const result = await controller.getLoginOptions({ email: 'patron@artjardin.fr' });

      expect(result).toEqual(options);
      expect(mockWebAuthnService.startAuthentication).toHaveBeenCalledWith('patron@artjardin.fr');
    });

    it('should propagate service exceptions', async () => {
      mockWebAuthnService.startAuthentication.mockRejectedValue(
        new BadRequestException('Aucun appareil biométrique enregistré'),
      );

      await expect(controller.getLoginOptions({ email: 'unknown@email.com' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyLogin', () => {
    const validDto = {
      response: JSON.stringify({
        id: 'cred-id',
        rawId: 'raw-id',
        response: { clientDataJSON: 'data', authenticatorData: 'auth', signature: 'sig' },
        type: 'public-key',
      }),
    };

    it('should verify authentication and return tokens', async () => {
      mockWebAuthnService.finishAuthentication.mockResolvedValue({
        success: true,
        userId: 'user-123',
      });
      mockAuthService.generateTokensForUser.mockResolvedValue({
        user: {
          id: 'user-123',
          email: 'patron@artjardin.fr',
          nom: 'Dupont',
          prenom: 'Jean',
          role: 'PATRON',
          twoFactorEnabled: false,
        },
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
      });

      const result = await controller.verifyLogin(validDto, mockRequest as any);

      expect(result.accessToken).toBe('jwt-access-token');
      expect(result.refreshToken).toBe('jwt-refresh-token');
      expect(result.user.id).toBe('user-123');
      expect(mockWebAuthnService.finishAuthentication).toHaveBeenCalledWith(
        JSON.parse(validDto.response),
      );
      expect(mockAuthService.generateTokensForUser).toHaveBeenCalledWith(
        'user-123',
        '127.0.0.1',
        'Mozilla/5.0',
        'fr-FR',
      );
    });

    it('should throw BadRequestException for invalid JSON', async () => {
      const invalidDto = { response: 'not-valid-json' };

      await expect(controller.verifyLogin(invalidDto, mockRequest as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should propagate UnauthorizedException from service', async () => {
      mockWebAuthnService.finishAuthentication.mockRejectedValue(
        new UnauthorizedException('Credential non reconnu'),
      );

      await expect(controller.verifyLogin(validDto, mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCredentials', () => {
    it('should return list of credentials for authenticated user', async () => {
      const credentials = [
        {
          id: 'cred-1',
          credentialId: 'webauthn-cred-1',
          deviceName: 'iPhone',
          deviceType: 'platform',
          lastUsedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'cred-2',
          credentialId: 'webauthn-cred-2',
          deviceName: 'YubiKey',
          deviceType: 'cross-platform',
          lastUsedAt: null,
          createdAt: new Date(),
        },
      ];
      mockWebAuthnService.getUserCredentials.mockResolvedValue(credentials);

      const result = await controller.getCredentials(mockRequest as any);

      expect(result).toHaveLength(2);
      expect(result[0].deviceName).toBe('iPhone');
      expect(mockWebAuthnService.getUserCredentials).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array if no credentials', async () => {
      mockWebAuthnService.getUserCredentials.mockResolvedValue([]);

      const result = await controller.getCredentials(mockRequest as any);

      expect(result).toHaveLength(0);
    });
  });

  describe('deleteCredential', () => {
    it('should delete credential belonging to user', async () => {
      mockWebAuthnService.deleteCredential.mockResolvedValue({ success: true });

      const result = await controller.deleteCredential(mockRequest as any, 'cred-123');

      expect(result.success).toBe(true);
      expect(mockWebAuthnService.deleteCredential).toHaveBeenCalledWith('user-123', 'cred-123');
    });

    it('should propagate BadRequestException if credential not found', async () => {
      mockWebAuthnService.deleteCredential.mockRejectedValue(
        new BadRequestException('Credential non trouvé'),
      );

      await expect(controller.deleteCredential(mockRequest as any, 'unknown')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
