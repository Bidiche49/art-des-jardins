import { db, SyncQueueItem } from './schema';
import { useUIStore } from '@/stores/ui';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class SyncService {
  private isSyncing = false;
  private maxRetries = 3;
  private retryDelayMs = 1000;

  async addToQueue(
    operation: SyncQueueItem['operation'],
    entity: SyncQueueItem['entity'],
    data: unknown,
    entityId?: string
  ): Promise<number> {
    const id = await db.syncQueue.add({
      operation,
      entity,
      entityId,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    });

    this.updatePendingCount();
    return id;
  }

  async getPendingCount(): Promise<number> {
    return db.syncQueue.where('status').equals('pending').count();
  }

  async getFailedCount(): Promise<number> {
    return db.syncQueue.where('status').equals('failed').count();
  }

  async updatePendingCount(): Promise<void> {
    const count = await this.getPendingCount();
    useUIStore.getState().setPendingSyncCount(count);
  }

  async getLastSync(entity: string): Promise<number | null> {
    const meta = await db.syncMeta.get(entity);
    return meta?.lastSyncAt ?? null;
  }

  async setLastSync(entity: string, success: boolean): Promise<void> {
    await db.syncMeta.put({
      id: entity,
      entity,
      lastSyncAt: Date.now(),
      lastSyncSuccess: success,
    });
  }

  async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, synced: 0, failed: 0, errors: ['Sync already in progress'] };
    }

    if (!navigator.onLine) {
      return { success: false, synced: 0, failed: 0, errors: ['No network connection'] };
    }

    this.isSyncing = true;
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

    try {
      const pendingItems = await db.syncQueue
        .where('status')
        .equals('pending')
        .sortBy('timestamp');

      for (const item of pendingItems) {
        const itemResult = await this.syncItem(item);
        if (itemResult.success) {
          result.synced++;
        } else {
          result.failed++;
          if (itemResult.error) {
            result.errors.push(itemResult.error);
          }
        }
      }

      result.success = result.failed === 0;
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isSyncing = false;
      await this.updatePendingCount();
    }

    return result;
  }

  private async syncItem(item: SyncQueueItem): Promise<{ success: boolean; error?: string }> {
    if (item.id === undefined) {
      return { success: false, error: 'Item has no ID' };
    }

    await db.syncQueue.update(item.id, { status: 'syncing' });

    try {
      const endpoint = this.getEndpoint(item);
      const method = this.getMethod(item.operation);

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: item.operation !== 'delete' ? JSON.stringify(item.data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      await db.syncQueue.delete(item.id);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const newRetryCount = item.retryCount + 1;

      if (newRetryCount >= this.maxRetries) {
        await db.syncQueue.update(item.id, {
          status: 'failed',
          retryCount: newRetryCount,
          lastError: errorMessage,
        });
      } else {
        await db.syncQueue.update(item.id, {
          status: 'pending',
          retryCount: newRetryCount,
          lastError: errorMessage,
        });

        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelayMs * Math.pow(2, newRetryCount))
        );
      }

      return { success: false, error: errorMessage };
    }
  }

  private getEndpoint(item: SyncQueueItem): string {
    const baseEndpoints: Record<SyncQueueItem['entity'], string> = {
      client: '/clients',
      chantier: '/chantiers',
      intervention: '/interventions',
      devis: '/devis',
      facture: '/factures',
    };

    const base = baseEndpoints[item.entity];

    if (item.operation === 'create') {
      return base;
    }

    return `${base}/${item.entityId}`;
  }

  private getMethod(operation: SyncQueueItem['operation']): string {
    switch (operation) {
      case 'create':
        return 'POST';
      case 'update':
        return 'PUT';
      case 'delete':
        return 'DELETE';
    }
  }

  async retryFailed(): Promise<SyncResult> {
    const failedItems = await db.syncQueue.where('status').equals('failed').toArray();

    for (const item of failedItems) {
      if (item.id !== undefined) {
        await db.syncQueue.update(item.id, {
          status: 'pending',
          retryCount: 0,
          lastError: undefined,
        });
      }
    }

    return this.syncAll();
  }

  async clearQueue(): Promise<void> {
    await db.syncQueue.clear();
    await this.updatePendingCount();
  }

  async clearFailed(): Promise<void> {
    await db.syncQueue.where('status').equals('failed').delete();
    await this.updatePendingCount();
  }
}

export const syncService = new SyncService();

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncService.syncAll();
  });
}
