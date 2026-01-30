import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

describe('ClientAuthService', () => {
  let service: ClientAuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockClient = {
    id: 'client-123',
    email: 'client@example.com',
    nom: 'Dupont',
    prenom: 'Jean',
    type: 'PARTICULIER',
  };

  const mockPrismaService = {
    client: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    clientAuthToken: {
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3001'),
  };

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientAuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<ClientAuthService>(ClientAuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);

    jest.clearAllMocks();
  });

  describe('requestMagicLink', () => {
    it('should return generic message when client not found', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(null);

      const result = await service.requestMagicLink('unknown@example.com');

      expect(result.message).toBe('Si cette adresse existe, un email a été envoyé');
      expect(mockMailService.sendMail).not.toHaveBeenCalled();
    });

    it('should create token and send email for existing client', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.clientAuthToken.count.mockResolvedValue(0);
      mockPrismaService.clientAuthToken.create.mockResolvedValue({ id: 'token-1' });

      const result = await service.requestMagicLink('client@example.com');

      expect(result.message).toBe('Si cette adresse existe, un email a été envoyé');
      expect(mockPrismaService.clientAuthToken.create).toHaveBeenCalled();
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockClient.email,
          subject: expect.stringContaining('Connexion'),
        }),
      );
    });

    it('should throw error when too many recent tokens', async () => {
      mockPrismaService.client.findFirst.mockResolvedValue(mockClient);
      mockPrismaService.clientAuthToken.count.mockResolvedValue(3);

      await expect(service.requestMagicLink('client@example.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyToken', () => {
    const mockAuthToken = {
      id: 'auth-token-1',
      token: 'valid-token',
      clientId: mockClient.id,
      client: mockClient,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      usedAt: null,
    };

    it('should return tokens and client info for valid token', async () => {
      mockPrismaService.clientAuthToken.findUnique.mockResolvedValue(mockAuthToken);
      mockPrismaService.clientAuthToken.update.mockResolvedValue({ ...mockAuthToken, usedAt: new Date() });

      const result = await service.verifyToken('valid-token');

      expect(result.client.id).toBe(mockClient.id);
      expect(result.client.email).toBe(mockClient.email);
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockPrismaService.clientAuthToken.findUnique.mockResolvedValue(null);

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for already used token', async () => {
      mockPrismaService.clientAuthToken.findUnique.mockResolvedValue({
        ...mockAuthToken,
        usedAt: new Date(),
      });

      await expect(service.verifyToken('used-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired token', async () => {
      mockPrismaService.clientAuthToken.findUnique.mockResolvedValue({
        ...mockAuthToken,
        expiresAt: new Date(Date.now() - 10 * 60 * 1000),
      });

      await expect(service.verifyToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: mockClient.id,
        email: mockClient.email,
        type: 'client',
      });
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.refreshToken('valid-refresh-token');

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException for non-client token', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'user-123',
        email: 'user@example.com',
        type: 'user',
      });

      await expect(service.refreshToken('user-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for non-existent client', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'deleted-client',
        email: 'deleted@example.com',
        type: 'client',
      });
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getClientFromToken', () => {
    it('should return client info for valid client id', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.getClientFromToken(mockClient.id);

      expect(result.id).toBe(mockClient.id);
      expect(result.email).toBe(mockClient.email);
      expect(result.nom).toBe(mockClient.nom);
    });

    it('should throw UnauthorizedException for non-existent client', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(service.getClientFromToken('invalid-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
