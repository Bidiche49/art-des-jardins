import Dexie, { Table } from 'dexie';

export interface CachedClient {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  type: 'particulier' | 'professionnel' | 'syndic';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt: number;
}

export interface CachedChantier {
  id: string;
  clientId: string;
  nom: string;
  adresse: string;
  description?: string;
  statut: 'prospect' | 'devis_envoye' | 'en_cours' | 'termine' | 'annule';
  dateDebut?: string;
  dateFin?: string;
  montantTotal?: number;
  createdAt: string;
  updatedAt: string;
  syncedAt: number;
}

export interface CachedIntervention {
  id: string;
  chantierId: string;
  type: 'taille' | 'elagage' | 'entretien' | 'creation' | 'autre';
  description?: string;
  date: string;
  dureeMinutes?: number;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  syncedAt: number;
}

export interface CachedDevis {
  id: string;
  numero: string;
  clientId: string;
  chantierId?: string;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  montantHT: number;
  montantTTC: number;
  validiteJours: number;
  dateCreation: string;
  syncedAt: number;
}

export interface CachedFacture {
  id: string;
  numero: string;
  clientId: string;
  chantierId?: string;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'annulee';
  montantHT: number;
  montantTTC: number;
  dateEmission: string;
  dateEcheance: string;
  syncedAt: number;
}

export interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  entity: 'client' | 'chantier' | 'intervention' | 'devis' | 'facture';
  entityId?: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  lastError?: string;
  status: 'pending' | 'syncing' | 'failed';
}

export interface SyncMeta {
  id: string;
  entity: string;
  lastSyncAt: number;
  lastSyncSuccess: boolean;
}

export type PhotoType = 'BEFORE' | 'DURING' | 'AFTER';

export interface QueuedPhoto {
  id?: number;
  interventionId: string;
  type: PhotoType;
  latitude?: number;
  longitude?: number;
  takenAt: string;
  blob: Blob;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  attempts: number;
  lastAttempt?: string;
  status: 'pending' | 'uploading' | 'failed';
  lastError?: string;
}

export class AppDatabase extends Dexie {
  clients!: Table<CachedClient, string>;
  chantiers!: Table<CachedChantier, string>;
  interventions!: Table<CachedIntervention, string>;
  devis!: Table<CachedDevis, string>;
  factures!: Table<CachedFacture, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  syncMeta!: Table<SyncMeta, string>;
  photoQueue!: Table<QueuedPhoto, number>;

  constructor() {
    super('ArtJardinDB');

    this.version(1).stores({
      clients: 'id, nom, email, type, syncedAt',
      chantiers: 'id, clientId, nom, statut, syncedAt',
      interventions: 'id, chantierId, date, statut, syncedAt',
      devis: 'id, numero, clientId, chantierId, statut, syncedAt',
      factures: 'id, numero, clientId, statut, syncedAt',
      syncQueue: '++id, operation, entity, entityId, status, timestamp',
      syncMeta: 'id, entity, lastSyncAt',
    });

    this.version(2).stores({
      clients: 'id, nom, email, type, syncedAt',
      chantiers: 'id, clientId, nom, statut, syncedAt',
      interventions: 'id, chantierId, date, statut, syncedAt',
      devis: 'id, numero, clientId, chantierId, statut, syncedAt',
      factures: 'id, numero, clientId, statut, syncedAt',
      syncQueue: '++id, operation, entity, entityId, status, timestamp',
      syncMeta: 'id, entity, lastSyncAt',
      photoQueue: '++id, interventionId, type, status, takenAt',
    });
  }
}

export const db = new AppDatabase();
