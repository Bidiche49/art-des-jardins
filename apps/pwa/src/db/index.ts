import Dexie, { Table } from 'dexie';

// Types for offline storage
interface OfflineClient {
  id: string;
  type: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  syncedAt?: Date;
  pendingSync?: boolean;
}

interface OfflineChantier {
  id: string;
  clientId: string;
  adresse: string;
  ville: string;
  typePrestation: string[];
  description: string;
  statut: string;
  syncedAt?: Date;
  pendingSync?: boolean;
}

interface SyncQueue {
  id?: number;
  type: 'create' | 'update' | 'delete';
  entity: 'client' | 'chantier' | 'intervention';
  entityId: string;
  data: unknown;
  createdAt: Date;
  retries: number;
}

class ArtJardinDB extends Dexie {
  clients!: Table<OfflineClient>;
  chantiers!: Table<OfflineChantier>;
  syncQueue!: Table<SyncQueue>;

  constructor() {
    super('ArtJardinDB');

    this.version(1).stores({
      clients: 'id, type, ville, pendingSync',
      chantiers: 'id, clientId, statut, pendingSync',
      syncQueue: '++id, type, entity, entityId, createdAt',
    });
  }
}

export const db = new ArtJardinDB();

// Sync utilities
export async function addToSyncQueue(
  type: SyncQueue['type'],
  entity: SyncQueue['entity'],
  entityId: string,
  data: unknown
) {
  await db.syncQueue.add({
    type,
    entity,
    entityId,
    data,
    createdAt: new Date(),
    retries: 0,
  });
}

export async function processSyncQueue() {
  const items = await db.syncQueue.orderBy('createdAt').toArray();

  for (const item of items) {
    try {
      // TODO: Send to API
      console.log('Syncing:', item);

      // Remove from queue on success
      await db.syncQueue.delete(item.id!);
    } catch (error) {
      // Increment retry count
      await db.syncQueue.update(item.id!, { retries: item.retries + 1 });
      console.error('Sync failed:', error);
    }
  }
}
