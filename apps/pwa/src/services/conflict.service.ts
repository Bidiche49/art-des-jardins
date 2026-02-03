import type { SyncConflict } from '../types/sync.types';
import { useConflictStore } from '../stores/conflicts';

type EntityType = 'client' | 'chantier' | 'intervention' | 'devis';

interface VersionedEntity {
  version?: number;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

/**
 * Verifie s'il y a un conflit entre la version locale et serveur.
 * Un conflit existe si:
 * - La version serveur est superieure a la locale
 * - ET les timestamps sont differents (modifications independantes)
 */
export function hasConflict(
  local: VersionedEntity,
  server: VersionedEntity
): boolean {
  const localVersion = local.version ?? 0;
  const serverVersion = server.version ?? 0;

  // Pas de conflit si la version locale est egale ou superieure
  if (localVersion >= serverVersion) {
    return false;
  }

  // Conflit si version serveur > locale ET timestamps differents
  const localTime = local.updatedAt
    ? new Date(local.updatedAt).getTime()
    : 0;
  const serverTime = server.updatedAt
    ? new Date(server.updatedAt).getTime()
    : 0;

  return localTime !== serverTime;
}

/**
 * Identifie les champs qui different entre la version locale et serveur.
 * Exclut les champs techniques (id, version, timestamps).
 */
export function detectConflictingFields(
  local: Record<string, unknown>,
  server: Record<string, unknown>
): string[] {
  const technicalFields = ['id', 'version', 'updatedAt', 'createdAt', 'syncedAt'];
  const allFields = new Set([...Object.keys(local), ...Object.keys(server)]);
  const conflicting: string[] = [];

  for (const field of allFields) {
    if (technicalFields.includes(field)) {
      continue;
    }

    const localValue = JSON.stringify(local[field]);
    const serverValue = JSON.stringify(server[field]);

    if (localValue !== serverValue) {
      conflicting.push(field);
    }
  }

  return conflicting;
}

/**
 * Genere un label lisible pour une entite en conflit.
 */
export function generateEntityLabel(
  entityType: EntityType,
  entity: Record<string, unknown>
): string {
  switch (entityType) {
    case 'client':
      return (entity.nom as string) || `Client #${entity.id}`;
    case 'chantier':
      return (entity.nom as string) || `Chantier #${entity.id}`;
    case 'intervention':
      return entity.date
        ? `Intervention du ${new Date(entity.date as string).toLocaleDateString('fr-FR')}`
        : `Intervention #${entity.id}`;
    case 'devis':
      return (entity.numero as string) || `Devis #${entity.id}`;
    default:
      return `#${entity.id}`;
  }
}

/**
 * Cree un objet SyncConflict complet a partir des versions locale et serveur.
 */
export function createSyncConflict(
  entityType: EntityType,
  entityId: string,
  local: Record<string, unknown>,
  server: Record<string, unknown>
): SyncConflict {
  const conflictingFields = detectConflictingFields(local, server);

  return {
    id: `conflict-${entityType}-${entityId}-${Date.now()}`,
    entityType,
    entityId,
    entityLabel: generateEntityLabel(entityType, local),
    localVersion: local,
    serverVersion: server,
    localTimestamp: local.updatedAt
      ? new Date(local.updatedAt as string)
      : new Date(),
    serverTimestamp: server.updatedAt
      ? new Date(server.updatedAt as string)
      : new Date(),
    conflictingFields,
  };
}

/**
 * Ajoute un conflit detecte au store.
 */
export function addConflictToStore(conflict: SyncConflict): void {
  useConflictStore.getState().addConflict(conflict);
}

/**
 * Verifie et gere un conflit potentiel lors de la sync.
 * Retourne le conflit detecte ou null si pas de conflit.
 */
export function checkAndCreateConflict(
  entityType: EntityType,
  entityId: string,
  local: Record<string, unknown>,
  server: Record<string, unknown>
): SyncConflict | null {
  if (!hasConflict(local, server)) {
    return null;
  }

  const conflict = createSyncConflict(entityType, entityId, local, server);
  addConflictToStore(conflict);
  return conflict;
}

/**
 * Applique une resolution de conflit et retourne les donnees a utiliser.
 */
export function applyConflictResolution(
  conflict: SyncConflict,
  resolution: 'keep_local' | 'keep_server' | 'merge',
  mergedData?: Record<string, unknown>
): Record<string, unknown> {
  switch (resolution) {
    case 'keep_local':
      return {
        ...conflict.localVersion,
        version: (conflict.serverVersion.version as number) + 1,
      };
    case 'keep_server':
      return conflict.serverVersion;
    case 'merge':
      if (!mergedData) {
        throw new Error('mergedData is required for merge resolution');
      }
      return {
        ...mergedData,
        version: (conflict.serverVersion.version as number) + 1,
      };
    default:
      throw new Error(`Unknown resolution: ${resolution}`);
  }
}
