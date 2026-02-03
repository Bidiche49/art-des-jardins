import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PhotoType } from '@art-et-jardin/database';

// Create mock for StorageService to avoid importing the actual module (which has uuid ESM issues)
const mockStorageService = {
  uploadBuffer: jest.fn(),
  delete: jest.fn(),
  isConfigured: jest.fn(),
  getBucket: jest.fn(),
};

// Mock the storage service module before importing PhotosService
jest.mock('../storage/storage.service', () => ({
  StorageService: jest.fn().mockImplementation(() => mockStorageService),
}));

// Now import PhotosService after mocking
import { PhotosService } from './photos.service';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';

describe('PhotosService', () => {
  let service: PhotosService;
  let mockPhotoFindMany: jest.Mock;
  let mockPhotoFindUnique: jest.Mock;
  let mockPhotoCreate: jest.Mock;
  let mockPhotoDelete: jest.Mock;
  let mockInterventionFindUnique: jest.Mock;

  const userId = 'user-123';
  const interventionId = 'intervention-123';
  const photoId = 'photo-123';

  const mockIntervention = {
    id: interventionId,
    chantierId: 'chantier-123',
    date: new Date('2026-02-03'),
  };

  const mockPhoto = {
    id: photoId,
    interventionId,
    type: PhotoType.BEFORE,
    filename: 'test.jpg',
    s3Key: `photos/interventions/${interventionId}/${photoId}.jpg`,
    mimeType: 'image/jpeg',
    size: 1024000,
    width: 1920,
    height: 1080,
    latitude: 47.4784,
    longitude: -0.5632,
    takenAt: new Date('2026-02-03T10:30:00Z'),
    uploadedAt: new Date('2026-02-03T10:35:00Z'),
    uploadedBy: userId,
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024000,
    buffer: Buffer.from('fake-image-content'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  beforeEach(async () => {
    mockPhotoFindMany = jest.fn();
    mockPhotoFindUnique = jest.fn();
    mockPhotoCreate = jest.fn();
    mockPhotoDelete = jest.fn();
    mockInterventionFindUnique = jest.fn();

    // Reset storage mocks
    mockStorageService.uploadBuffer.mockReset();
    mockStorageService.delete.mockReset();
    mockStorageService.isConfigured.mockReset();
    mockStorageService.getBucket.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: PrismaService,
          useValue: {
            photo: {
              findMany: mockPhotoFindMany,
              findUnique: mockPhotoFindUnique,
              create: mockPhotoCreate,
              delete: mockPhotoDelete,
            },
            intervention: {
              findUnique: mockInterventionFindUnique,
            },
          },
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    mockStorageService.isConfigured.mockReturnValue(true);
    mockStorageService.getBucket.mockReturnValue('art-et-jardin');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadPhoto', () => {
    it('should upload a photo successfully', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      mockStorageService.uploadBuffer.mockResolvedValue({ key: mockPhoto.s3Key });
      mockPhotoCreate.mockResolvedValue(mockPhoto);

      const dto = {
        type: PhotoType.BEFORE,
        latitude: 47.4784,
        longitude: -0.5632,
        takenAt: '2026-02-03T10:30:00Z',
      };

      const result = await service.uploadPhoto(interventionId, mockFile, dto, userId);

      expect(result).toHaveProperty('id');
      expect(result.type).toBe(PhotoType.BEFORE);
      expect(result.interventionId).toBe(interventionId);
      expect(mockStorageService.uploadBuffer).toHaveBeenCalled();
      expect(mockPhotoCreate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when intervention does not exist', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      const dto = {
        type: PhotoType.BEFORE,
        takenAt: '2026-02-03T10:30:00Z',
      };

      await expect(
        service.uploadPhoto('non-existent', mockFile, dto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when file is too large', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);

      const largeFile = { ...mockFile, size: 15 * 1024 * 1024 }; // 15MB

      const dto = {
        type: PhotoType.BEFORE,
        takenAt: '2026-02-03T10:30:00Z',
      };

      await expect(
        service.uploadPhoto(interventionId, largeFile, dto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when file type is invalid', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);

      const invalidFile = { ...mockFile, mimetype: 'application/pdf' };

      const dto = {
        type: PhotoType.BEFORE,
        takenAt: '2026-02-03T10:30:00Z',
      };

      await expect(
        service.uploadPhoto(interventionId, invalidFile, dto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no file provided', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);

      const dto = {
        type: PhotoType.BEFORE,
        takenAt: '2026-02-03T10:30:00Z',
      };

      await expect(
        service.uploadPhoto(interventionId, null as any, dto, userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPhotosByIntervention', () => {
    it('should return photos for an intervention', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      mockPhotoFindMany.mockResolvedValue([mockPhoto]);

      const result = await service.getPhotosByIntervention(interventionId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(photoId);
      expect(mockPhotoFindMany).toHaveBeenCalledWith({
        where: { interventionId },
        orderBy: [{ type: 'asc' }, { takenAt: 'asc' }],
      });
    });

    it('should throw NotFoundException when intervention does not exist', async () => {
      mockInterventionFindUnique.mockResolvedValue(null);

      await expect(
        service.getPhotosByIntervention('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return empty array when no photos', async () => {
      mockInterventionFindUnique.mockResolvedValue(mockIntervention);
      mockPhotoFindMany.mockResolvedValue([]);

      const result = await service.getPhotosByIntervention(interventionId);

      expect(result).toHaveLength(0);
    });
  });

  describe('getPhotoById', () => {
    it('should return a photo by id', async () => {
      mockPhotoFindUnique.mockResolvedValue(mockPhoto);

      const result = await service.getPhotoById(photoId);

      expect(result.id).toBe(photoId);
      expect(result.filename).toBe('test.jpg');
    });

    it('should throw NotFoundException when photo does not exist', async () => {
      mockPhotoFindUnique.mockResolvedValue(null);

      await expect(service.getPhotoById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePhoto', () => {
    it('should delete a photo successfully', async () => {
      mockPhotoFindUnique.mockResolvedValue(mockPhoto);
      mockStorageService.delete.mockResolvedValue(undefined);
      mockPhotoDelete.mockResolvedValue(mockPhoto);

      await service.deletePhoto(photoId, userId);

      expect(mockStorageService.delete).toHaveBeenCalledWith(mockPhoto.s3Key);
      expect(mockPhotoDelete).toHaveBeenCalledWith({ where: { id: photoId } });
    });

    it('should throw NotFoundException when photo does not exist', async () => {
      mockPhotoFindUnique.mockResolvedValue(null);

      await expect(service.deletePhoto('non-existent', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should still delete from database even if S3 deletion fails', async () => {
      mockPhotoFindUnique.mockResolvedValue(mockPhoto);
      mockStorageService.delete.mockRejectedValue(new Error('S3 error'));
      mockPhotoDelete.mockResolvedValue(mockPhoto);

      await service.deletePhoto(photoId, userId);

      expect(mockPhotoDelete).toHaveBeenCalledWith({ where: { id: photoId } });
    });
  });

  describe('getPhotosByType', () => {
    it('should return photos filtered by type', async () => {
      const beforePhotos = [mockPhoto];
      mockPhotoFindMany.mockResolvedValue(beforePhotos);

      const result = await service.getPhotosByType(interventionId, PhotoType.BEFORE);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(PhotoType.BEFORE);
      expect(mockPhotoFindMany).toHaveBeenCalledWith({
        where: { interventionId, type: PhotoType.BEFORE },
        orderBy: { takenAt: 'asc' },
      });
    });

    it('should return empty array when no photos of type', async () => {
      mockPhotoFindMany.mockResolvedValue([]);

      const result = await service.getPhotosByType(interventionId, PhotoType.AFTER);

      expect(result).toHaveLength(0);
    });
  });
});
