import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create a mock function for apiClient.post using vi.hoisted
const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn().mockImplementation(async (file: File) => {
    // Simulate compression by returning a smaller blob
    const compressedContent = new Blob(['compressed'], { type: 'image/jpeg' });
    Object.defineProperty(compressedContent, 'name', { value: file.name });
    return compressedContent;
  }),
}));

// Mock apiClient
vi.mock('@/api/client', () => ({
  default: {
    post: mockPost,
  },
}));

import { photoService, type PhotoData } from './photo.service';
import { db } from '@/db/schema';

describe('PhotoService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset mock to default success behavior
    mockPost.mockResolvedValue({
      data: { id: 'photo-123', url: 'https://example.com/photo.jpg' },
    });
    // Clear the photoQueue before each test
    await db.photoQueue.clear();
  });

  afterEach(async () => {
    await db.photoQueue.clear();
  });

  describe('compressImage', () => {
    it('should compress an image file', async () => {
      const originalFile = new File(['a'.repeat(5000000)], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = await photoService.compressImage(originalFile);

      expect(result.originalSize).toBe(5000000);
      expect(result.compressedSize).toBeLessThan(result.originalSize);
      expect(result.blob).toBeDefined();
      expect(result.mimeType).toBe('image/jpeg');
    });

    it('should return original file if compression fails', async () => {
      const imageCompression = await import('browser-image-compression');
      vi.mocked(imageCompression.default).mockRejectedValueOnce(
        new Error('Compression failed')
      );

      const originalFile = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const result = await photoService.compressImage(originalFile);

      expect(result.originalSize).toBe(originalFile.size);
      expect(result.compressedSize).toBe(originalFile.size);
    });
  });

  describe('getCurrentPosition', () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };

    beforeEach(() => {
      vi.stubGlobal('navigator', {
        ...navigator,
        geolocation: mockGeolocation,
        onLine: true,
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should return coordinates when geolocation succeeds', async () => {
      mockGeolocation.getCurrentPosition.mockImplementationOnce(
        (success: (pos: GeolocationPosition) => void) => {
          success({
            coords: {
              latitude: 47.4784,
              longitude: -0.5632,
            },
          } as GeolocationPosition);
        }
      );

      const result = await photoService.getCurrentPosition();

      expect(result).toEqual({ lat: 47.4784, lng: -0.5632 });
    });

    it('should return null when geolocation fails', async () => {
      mockGeolocation.getCurrentPosition.mockImplementationOnce(
        (_: unknown, error: (err: GeolocationPositionError) => void) => {
          error({ message: 'User denied geolocation' } as GeolocationPositionError);
        }
      );

      const result = await photoService.getCurrentPosition();

      expect(result).toBeNull();
    });

    it('should return null when geolocation is not available', async () => {
      vi.stubGlobal('navigator', { onLine: true });

      const result = await photoService.getCurrentPosition();

      expect(result).toBeNull();
    });
  });

  describe('capturePhoto', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', {
        geolocation: {
          getCurrentPosition: vi.fn((success: (pos: GeolocationPosition) => void) => {
            success({
              coords: { latitude: 47.4784, longitude: -0.5632 },
            } as GeolocationPosition);
          }),
        },
        onLine: true,
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should create PhotoData with all fields', async () => {
      const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });

      const result = await photoService.capturePhoto(
        file,
        'BEFORE',
        'intervention-123'
      );

      expect(result.file).toBe(file);
      expect(result.type).toBe('BEFORE');
      expect(result.interventionId).toBe('intervention-123');
      expect(result.takenAt).toBeInstanceOf(Date);
      expect(result.latitude).toBe(47.4784);
      expect(result.longitude).toBe(-0.5632);
    });
  });

  describe('uploadPhoto', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', { onLine: true });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should upload photo to the API', async () => {
      const photoData: PhotoData = {
        file: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        type: 'BEFORE',
        interventionId: 'intervention-123',
        takenAt: new Date('2026-02-03T10:00:00Z'),
        latitude: 47.4784,
        longitude: -0.5632,
      };

      const result = await photoService.uploadPhoto(photoData);

      expect(mockPost).toHaveBeenCalledWith(
        '/interventions/intervention-123/photos',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      expect(result.id).toBe('photo-123');
      expect(result.url).toBe('https://example.com/photo.jpg');
    });
  });

  describe('uploadOrQueue', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', { onLine: true });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should upload directly when online', async () => {
      const photoData: PhotoData = {
        file: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        type: 'DURING',
        interventionId: 'intervention-123',
        takenAt: new Date(),
      };

      await photoService.uploadOrQueue(photoData);

      expect(mockPost).toHaveBeenCalled();
      const queueCount = await db.photoQueue.count();
      expect(queueCount).toBe(0);
    });

    it('should queue when offline', async () => {
      vi.stubGlobal('navigator', { onLine: false });

      const photoData: PhotoData = {
        file: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        type: 'AFTER',
        interventionId: 'intervention-456',
        takenAt: new Date(),
      };

      await photoService.uploadOrQueue(photoData);

      const queueCount = await db.photoQueue.count();
      expect(queueCount).toBe(1);

      const queued = await db.photoQueue.toArray();
      expect(queued[0].interventionId).toBe('intervention-456');
      expect(queued[0].type).toBe('AFTER');
      expect(queued[0].status).toBe('pending');
    });

    it('should queue when upload fails', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      const photoData: PhotoData = {
        file: new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
        type: 'BEFORE',
        interventionId: 'intervention-789',
        takenAt: new Date(),
      };

      await photoService.uploadOrQueue(photoData);

      const queueCount = await db.photoQueue.count();
      expect(queueCount).toBe(1);
    });
  });

  describe('syncOfflineQueue', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        configurable: true,
        writable: true,
      });
    });

    it('should not sync when offline', async () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
        writable: true,
      });

      const result = await photoService.syncOfflineQueue();

      expect(result).toEqual({ success: 0, failed: 0 });
    });

    it('should return empty results when queue is empty', async () => {
      const result = await photoService.syncOfflineQueue();

      expect(result).toEqual({ success: 0, failed: 0 });
    });
  });

  describe('getQueueStats', () => {
    it('should return correct queue statistics', async () => {
      await db.photoQueue.bulkAdd([
        {
          interventionId: 'int-1',
          type: 'BEFORE',
          takenAt: new Date().toISOString(),
          blob: new Blob(['test']),
          mimeType: 'image/jpeg',
          originalSize: 1000,
          compressedSize: 500,
          attempts: 0,
          status: 'pending',
        },
        {
          interventionId: 'int-2',
          type: 'DURING',
          takenAt: new Date().toISOString(),
          blob: new Blob(['test']),
          mimeType: 'image/jpeg',
          originalSize: 1000,
          compressedSize: 500,
          attempts: 1,
          status: 'failed',
        },
        {
          interventionId: 'int-3',
          type: 'AFTER',
          takenAt: new Date().toISOString(),
          blob: new Blob(['test']),
          mimeType: 'image/jpeg',
          originalSize: 1000,
          compressedSize: 500,
          attempts: 0,
          status: 'uploading',
        },
      ]);

      const stats = await photoService.getQueueStats();

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.uploading).toBe(1);
    });
  });

  describe('clearFailedPhotos', () => {
    it('should remove only failed photos from queue', async () => {
      await db.photoQueue.bulkAdd([
        {
          interventionId: 'int-1',
          type: 'BEFORE',
          takenAt: new Date().toISOString(),
          blob: new Blob(['test']),
          mimeType: 'image/jpeg',
          originalSize: 1000,
          compressedSize: 500,
          attempts: 0,
          status: 'pending',
        },
        {
          interventionId: 'int-2',
          type: 'DURING',
          takenAt: new Date().toISOString(),
          blob: new Blob(['test']),
          mimeType: 'image/jpeg',
          originalSize: 1000,
          compressedSize: 500,
          attempts: 3,
          status: 'failed',
        },
      ]);

      await photoService.clearFailedPhotos();

      const remaining = await db.photoQueue.toArray();
      expect(remaining.length).toBe(1);
      expect(remaining[0].status).toBe('pending');
    });
  });
});
