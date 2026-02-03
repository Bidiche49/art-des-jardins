import { create } from 'zustand';
import { db, type QueuedPhoto, type PhotoType } from '@/db/schema';

interface PhotoQueueState {
  queueCount: number;
  isSyncing: boolean;
  lastSyncError: string | null;

  addToQueue: (photo: Omit<QueuedPhoto, 'id' | 'attempts' | 'status'>) => Promise<number>;
  getQueue: () => Promise<QueuedPhoto[]>;
  getQueueByIntervention: (interventionId: string) => Promise<QueuedPhoto[]>;
  removeFromQueue: (id: number) => Promise<void>;
  updateStatus: (id: number, status: QueuedPhoto['status'], error?: string) => Promise<void>;
  incrementAttempts: (id: number) => Promise<void>;
  refreshCount: () => Promise<void>;
  setSyncing: (syncing: boolean) => void;
  setLastSyncError: (error: string | null) => void;
}

export const usePhotoQueueStore = create<PhotoQueueState>((set, get) => ({
  queueCount: 0,
  isSyncing: false,
  lastSyncError: null,

  addToQueue: async (photo) => {
    const queuedPhoto: Omit<QueuedPhoto, 'id'> = {
      ...photo,
      attempts: 0,
      status: 'pending',
    };

    const id = await db.photoQueue.add(queuedPhoto as QueuedPhoto);
    await get().refreshCount();
    return id;
  },

  getQueue: async () => {
    return db.photoQueue.where('status').anyOf(['pending', 'failed']).toArray();
  },

  getQueueByIntervention: async (interventionId: string) => {
    return db.photoQueue.where('interventionId').equals(interventionId).toArray();
  },

  removeFromQueue: async (id: number) => {
    await db.photoQueue.delete(id);
    await get().refreshCount();
  },

  updateStatus: async (id: number, status: QueuedPhoto['status'], error?: string) => {
    const update: Partial<QueuedPhoto> = { status };
    if (error) {
      update.lastError = error;
    }
    await db.photoQueue.update(id, update);
    await get().refreshCount();
  },

  incrementAttempts: async (id: number) => {
    const photo = await db.photoQueue.get(id);
    if (photo) {
      await db.photoQueue.update(id, {
        attempts: photo.attempts + 1,
        lastAttempt: new Date().toISOString(),
      });
    }
  },

  refreshCount: async () => {
    const count = await db.photoQueue.where('status').anyOf(['pending', 'failed']).count();
    set({ queueCount: count });
  },

  setSyncing: (syncing: boolean) => {
    set({ isSyncing: syncing });
  },

  setLastSyncError: (error: string | null) => {
    set({ lastSyncError: error });
  },
}));
