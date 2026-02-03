import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

// Mock uuid before importing services that use it
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

// Mock @aws-sdk/client-s3
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  HeadBucketCommand: jest.fn(),
}));

import { AutoSendService } from './auto-send.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { DocumentArchiveService } from '../document-archive/document-archive.service';

describe('AutoSendService', () => {
  let service: AutoSendService;

  const mockClient = {
    id: 'client-123',
    nom: 'Dupont',
    prenom: 'Jean',
    raisonSociale: null,
    email: 'client@example.com',
    adresse: '123 Rue de la Paix',
    codePostal: '49000',
    ville: 'Angers',
  };

  const mockChantier = {
    id: 'chantier-123',
    client: mockClient,
  };

  const mockDevis = {
    id: 'devis-123',
    numero: 'DEV-2026-001',
    dateEmission: new Date(),
    dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    totalHT: 1000,
    totalTVA: 200,
    totalTTC: 1200,
    conditionsParticulieres: null,
    chantier: mockChantier,
    lignes: [
      {
        description: 'Prestation 1',
        quantite: 1,
        unite: 'u',
        prixUnitaireHT: 1000,
        montantHT: 1000,
        tva: 20,
      },
    ],
    signature: null,
  };

  const mockFacture = {
    id: 'facture-123',
    numero: 'FAC-2026-001',
    dateEmission: new Date(),
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    totalHT: 1000,
    totalTVA: 200,
    totalTTC: 1200,
    mentionsLegales: null,
    devis: {
      ...mockDevis,
      chantier: mockChantier,
    },
    lignes: [
      {
        description: 'Prestation 1',
        quantite: 1,
        unite: 'u',
        prixUnitaireHT: 1000,
        montantHT: 1000,
        tva: 20,
      },
    ],
  };

  const mockPrismaService = {
    devis: {
      findUnique: jest.fn(),
    },
    facture: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        AUTO_SEND_ENABLED: 'true',
      };
      return config[key];
    }),
  };

  const mockMailService = {
    sendDevis: jest.fn().mockResolvedValue(true),
    sendFacture: jest.fn().mockResolvedValue(true),
    sendSignatureConfirmation: jest.fn().mockResolvedValue(true),
  };

  const mockPdfService = {
    generateDevis: jest.fn().mockResolvedValue(Buffer.from('PDF')),
    generateFacture: jest.fn().mockResolvedValue(Buffer.from('PDF')),
  };

  const mockArchiveService = {
    archiveDocument: jest.fn().mockResolvedValue({
      id: 'archive-123',
      s3Key: 'devis/2026/02/devis-123.pdf',
      fileName: 'devis-DEV-2026-001.pdf',
      fileSize: 50000,
      checksum: 'abc123',
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoSendService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
        { provide: PdfService, useValue: mockPdfService },
        { provide: DocumentArchiveService, useValue: mockArchiveService },
      ],
    }).compile();

    service = module.get<AutoSendService>(AutoSendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onDevisStatusChange', () => {
    it('should send devis when status changes to envoye', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);

      const result = await service.onDevisStatusChange('devis-123', 'brouillon', 'envoye');

      expect(result.sent).toBe(true);
      expect(result.archived).toBe(true);
      expect(mockPdfService.generateDevis).toHaveBeenCalled();
      expect(mockArchiveService.archiveDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          documentType: 'devis',
          documentId: 'devis-123',
        }),
      );
      expect(mockMailService.sendDevis).toHaveBeenCalledWith(
        'client@example.com',
        'DEV-2026-001',
        'Jean Dupont',
        expect.any(Buffer),
        'devis-123',
      );
    });

    it('should not send if status is already envoye', async () => {
      const result = await service.onDevisStatusChange('devis-123', 'envoye', 'envoye');

      expect(result.sent).toBe(false);
      expect(result.archived).toBe(false);
      expect(mockMailService.sendDevis).not.toHaveBeenCalled();
    });

    it('should send signed devis when status changes to signe', async () => {
      const devisWithSignature = {
        ...mockDevis,
        signature: {
          imageBase64: 'base64...',
          signedAt: new Date(),
          ipAddress: '192.168.1.1',
          token: 'sig-token-123',
        },
      };
      mockPrismaService.devis.findUnique.mockResolvedValue(devisWithSignature);

      const result = await service.onDevisStatusChange('devis-123', 'envoye', 'signe');

      expect(result.sent).toBe(true);
      expect(result.archived).toBe(true);
      expect(mockArchiveService.archiveDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          documentType: 'devis_signe',
        }),
      );
      expect(mockMailService.sendSignatureConfirmation).toHaveBeenCalled();
    });

    it('should return error if devis not found', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(null);

      const result = await service.onDevisStatusChange('unknown', 'brouillon', 'envoye');

      expect(result.sent).toBe(false);
      expect(result.error).toBe('Devis not found');
    });

    it('should handle other status changes without sending', async () => {
      const result = await service.onDevisStatusChange('devis-123', 'brouillon', 'accepte');

      expect(result.sent).toBe(false);
      expect(result.archived).toBe(false);
    });
  });

  describe('onFactureStatusChange', () => {
    it('should send facture when status changes to envoyee', async () => {
      mockPrismaService.facture.findUnique.mockResolvedValue(mockFacture);

      const result = await service.onFactureStatusChange('facture-123', 'brouillon', 'envoyee');

      expect(result.sent).toBe(true);
      expect(result.archived).toBe(true);
      expect(mockPdfService.generateFacture).toHaveBeenCalled();
      expect(mockArchiveService.archiveDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          documentType: 'facture',
          documentId: 'facture-123',
        }),
      );
      expect(mockMailService.sendFacture).toHaveBeenCalled();
    });

    it('should not send if status is already envoyee', async () => {
      const result = await service.onFactureStatusChange('facture-123', 'envoyee', 'envoyee');

      expect(result.sent).toBe(false);
      expect(mockMailService.sendFacture).not.toHaveBeenCalled();
    });

    it('should return error if facture not found', async () => {
      mockPrismaService.facture.findUnique.mockResolvedValue(null);

      const result = await service.onFactureStatusChange('unknown', 'brouillon', 'envoyee');

      expect(result.sent).toBe(false);
      expect(result.error).toBe('Facture not found');
    });
  });

  describe('forceSendDevis', () => {
    it('should force send a devis', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);

      const result = await service.forceSendDevis('devis-123');

      expect(result.sent).toBe(true);
      expect(mockMailService.sendDevis).toHaveBeenCalled();
    });
  });

  describe('forceSendFacture', () => {
    it('should force send a facture', async () => {
      mockPrismaService.facture.findUnique.mockResolvedValue(mockFacture);

      const result = await service.forceSendFacture('facture-123');

      expect(result.sent).toBe(true);
      expect(mockMailService.sendFacture).toHaveBeenCalled();
    });
  });

  describe('auto-send disabled', () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      const disabledConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'AUTO_SEND_ENABLED') return 'false';
          return undefined;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AutoSendService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: ConfigService, useValue: disabledConfigService },
          { provide: MailService, useValue: mockMailService },
          { provide: PdfService, useValue: mockPdfService },
          { provide: DocumentArchiveService, useValue: mockArchiveService },
        ],
      }).compile();

      service = module.get<AutoSendService>(AutoSendService);
    });

    it('should not send when auto-send is disabled', async () => {
      const result = await service.onDevisStatusChange('devis-123', 'brouillon', 'envoye');

      expect(result.sent).toBe(false);
      expect(result.archived).toBe(false);
      expect(mockMailService.sendDevis).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle PDF generation error', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);
      mockPdfService.generateDevis.mockRejectedValue(new Error('PDF generation failed'));

      const result = await service.onDevisStatusChange('devis-123', 'brouillon', 'envoye');

      expect(result.sent).toBe(false);
      expect(result.error).toBe('PDF generation failed');
    });

    it('should handle archive error', async () => {
      mockPrismaService.devis.findUnique.mockResolvedValue(mockDevis);
      mockPdfService.generateDevis.mockResolvedValue(Buffer.from('PDF')); // Reset PDF mock
      mockArchiveService.archiveDocument.mockRejectedValue(new Error('S3 upload failed'));

      const result = await service.onDevisStatusChange('devis-123', 'brouillon', 'envoye');

      expect(result.sent).toBe(false);
      expect(result.error).toBe('S3 upload failed');
    });
  });
});
