import { db, CachedClient, CachedChantier, CachedIntervention } from './schema';
import { syncService } from './sync';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : `${window.location.origin}`);

interface FetchOptions extends RequestInit {
  cacheKey?: string;
}

class OfflineApi {
  private async fetchWithFallback<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T | null> {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.warn('API fetch failed, falling back to cache:', error);
      }
    }

    return null;
  }

  async getClients(): Promise<CachedClient[]> {
    const online = await this.fetchWithFallback<{ data: CachedClient[] }>('/clients');

    if (online?.data) {
      const now = Date.now();
      await db.clients.bulkPut(
        online.data.map((c) => ({ ...c, syncedAt: now }))
      );
      await syncService.setLastSync('clients', true);
      return online.data;
    }

    return db.clients.toArray();
  }

  async getClient(id: string): Promise<CachedClient | null> {
    const online = await this.fetchWithFallback<CachedClient>(`/clients/${id}`);

    if (online) {
      await db.clients.put({ ...online, syncedAt: Date.now() });
      return online;
    }

    const cached = await db.clients.get(id);
    return cached ?? null;
  }

  async createClient(data: Omit<CachedClient, 'id' | 'syncedAt' | 'createdAt' | 'updatedAt'>): Promise<CachedClient | null> {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_BASE}/clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const created = await response.json();
          await db.clients.put({ ...created, syncedAt: Date.now() });
          return created;
        }
      } catch (error) {
        console.warn('Create client failed, queuing for sync:', error);
      }
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempClient: CachedClient = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedAt: 0,
    } as CachedClient;

    await db.clients.put(tempClient);
    await syncService.addToQueue('create', 'client', data, tempId);

    return tempClient;
  }

  async updateClient(id: string, data: Partial<CachedClient>): Promise<CachedClient | null> {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_BASE}/clients/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updated = await response.json();
          await db.clients.put({ ...updated, syncedAt: Date.now() });
          return updated;
        }
      } catch (error) {
        console.warn('Update client failed, queuing for sync:', error);
      }
    }

    await db.clients.update(id, { ...data, syncedAt: 0 });
    await syncService.addToQueue('update', 'client', data, id);

    const updated = await db.clients.get(id);
    return updated ?? null;
  }

  async getChantiers(clientId?: string): Promise<CachedChantier[]> {
    const endpoint = clientId ? `/chantiers?clientId=${clientId}` : '/chantiers';
    const online = await this.fetchWithFallback<{ data: CachedChantier[] }>(endpoint);

    if (online?.data) {
      const now = Date.now();
      await db.chantiers.bulkPut(
        online.data.map((c) => ({ ...c, syncedAt: now }))
      );
      await syncService.setLastSync('chantiers', true);
      return online.data;
    }

    if (clientId) {
      return db.chantiers.where('clientId').equals(clientId).toArray();
    }

    return db.chantiers.toArray();
  }

  async getChantier(id: string): Promise<CachedChantier | null> {
    const online = await this.fetchWithFallback<CachedChantier>(`/chantiers/${id}`);

    if (online) {
      await db.chantiers.put({ ...online, syncedAt: Date.now() });
      return online;
    }

    const cached = await db.chantiers.get(id);
    return cached ?? null;
  }

  async getInterventions(chantierId?: string): Promise<CachedIntervention[]> {
    const endpoint = chantierId
      ? `/interventions?chantierId=${chantierId}`
      : '/interventions';
    const online = await this.fetchWithFallback<{ data: CachedIntervention[] }>(endpoint);

    if (online?.data) {
      const now = Date.now();
      await db.interventions.bulkPut(
        online.data.map((i) => ({ ...i, syncedAt: now }))
      );
      await syncService.setLastSync('interventions', true);
      return online.data;
    }

    if (chantierId) {
      return db.interventions.where('chantierId').equals(chantierId).toArray();
    }

    return db.interventions.toArray();
  }

  async getIntervention(id: string): Promise<CachedIntervention | null> {
    const online = await this.fetchWithFallback<CachedIntervention>(`/interventions/${id}`);

    if (online) {
      await db.interventions.put({ ...online, syncedAt: Date.now() });
      return online;
    }

    const cached = await db.interventions.get(id);
    return cached ?? null;
  }

  async createIntervention(
    data: Omit<CachedIntervention, 'id' | 'syncedAt' | 'createdAt' | 'updatedAt'>
  ): Promise<CachedIntervention | null> {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_BASE}/interventions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const created = await response.json();
          await db.interventions.put({ ...created, syncedAt: Date.now() });
          return created;
        }
      } catch (error) {
        console.warn('Create intervention failed, queuing for sync:', error);
      }
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempIntervention: CachedIntervention = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedAt: 0,
    } as CachedIntervention;

    await db.interventions.put(tempIntervention);
    await syncService.addToQueue('create', 'intervention', data, tempId);

    return tempIntervention;
  }

  async updateIntervention(
    id: string,
    data: Partial<CachedIntervention>
  ): Promise<CachedIntervention | null> {
    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_BASE}/interventions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updated = await response.json();
          await db.interventions.put({ ...updated, syncedAt: Date.now() });
          return updated;
        }
      } catch (error) {
        console.warn('Update intervention failed, queuing for sync:', error);
      }
    }

    await db.interventions.update(id, { ...data, syncedAt: 0 });
    await syncService.addToQueue('update', 'intervention', data, id);

    const updated = await db.interventions.get(id);
    return updated ?? null;
  }

  async syncInitialData(): Promise<void> {
    if (!navigator.onLine) return;

    await Promise.all([
      this.getClients(),
      this.getChantiers(),
      this.getInterventions(),
    ]);
  }
}

export const offlineApi = new OfflineApi();
