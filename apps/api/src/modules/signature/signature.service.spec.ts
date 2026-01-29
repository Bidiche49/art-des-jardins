import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';

describe('SignatureService', () => {
  let service: SignatureService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let mailService: MailService;
  let pdfService: PdfService;

  const mockDevis = {
    id: 'devis-123',
    numero: 'D-2024-0001',
    statut: 'brouillon',
    totalHT: 100,
    totalTVA: 20,
    totalTTC: 120,
    notes: null,
    dateEmission: new Date(),
    dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    chantier: {
      id: 'chantier-123',
      adresse: '123 Rue Test',
      codePostal: '49000',
      ville: 'Angers',
      description: 'Test chantier',
      client: {
        id: 'client-123',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@test.com',
        adresse: '123 Rue Client',
        codePostal: '49000',
        ville: 'Angers',
      },
    },
    lignes: [
      {
        id: 'ligne-1',
        description: 'Taille haie',
        quantite: 1,
        unite: 'forfait',
        prixUnitaireHT: 100,
        montantHT: 100,
        montantTTC: 120,
        ordre: 0,
      },
    ],
    signature: null,
  };

  const mockSignature = {
    id: 'sig-123',
    devisId: 'devis-123',
    token: 'valid-token',
    imageBase64: '',
    signedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress: '',
    userAgent: '',
    cgvAccepted: false,
    devis: mockDevis,
  };

  const mockPrismaService = {
    devis: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    signatureDevis: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((operations) => Promise.all(operations)),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue(true),
    sendSignatureConfirmation: jest.fn().mockResolvedValue(true),
    sendSignatureNotification: jest.fn().mockResolvedValue(true),
  };

  const mockPdfService = {
    generateDevis: jest.fn().mockResolvedValue(Buffer.from('mock-pdf')),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        FRONTEND_URL: 'https://artjardin.fr',
        JWT_SECRET: 'test-secret',
        PATRON_EMAIL: 'patron@artjardin.fr',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
        { provide: PdfService, useValue: mockPdfService },
      ],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    pdfService = module.get<PdfService>(PdfService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSignatureRequest', () => {
    it('should send signature request successfully', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);
      mockPrismaService.signatureDevis.upsert.mockResolvedValue(mockSignature);
      mockPrismaService.devis.update.mockResolvedValue({ ...mockDevis, statut: 'envoye' });

      const result = await service.sendSignatureRequest('devis-123', {});

      expect(result.success).toBe(true);
      expect(result.email).toBe('jean.dupont@test.com');
      expect(mockMailService.sendMail).toHaveBeenCalled();
      expect(mockPrismaService.devis.update).toHaveBeenCalledWith({
        where: { id: 'devis-123' },
        data: { statut: 'envoye' },
      });
    });

    it('should throw NotFoundException if devis not found', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(null);

      await expect(service.sendSignatureRequest('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if devis already signed', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue({
        ...mockDevis,
        signature: { id: 'sig-123', imageBase64: 'data:image/png;base64,...' },
      });

      await expect(service.sendSignatureRequest('devis-123', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use custom email if provided', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);
      mockPrismaService.signatureDevis.upsert.mockResolvedValue(mockSignature);
      mockPrismaService.devis.update.mockResolvedValue({ ...mockDevis, statut: 'envoye' });

      const result = await service.sendSignatureRequest('devis-123', {
        email: 'custom@test.com',
      });

      expect(result.email).toBe('custom@test.com');
      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'custom@test.com' }),
      );
    });
  });

  describe('getDevisForSignature', () => {
    it('should return devis details for valid token', async () => {
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(mockSignature);

      const result = await service.getDevisForSignature('valid-token');

      expect(result.alreadySigned).toBe(false);
      expect(result.devis.numero).toBe('D-2024-0001');
    });

    it('should throw NotFoundException for invalid token', async () => {
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(null);

      await expect(service.getDevisForSignature('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException for expired token', async () => {
      const expiredSignature = {
        ...mockSignature,
        expiresAt: new Date(Date.now() - 1000), // Expired
      };
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(expiredSignature);

      await expect(service.getDevisForSignature('expired-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should indicate if already signed', async () => {
      const signedSignature = {
        ...mockSignature,
        imageBase64: 'data:image/png;base64,iVBORw0KGg...',
      };
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(signedSignature);

      const result = await service.getDevisForSignature('valid-token');

      expect(result.alreadySigned).toBe(true);
    });
  });

  describe('signDevis', () => {
    const validDto = {
      signatureBase64: 'data:image/png;base64,iVBORw0KGg...',
      cgvAccepted: true,
    };

    it('should sign devis successfully', async () => {
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(mockSignature);
      mockPrismaService.$transaction.mockResolvedValue([{}, {}, {}]);

      const result = await service.signDevis(
        'valid-token',
        validDto,
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(result.success).toBe(true);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPdfService.generateDevis).toHaveBeenCalled();
      expect(mockMailService.sendSignatureConfirmation).toHaveBeenCalled();
      expect(mockMailService.sendSignatureNotification).toHaveBeenCalled();
    });

    it('should throw BadRequestException if CGV not accepted', async () => {
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(mockSignature);

      await expect(
        service.signDevis(
          'valid-token',
          { ...validDto, cgvAccepted: false },
          '127.0.0.1',
          'Mozilla/5.0',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if already signed', async () => {
      const signedSignature = {
        ...mockSignature,
        imageBase64: 'data:image/png;base64,existing...',
      };
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(signedSignature);

      await expect(
        service.signDevis('valid-token', validDto, '127.0.0.1', 'Mozilla/5.0'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid signature format', async () => {
      mockPrismaService.signatureDevis.findUnique.mockResolvedValue(mockSignature);

      await expect(
        service.signDevis(
          'valid-token',
          { ...validDto, signatureBase64: 'invalid-format' },
          '127.0.0.1',
          'Mozilla/5.0',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
