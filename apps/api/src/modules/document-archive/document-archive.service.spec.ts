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

import { DocumentArchiveService } from './document-archive.service';
import { StorageService } from '../storage/storage.service';

describe('DocumentArchiveService', () => {
  let service: DocumentArchiveService;

  const mockArchive = {
    id: 'archive-123',
    documentType: 'devis',
    documentId: 'devis-456',
    documentNumero: 'DEV-2026-001',
    s3Key: 'devis/2026/02/devis-456/devis-DEV-2026-001.pdf',
    s3Bucket: 'art-et-jardin-archives',
    fileName: 'devis-DEV-2026-001.pdf',
    fileSize: 50000,
    mimeType: 'application/pdf',
    checksum: 'abc123def456',
    archivedAt: new Date(),
  };

  const mockPrismaService = {
    documentArchive: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        ARCHIVE_BUCKET: 'art-et-jardin-archives',
      };
      return config[key];
    }),
  };

  const mockStorageService = {
    uploadBuffer: jest.fn().mockResolvedValue({ size: 50000 }),
    downloadBuffer: jest.fn().mockResolvedValue(Buffer.from('PDF content')),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentArchiveService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<DocumentArchiveService>(DocumentArchiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('archiveDocument', () => {
    const pdfBuffer = Buffer.from('PDF content');

    it('should archive a document and return result', async () => {
      mockPrismaService.documentArchive.findFirst.mockResolvedValue(null);
      mockPrismaService.documentArchive.create.mockResolvedValue(mockArchive);

      const result = await service.archiveDocument({
        documentType: 'devis',
        documentId: 'devis-456',
        documentNumero: 'DEV-2026-001',
        pdfBuffer,
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('s3Key');
      expect(result).toHaveProperty('fileName');
      expect(result).toHaveProperty('fileSize');
      expect(result).toHaveProperty('checksum');
      expect(mockStorageService.uploadBuffer).toHaveBeenCalled();
      expect(mockPrismaService.documentArchive.create).toHaveBeenCalled();
    });

    it('should skip upload if same checksum exists', async () => {
      mockPrismaService.documentArchive.findFirst.mockResolvedValue(mockArchive);

      const result = await service.archiveDocument({
        documentType: 'devis',
        documentId: 'devis-456',
        documentNumero: 'DEV-2026-001',
        pdfBuffer,
      });

      expect(result.id).toBe(mockArchive.id);
      expect(mockStorageService.uploadBuffer).not.toHaveBeenCalled();
    });

    it('should include metadata in archive', async () => {
      mockPrismaService.documentArchive.findFirst.mockResolvedValue(null);
      mockPrismaService.documentArchive.create.mockResolvedValue(mockArchive);

      await service.archiveDocument({
        documentType: 'facture',
        documentId: 'facture-789',
        documentNumero: 'FAC-2026-001',
        pdfBuffer,
        metadata: { sentTo: 'client@example.com' },
      });

      expect(mockPrismaService.documentArchive.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: { sentTo: 'client@example.com' },
        }),
      });
    });
  });

  describe('getArchivedDocument', () => {
    it('should return document with buffer', async () => {
      mockPrismaService.documentArchive.findFirst.mockResolvedValue(mockArchive);

      const result = await service.getArchivedDocument('devis', 'devis-456');

      expect(result).toHaveProperty('buffer');
      expect(mockStorageService.downloadBuffer).toHaveBeenCalledWith(
        mockArchive.s3Key,
        mockArchive.s3Bucket,
      );
    });

    it('should return null if not found', async () => {
      mockPrismaService.documentArchive.findFirst.mockResolvedValue(null);

      const result = await service.getArchivedDocument('devis', 'unknown');

      expect(result).toBeNull();
      expect(mockStorageService.downloadBuffer).not.toHaveBeenCalled();
    });
  });

  describe('getDocumentArchives', () => {
    it('should return all archives for a document', async () => {
      const archives = [mockArchive, { ...mockArchive, id: 'archive-456' }];
      mockPrismaService.documentArchive.findMany.mockResolvedValue(archives);

      const result = await service.getDocumentArchives('devis', 'devis-456');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.documentArchive.findMany).toHaveBeenCalledWith({
        where: { documentType: 'devis', documentId: 'devis-456' },
        orderBy: { archivedAt: 'desc' },
      });
    });
  });

  describe('searchArchives', () => {
    it('should search by document type', async () => {
      mockPrismaService.documentArchive.findMany.mockResolvedValue([mockArchive]);

      const result = await service.searchArchives({ documentType: 'devis' });

      expect(result).toHaveLength(1);
      expect(mockPrismaService.documentArchive.findMany).toHaveBeenCalledWith({
        where: { documentType: 'devis' },
        orderBy: { archivedAt: 'desc' },
        take: 50,
      });
    });

    it('should search by start date', async () => {
      const startDate = new Date('2026-01-01');
      mockPrismaService.documentArchive.findMany.mockResolvedValue([]);

      await service.searchArchives({ startDate });

      expect(mockPrismaService.documentArchive.findMany).toHaveBeenCalledWith({
        where: {
          archivedAt: { gte: startDate },
        },
        orderBy: { archivedAt: 'desc' },
        take: 50,
      });
    });

    it('should search by end date', async () => {
      const endDate = new Date('2026-02-01');
      mockPrismaService.documentArchive.findMany.mockResolvedValue([]);

      await service.searchArchives({ endDate });

      expect(mockPrismaService.documentArchive.findMany).toHaveBeenCalledWith({
        where: {
          archivedAt: { lte: endDate },
        },
        orderBy: { archivedAt: 'desc' },
        take: 50,
      });
    });

    it('should respect custom limit', async () => {
      mockPrismaService.documentArchive.findMany.mockResolvedValue([]);

      await service.searchArchives({ limit: 10 });

      expect(mockPrismaService.documentArchive.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { archivedAt: 'desc' },
        take: 10,
      });
    });
  });

  describe('getArchiveStats', () => {
    it('should return archive statistics', async () => {
      mockPrismaService.documentArchive.count.mockResolvedValue(100);
      mockPrismaService.documentArchive.groupBy.mockResolvedValue([
        { documentType: 'devis', _count: 60 },
        { documentType: 'facture', _count: 40 },
      ]);
      mockPrismaService.documentArchive.aggregate.mockResolvedValue({
        _sum: { fileSize: 500000000 },
      });

      const result = await service.getArchiveStats();

      expect(result).toEqual({
        total: 100,
        byType: { devis: 60, facture: 40 },
        totalSizeBytes: 500000000,
        totalSizeMB: '476.84',
      });
    });

    it('should handle empty archives', async () => {
      mockPrismaService.documentArchive.count.mockResolvedValue(0);
      mockPrismaService.documentArchive.groupBy.mockResolvedValue([]);
      mockPrismaService.documentArchive.aggregate.mockResolvedValue({
        _sum: { fileSize: null },
      });

      const result = await service.getArchiveStats();

      expect(result).toEqual({
        total: 0,
        byType: {},
        totalSizeBytes: 0,
        totalSizeMB: '0.00',
      });
    });
  });

  describe('verifyArchiveIntegrity', () => {
    it('should return true if checksum matches', async () => {
      // Create a buffer that will produce a specific checksum
      const buffer = Buffer.from('PDF content');
      mockPrismaService.documentArchive.findUnique.mockResolvedValue({
        ...mockArchive,
        checksum: require('crypto').createHash('md5').update(buffer).digest('hex'),
      });
      mockStorageService.downloadBuffer.mockResolvedValue(buffer);

      const result = await service.verifyArchiveIntegrity('archive-123');

      expect(result).toBe(true);
    });

    it('should return false if checksum does not match', async () => {
      mockPrismaService.documentArchive.findUnique.mockResolvedValue({
        ...mockArchive,
        checksum: 'different-checksum',
      });
      mockStorageService.downloadBuffer.mockResolvedValue(Buffer.from('PDF content'));

      const result = await service.verifyArchiveIntegrity('archive-123');

      expect(result).toBe(false);
    });

    it('should return false if archive not found', async () => {
      mockPrismaService.documentArchive.findUnique.mockResolvedValue(null);

      const result = await service.verifyArchiveIntegrity('unknown');

      expect(result).toBe(false);
    });

    it('should return false on download error', async () => {
      mockPrismaService.documentArchive.findUnique.mockResolvedValue(mockArchive);
      mockStorageService.downloadBuffer.mockRejectedValue(new Error('S3 error'));

      const result = await service.verifyArchiveIntegrity('archive-123');

      expect(result).toBe(false);
    });
  });
});
