import { useCallback } from 'react';
import { useConflictStore } from '../../stores/conflicts';
import { applyConflictResolution } from '../../services/conflict.service';
import { syncService } from '../../db/sync';
import { db } from '../../db/schema';
import { ConflictModal } from './ConflictModal';
import type { SyncConflict, ConflictResolution } from '../../types/sync.types';

/**
 * ConflictQueue - Composant global qui gere la file d'attente des conflits de sync.
 * Ecoute le store de conflits et affiche les modals de resolution.
 * Doit etre monte une seule fois au niveau App.
 */
export function ConflictQueue() {
  const conflicts = useConflictStore((state) => state.conflicts);
  const resolveConflict = useConflictStore((state) => state.resolveConflict);

  // Le premier conflit dans la queue est affiche
  const currentConflict = conflicts[0] ?? null;

  const handleResolve = useCallback(
    async (resolution: ConflictResolution, mergedData?: Record<string, unknown>) => {
      if (!currentConflict) return;

      // 1. Appliquer la resolution et obtenir les donnees finales
      const resolvedData = applyConflictResolution(
        currentConflict,
        resolution,
        mergedData
      );

      // 2. Mettre a jour la donnee locale dans IndexedDB
      await updateLocalEntity(currentConflict, resolvedData);

      // 3. Mettre a jour le queue item pour qu'il soit re-synce avec la bonne version
      await updateSyncQueueItem(currentConflict, resolvedData);

      // 4. Marquer le conflit comme resolu dans le store
      resolveConflict(currentConflict.id, resolution, mergedData);

      // 5. Reprendre la sync apres un court delai
      setTimeout(() => {
        syncService.syncAll();
      }, 500);
    },
    [currentConflict, resolveConflict]
  );

  // Pas de conflits, ne rien afficher
  if (!currentConflict) {
    return null;
  }

  return (
    <ConflictModal
      conflict={currentConflict}
      onResolve={handleResolve}
      onCancel={() => {
        // Ne pas annuler - on doit resoudre le conflit
        // Optionnel: on pourrait reporter le conflit a plus tard
      }}
    />
  );
}

/**
 * Met a jour l'entite locale dans IndexedDB avec les donnees resolues.
 */
async function updateLocalEntity(
  conflict: SyncConflict,
  resolvedData: Record<string, unknown>
): Promise<void> {
  const { entityType, entityId } = conflict;

  switch (entityType) {
    case 'client':
      await db.clients.update(entityId, resolvedData);
      break;
    case 'chantier':
      await db.chantiers.update(entityId, resolvedData);
      break;
    case 'intervention':
      await db.interventions.update(entityId, resolvedData);
      break;
    case 'devis':
      await db.devis.update(entityId, resolvedData);
      break;
  }
}

/**
 * Met a jour l'item dans la sync queue avec les donnees resolues.
 */
async function updateSyncQueueItem(
  conflict: SyncConflict,
  resolvedData: Record<string, unknown>
): Promise<void> {
  const { entityType, entityId } = conflict;

  // Trouver l'item en attente pour cette entite
  // Note: pas d'index compound, donc on filtre par entity puis entityId
  const queueItems = await db.syncQueue
    .where('entity')
    .equals(entityType)
    .filter((item) => item.entityId === entityId)
    .toArray();

  const queueItem = queueItems[0];
  if (queueItem && queueItem.id !== undefined) {
    await db.syncQueue.update(queueItem.id, {
      data: resolvedData,
      status: 'pending',
      retryCount: 0,
    });
  }
}

export default ConflictQueue;
