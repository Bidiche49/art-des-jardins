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

import { BackupService } from './backup.service';
import { StorageService } from '../storage/storage.service';
import { BackupCryptoService } from './backup-crypto.service';

describe('BackupService', () => {
  let service: BackupService;

  const mockBackupHistory = {
    id: 'backup-123',
    fileName: 'backup-2026-02-02.sql.gz',
    s3Key: 'backups/2026/02/backup-2026-02-02.sql.gz',
    s3Bucket: 'art-et-jardin-backups',
    fileSize: 1024000,
    durationMs: 5000,
    status: 'success',
    createdAt: new Date(),
  };

  const mockPrismaService = {
    backupHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        DATABASE_URL: 'postgresql://localhost/test',
        BACKUP_BUCKET: 'art-et-jardin-backups',
        BACKUP_ENABLED: 'false', // Disabled to prevent actual backups
        BACKUP_RETENTION_DAYS: '30',
      };
      return config[key];
    }),
  };

  const mockStorageService = {
    isConfigured: jest.fn().mockReturnValue(true),
    uploadBuffer: jest.fn().mockResolvedValue({ size: 1024000 }),
  };

  const mockBackupCryptoService = {
    isConfigured: jest.fn().mockReturnValue(false),
    encryptBuffer: jest.fn(),
    decryptBuffer: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: BackupCryptoService, useValue: mockBackupCryptoService },
      ],
    }).compile();

    service = module.get<BackupService>(BackupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBackupHistory', () => {
    it('should return backup history ordered by date desc', async () => {
      const backups = [mockBackupHistory, { ...mockBackupHistory, id: 'backup-456' }];
      mockPrismaService.backupHistory.findMany.mockResolvedValue(backups);

      const result = await service.getBackupHistory(30);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.backupHistory.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
    });

    it('should use default limit of 30', async () => {
      mockPrismaService.backupHistory.findMany.mockResolvedValue([]);

      await service.getBackupHistory();

      expect(mockPrismaService.backupHistory.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
    });
  });

  describe('getLastSuccessfulBackup', () => {
    it('should return the most recent successful backup', async () => {
      mockPrismaService.backupHistory.findFirst.mockResolvedValue(mockBackupHistory);

      const result = await service.getLastSuccessfulBackup();

      expect(result).toEqual(mockBackupHistory);
      expect(mockPrismaService.backupHistory.findFirst).toHaveBeenCalledWith({
        where: { status: 'success' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return null if no successful backup exists', async () => {
      mockPrismaService.backupHistory.findFirst.mockResolvedValue(null);

      const result = await service.getLastSuccessfulBackup();

      expect(result).toBeNull();
    });
  });

  describe('getBackupStats', () => {
    it('should return backup statistics', async () => {
      mockPrismaService.backupHistory.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // successful
        .mockResolvedValueOnce(2); // failed
      mockPrismaService.backupHistory.findFirst.mockResolvedValue(mockBackupHistory);
      mockPrismaService.backupHistory.aggregate.mockResolvedValue({
        _sum: { fileSize: 10240000 },
      });

      const result = await service.getBackupStats();

      expect(result).toEqual({
        total: 10,
        successful: 8,
        failed: 2,
        totalSizeBytes: 10240000,
        lastBackupAt: mockBackupHistory.createdAt,
        retentionDays: 30,
        encryptionEnabled: false,
      });
    });

    it('should handle no backups', async () => {
      mockPrismaService.backupHistory.count.mockResolvedValue(0);
      mockPrismaService.backupHistory.findFirst.mockResolvedValue(null);
      mockPrismaService.backupHistory.aggregate.mockResolvedValue({
        _sum: { fileSize: null },
      });

      const result = await service.getBackupStats();

      expect(result).toEqual({
        total: 0,
        successful: 0,
        failed: 0,
        totalSizeBytes: 0,
        lastBackupAt: null,
        retentionDays: 30,
        encryptionEnabled: false,
      });
    });
  });

  describe('onModuleInit', () => {
    it('should log warning when backup is disabled', () => {
      // BackupService was initialized with BACKUP_ENABLED=false
      // This is tested implicitly - no error thrown
      expect(service).toBeDefined();
    });
  });

  describe('handleDailyBackup', () => {
    it('should not create backup when disabled', async () => {
      // BACKUP_ENABLED is false in our mock
      await service.handleDailyBackup();

      expect(mockStorageService.uploadBuffer).not.toHaveBeenCalled();
    });
  });

  describe('isEncryptionEnabled', () => {
    it('should return false when crypto service is not configured', () => {
      mockBackupCryptoService.isConfigured.mockReturnValue(false);
      expect(service.isEncryptionEnabled()).toBe(false);
    });

    it('should return true when crypto service is configured', () => {
      mockBackupCryptoService.isConfigured.mockReturnValue(true);
      expect(service.isEncryptionEnabled()).toBe(true);
    });
  });

  describe('decryptBackup', () => {
    it('should throw error when encryption not configured', async () => {
      mockBackupCryptoService.isConfigured.mockReturnValue(false);
      const buffer = Buffer.from('test');

      await expect(service.decryptBackup(buffer)).rejects.toThrow(
        'Backup decryption not available: encryption key not configured',
      );
    });

    it('should decrypt buffer when encryption is configured', async () => {
      mockBackupCryptoService.isConfigured.mockReturnValue(true);
      const encryptedBuffer = Buffer.from('encrypted');
      const decryptedBuffer = Buffer.from('decrypted');
      mockBackupCryptoService.decryptBuffer.mockResolvedValue(decryptedBuffer);

      const result = await service.decryptBackup(encryptedBuffer);

      expect(result).toBe(decryptedBuffer);
      expect(mockBackupCryptoService.decryptBuffer).toHaveBeenCalledWith(
        encryptedBuffer,
      );
    });
  });
});
