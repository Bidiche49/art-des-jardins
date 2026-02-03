import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { WebAuthnService } from './webauthn.service';
import { PrismaService } from '../../database/prisma.service';

// Mock @simplewebauthn/server
jest.mock('@simplewebauthn/server', () => ({
  generateRegistrationOptions: jest.fn(),
  verifyRegistrationResponse: jest.fn(),
  generateAuthenticationOptions: jest.fn(),
  verifyAuthenticationResponse: jest.fn(),
}));

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const mockedGenerateRegistrationOptions = generateRegistrationOptions as jest.MockedFunction<
  typeof generateRegistrationOptions
>;
const mockedVerifyRegistrationResponse = verifyRegistrationResponse as jest.MockedFunction<
  typeof verifyRegistrationResponse
>;
const mockedGenerateAuthenticationOptions = generateAuthenticationOptions as jest.MockedFunction<
  typeof generateAuthenticationOptions
>;
const mockedVerifyAuthenticationResponse = verifyAuthenticationResponse as jest.MockedFunction<
  typeof verifyAuthenticationResponse
>;

describe('WebAuthnService', () => {
  let service: WebAuthnService;

  const mockUser = {
    id: 'user-123',
    email: 'patron@artjardin.fr',
    nom: 'Dupont',
    prenom: 'Jean',
    actif: true,
    webAuthnCredentials: [],
  };

  const mockCredential = {
    id: 'cred-123',
    userId: 'user-123',
    credentialId: 'credential-id-base64url',
    publicKey: Buffer.from('public-key-bytes').toString('base64'),
    counter: 0,
    deviceName: 'iPhone',
    deviceType: 'platform',
    transports: ['internal'],
    lastUsedAt: null,
    createdAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    webAuthnCredential: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        WEBAUTHN_RP_NAME: 'Art & Jardin',
        WEBAUTHN_RP_ID: 'localhost',
        WEBAUTHN_ORIGIN: 'http://localhost:3000',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebAuthnService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<WebAuthnService>(WebAuthnService);
  });

  describe('startRegistration', () => {
    it('should generate registration options for user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedGenerateRegistrationOptions.mockResolvedValue({
        challenge: 'test-challenge-base64url',
        rp: { name: 'Art & Jardin', id: 'localhost' },
        user: { id: 'user-123', name: 'patron@artjardin.fr', displayName: 'Jean Dupont' },
        pubKeyCredParams: [],
        timeout: 60000,
        attestation: 'none',
        excludeCredentials: [],
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      } as any);

      const result = await service.startRegistration('user-123');

      expect(result).toHaveProperty('challenge');
      expect(result.challenge).toBe('test-challenge-base64url');
      expect(mockedGenerateRegistrationOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          rpName: 'Art & Jardin',
          rpID: 'localhost',
          userName: 'patron@artjardin.fr',
          userDisplayName: 'Jean Dupont',
        }),
      );
    });

    it('should throw if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.startRegistration('unknown')).rejects.toThrow(BadRequestException);
    });

    it('should exclude existing credentials', async () => {
      const userWithCredentials = {
        ...mockUser,
        webAuthnCredentials: [
          { credentialId: 'existing-cred-1', transports: ['internal'] },
          { credentialId: 'existing-cred-2', transports: ['usb'] },
        ],
      };
      mockPrismaService.user.findUnique.mockResolvedValue(userWithCredentials);
      mockedGenerateRegistrationOptions.mockResolvedValue({
        challenge: 'test-challenge',
      } as any);

      await service.startRegistration('user-123');

      expect(mockedGenerateRegistrationOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          excludeCredentials: [
            { id: 'existing-cred-1', transports: ['internal'] },
            { id: 'existing-cred-2', transports: ['usb'] },
          ],
        }),
      );
    });
  });

  describe('finishRegistration', () => {
    const mockRegistrationResponse = {
      id: 'new-credential-id',
      rawId: 'raw-id-base64url',
      response: {
        clientDataJSON: 'client-data-json-base64url',
        attestationObject: 'attestation-object-base64url',
        transports: ['internal'] as ('internal' | 'usb' | 'nfc' | 'ble' | 'cable' | 'hybrid' | 'smart-card')[],
      },
      type: 'public-key' as const,
      clientExtensionResults: {},
      authenticatorAttachment: 'platform' as const,
    };

    beforeEach(() => {
      // Start registration first to set up challenge
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedGenerateRegistrationOptions.mockResolvedValue({
        challenge: 'test-challenge',
      } as any);
    });

    it('should verify and store credential', async () => {
      await service.startRegistration('user-123');

      mockedVerifyRegistrationResponse.mockResolvedValue({
        verified: true,
        registrationInfo: {
          credential: {
            id: 'new-credential-id',
            publicKey: new Uint8Array([1, 2, 3, 4]),
            counter: 0,
          },
          credentialDeviceType: 'singleDevice',
        },
      } as any);
      mockPrismaService.webAuthnCredential.create.mockResolvedValue(mockCredential);

      const result = await service.finishRegistration('user-123', mockRegistrationResponse, 'Mon iPhone');

      expect(result.success).toBe(true);
      expect(result.credentialId).toBe('new-credential-id');
      expect(mockPrismaService.webAuthnCredential.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          credentialId: 'new-credential-id',
          deviceName: 'Mon iPhone',
        }),
      });
    });

    it('should throw if challenge expired', async () => {
      // Don't start registration, so no challenge exists

      await expect(
        service.finishRegistration('user-123', mockRegistrationResponse),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if verification fails', async () => {
      await service.startRegistration('user-123');

      mockedVerifyRegistrationResponse.mockRejectedValue(new Error('Invalid attestation'));

      await expect(
        service.finishRegistration('user-123', mockRegistrationResponse),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if verification not verified', async () => {
      await service.startRegistration('user-123');

      mockedVerifyRegistrationResponse.mockResolvedValue({
        verified: false,
        registrationInfo: null,
      } as any);

      await expect(
        service.finishRegistration('user-123', mockRegistrationResponse),
      ).rejects.toThrow(BadRequestException);
    });

    it('should use default device name if not provided', async () => {
      await service.startRegistration('user-123');

      mockedVerifyRegistrationResponse.mockResolvedValue({
        verified: true,
        registrationInfo: {
          credential: {
            id: 'new-credential-id',
            publicKey: new Uint8Array([1, 2, 3, 4]),
            counter: 0,
          },
          credentialDeviceType: 'singleDevice',
        },
      } as any);
      mockPrismaService.webAuthnCredential.create.mockResolvedValue(mockCredential);

      await service.finishRegistration('user-123', mockRegistrationResponse);

      expect(mockPrismaService.webAuthnCredential.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          deviceName: 'Appareil inconnu',
        }),
      });
    });
  });

  describe('startAuthentication', () => {
    it('should generate authentication options without email', async () => {
      mockedGenerateAuthenticationOptions.mockResolvedValue({
        challenge: 'auth-challenge-base64url',
        rpId: 'localhost',
        timeout: 60000,
        userVerification: 'preferred',
      } as any);

      const result = await service.startAuthentication();

      expect(result).toHaveProperty('challenge');
      expect(mockedGenerateAuthenticationOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          rpID: 'localhost',
          allowCredentials: undefined,
        }),
      );
    });

    it('should generate authentication options with email and allowCredentials', async () => {
      const userWithCredentials = {
        ...mockUser,
        webAuthnCredentials: [
          { credentialId: 'cred-1', transports: ['internal'] },
        ],
      };
      mockPrismaService.user.findUnique.mockResolvedValue(userWithCredentials);
      mockedGenerateAuthenticationOptions.mockResolvedValue({
        challenge: 'auth-challenge',
      } as any);

      await service.startAuthentication('patron@artjardin.fr');

      expect(mockedGenerateAuthenticationOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          allowCredentials: [{ id: 'cred-1', transports: ['internal'] }],
        }),
      );
    });

    it('should throw if user has no credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        webAuthnCredentials: [],
      });

      await expect(service.startAuthentication('patron@artjardin.fr')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.startAuthentication('unknown@email.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('finishAuthentication', () => {
    const mockAuthenticationResponse = {
      id: 'credential-id-base64url',
      rawId: 'raw-id-base64url',
      response: {
        clientDataJSON: 'client-data-json-base64url',
        authenticatorData: 'authenticator-data-base64url',
        signature: 'signature-base64url',
      },
      type: 'public-key' as const,
      clientExtensionResults: {},
      authenticatorAttachment: 'platform' as const,
    };

    beforeEach(async () => {
      // Start authentication to set up challenge
      mockedGenerateAuthenticationOptions.mockResolvedValue({
        challenge: 'auth-challenge',
      } as any);
      await service.startAuthentication();
    });

    it('should verify and return userId', async () => {
      mockPrismaService.webAuthnCredential.findUnique.mockResolvedValue({
        ...mockCredential,
        user: mockUser,
      });
      mockedVerifyAuthenticationResponse.mockResolvedValue({
        verified: true,
        authenticationInfo: {
          newCounter: 1,
        },
      } as any);
      mockPrismaService.webAuthnCredential.update.mockResolvedValue(mockCredential);

      const result = await service.finishAuthentication(mockAuthenticationResponse);

      expect(result.success).toBe(true);
      expect(result.userId).toBe('user-123');
      expect(mockPrismaService.webAuthnCredential.update).toHaveBeenCalledWith({
        where: { id: 'cred-123' },
        data: expect.objectContaining({
          counter: 1,
          lastUsedAt: expect.any(Date),
        }),
      });
    });

    it('should throw if credential not found', async () => {
      mockPrismaService.webAuthnCredential.findUnique.mockResolvedValue(null);

      await expect(service.finishAuthentication(mockAuthenticationResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user is not active', async () => {
      mockPrismaService.webAuthnCredential.findUnique.mockResolvedValue({
        ...mockCredential,
        user: { ...mockUser, actif: false },
      });

      await expect(service.finishAuthentication(mockAuthenticationResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if verification fails', async () => {
      mockPrismaService.webAuthnCredential.findUnique.mockResolvedValue({
        ...mockCredential,
        user: mockUser,
      });
      mockedVerifyAuthenticationResponse.mockRejectedValue(new Error('Invalid signature'));

      await expect(service.finishAuthentication(mockAuthenticationResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if verification not verified', async () => {
      mockPrismaService.webAuthnCredential.findUnique.mockResolvedValue({
        ...mockCredential,
        user: mockUser,
      });
      mockedVerifyAuthenticationResponse.mockResolvedValue({
        verified: false,
      } as any);

      await expect(service.finishAuthentication(mockAuthenticationResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getUserCredentials', () => {
    it('should return all credentials for user', async () => {
      const credentials = [
        { id: 'cred-1', credentialId: 'cid-1', deviceName: 'iPhone', deviceType: 'platform', lastUsedAt: new Date(), createdAt: new Date() },
        { id: 'cred-2', credentialId: 'cid-2', deviceName: 'YubiKey', deviceType: 'cross-platform', lastUsedAt: null, createdAt: new Date() },
      ];
      mockPrismaService.webAuthnCredential.findMany.mockResolvedValue(credentials);

      const result = await service.getUserCredentials('user-123');

      expect(result).toHaveLength(2);
      expect(result[0].deviceName).toBe('iPhone');
      expect(mockPrismaService.webAuthnCredential.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: expect.objectContaining({
          id: true,
          credentialId: true,
          deviceName: true,
        }),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array if no credentials', async () => {
      mockPrismaService.webAuthnCredential.findMany.mockResolvedValue([]);

      const result = await service.getUserCredentials('user-123');

      expect(result).toHaveLength(0);
    });
  });

  describe('deleteCredential', () => {
    it('should delete credential belonging to user', async () => {
      mockPrismaService.webAuthnCredential.findFirst.mockResolvedValue(mockCredential);
      mockPrismaService.webAuthnCredential.delete.mockResolvedValue(mockCredential);

      const result = await service.deleteCredential('user-123', 'cred-123');

      expect(result.success).toBe(true);
      expect(mockPrismaService.webAuthnCredential.delete).toHaveBeenCalledWith({
        where: { id: 'cred-123' },
      });
    });

    it('should throw if credential not found', async () => {
      mockPrismaService.webAuthnCredential.findFirst.mockResolvedValue(null);

      await expect(service.deleteCredential('user-123', 'unknown')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if credential belongs to different user', async () => {
      mockPrismaService.webAuthnCredential.findFirst.mockResolvedValue(null); // findFirst with userId filter returns null

      await expect(service.deleteCredential('other-user', 'cred-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('revokeAllCredentials', () => {
    it('should delete all credentials for user', async () => {
      mockPrismaService.webAuthnCredential.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.revokeAllCredentials('user-123');

      expect(result.count).toBe(3);
      expect(mockPrismaService.webAuthnCredential.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });

    it('should return 0 if no credentials', async () => {
      mockPrismaService.webAuthnCredential.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.revokeAllCredentials('user-123');

      expect(result.count).toBe(0);
    });
  });
});
