import imageCompression from 'browser-image-compression';
import { db, type PhotoType, type QueuedPhoto } from '@/db/schema';
import apiClient from '@/api/client';

export interface PhotoData {
  file: File;
  type: PhotoType;
  latitude?: number;
  longitude?: number;
  takenAt: Date;
  interventionId: string;
}

export interface CompressedPhotoData {
  blob: Blob;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
}

export interface PhotoUploadResponse {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
  initialQuality: 0.8,
};

const MAX_RETRY_ATTEMPTS = 3;

class PhotoService {
  private syncListenerRegistered = false;

  async compressImage(file: File): Promise<CompressedPhotoData> {
    const originalSize = file.size;

    try {
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

      return {
        blob: compressedFile,
        mimeType: compressedFile.type || 'image/jpeg',
        originalSize,
        compressedSize: compressedFile.size,
      };
    } catch (error) {
      console.error('Compression failed, using original file:', error);
      return {
        blob: file,
        mimeType: file.type || 'image/jpeg',
        originalSize,
        compressedSize: file.size,
      };
    }
  }

  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  async capturePhoto(
    file: File,
    type: PhotoType,
    interventionId: string
  ): Promise<PhotoData> {
    const position = await this.getCurrentPosition();

    return {
      file,
      type,
      interventionId,
      takenAt: new Date(),
      latitude: position?.lat,
      longitude: position?.lng,
    };
  }

  async uploadPhoto(photoData: PhotoData): Promise<PhotoUploadResponse> {
    const compressed = await this.compressImage(photoData.file);

    const formData = new FormData();
    formData.append('file', compressed.blob, 'photo.jpg');
    formData.append('type', photoData.type);
    if (photoData.latitude !== undefined) {
      formData.append('latitude', String(photoData.latitude));
    }
    if (photoData.longitude !== undefined) {
      formData.append('longitude', String(photoData.longitude));
    }
    formData.append('takenAt', photoData.takenAt.toISOString());

    const response = await apiClient.post<PhotoUploadResponse>(
      `/interventions/${photoData.interventionId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async uploadOrQueue(photoData: PhotoData): Promise<void> {
    const compressed = await this.compressImage(photoData.file);

    if (navigator.onLine) {
      try {
        await this.uploadPhoto(photoData);
        return;
      } catch (error) {
        console.warn('Upload failed, queueing for later:', error);
      }
    }

    await this.addToQueue(photoData, compressed);
    this.registerOnlineListener();
  }

  private async addToQueue(
    photoData: PhotoData,
    compressed: CompressedPhotoData
  ): Promise<number> {
    const queuedPhoto: Omit<QueuedPhoto, 'id'> = {
      interventionId: photoData.interventionId,
      type: photoData.type,
      latitude: photoData.latitude,
      longitude: photoData.longitude,
      takenAt: photoData.takenAt.toISOString(),
      blob: compressed.blob,
      mimeType: compressed.mimeType,
      originalSize: compressed.originalSize,
      compressedSize: compressed.compressedSize,
      attempts: 0,
      status: 'pending',
    };

    return db.photoQueue.add(queuedPhoto as QueuedPhoto);
  }

  async syncOfflineQueue(): Promise<{ success: number; failed: number }> {
    if (!navigator.onLine) {
      return { success: 0, failed: 0 };
    }

    const queue = await db.photoQueue
      .where('status')
      .anyOf(['pending', 'failed'])
      .toArray();

    let success = 0;
    let failed = 0;

    for (const photo of queue) {
      if (photo.attempts >= MAX_RETRY_ATTEMPTS) {
        continue;
      }

      try {
        await db.photoQueue.update(photo.id!, {
          status: 'uploading',
          attempts: photo.attempts + 1,
          lastAttempt: new Date().toISOString(),
        });

        const formData = new FormData();
        formData.append('file', photo.blob, 'photo.jpg');
        formData.append('type', photo.type);
        if (photo.latitude !== undefined) {
          formData.append('latitude', String(photo.latitude));
        }
        if (photo.longitude !== undefined) {
          formData.append('longitude', String(photo.longitude));
        }
        formData.append('takenAt', photo.takenAt);

        await apiClient.post(
          `/interventions/${photo.interventionId}/photos`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        await db.photoQueue.delete(photo.id!);
        success++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await db.photoQueue.update(photo.id!, {
          status: 'failed',
          lastError: errorMessage,
        });
        failed++;
      }
    }

    return { success, failed };
  }

  async getQueueStats(): Promise<{
    total: number;
    pending: number;
    failed: number;
    uploading: number;
  }> {
    const all = await db.photoQueue.toArray();
    return {
      total: all.length,
      pending: all.filter((p) => p.status === 'pending').length,
      failed: all.filter((p) => p.status === 'failed').length,
      uploading: all.filter((p) => p.status === 'uploading').length,
    };
  }

  async clearFailedPhotos(): Promise<void> {
    await db.photoQueue.where('status').equals('failed').delete();
  }

  async retryFailedPhotos(): Promise<void> {
    await db.photoQueue
      .where('status')
      .equals('failed')
      .modify({ status: 'pending', attempts: 0 });

    await this.syncOfflineQueue();
  }

  private registerOnlineListener(): void {
    if (this.syncListenerRegistered) {
      return;
    }

    window.addEventListener('online', () => {
      this.syncOfflineQueue();
    });

    this.syncListenerRegistered = true;
  }
}

export const photoService = new PhotoService();
