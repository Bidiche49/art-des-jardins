import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConflictStore } from '../../stores/conflicts';
import { applyConflictResolution } from '../../services/conflict.service';
import { syncService } from '../../db/sync';
import { db } from '../../db/schema';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ConflictModalContent } from './ConflictModal';
import type { SyncConflict, ConflictResolution } from '../../types/sync.types';

/**
 * ConflictQueue - Composant global qui gere la file d'attente des conflits de sync.
 * Affiche l'indicateur de progression, la navigation, et les options de resolution en masse.
 * Doit etre monte une seule fois au niveau App.
 */
export function ConflictQueue() {
  const conflicts = useConflictStore((state) => state.conflicts);
  const currentIndex = useConflictStore((state) => state.currentIndex);
  const sessionPreference = useConflictStore((state) => state.sessionPreference);
  const resolveConflict = useConflictStore((state) => state.resolveConflict);
  const resolveAll = useConflictStore((state) => state.resolveAll);
  const nextConflict = useConflictStore((state) => state.nextConflict);
  const prevConflict = useConflictStore((state) => state.prevConflict);
  const setSessionPreference = useConflictStore((state) => state.setSessionPreference);

  const [applyToAll, setApplyToAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentConflict = conflicts[currentIndex] ?? null;
  const totalConflicts = conflicts.length;
  const hasMultipleConflicts = totalConflicts > 1;
  const canGoNext = currentIndex < totalConflicts - 1;
  const canGoPrev = currentIndex > 0;

  // Auto-resolution basee sur la preference de session
  useEffect(() => {
    if (!currentConflict || !sessionPreference || isProcessing) return;

    const resolution: ConflictResolution =
      sessionPreference === 'always_local' ? 'keep_local' : 'keep_server';

    setIsProcessing(true);
    handleResolve(resolution).finally(() => {
      setIsProcessing(false);
    });
  }, [currentConflict?.id, sessionPreference]);

  const handleResolve = useCallback(
    async (resolution: ConflictResolution, mergedData?: Record<string, unknown>) => {
      if (!currentConflict) return;

      // Si "Appliquer a tous" est coche, on resout tous les conflits restants
      if (applyToAll && resolution !== 'merge') {
        await resolveAllConflicts(resolution);
        setApplyToAll(false);
        return;
      }

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
    [currentConflict, resolveConflict, applyToAll]
  );

  const resolveAllConflicts = async (resolution: ConflictResolution) => {
    const remainingConflicts = conflicts.slice(currentIndex);

    for (const conflict of remainingConflicts) {
      const resolvedData = applyConflictResolution(conflict, resolution);
      await updateLocalEntity(conflict, resolvedData);
      await updateSyncQueueItem(conflict, resolvedData);
    }

    resolveAll(resolution);

    setTimeout(() => {
      syncService.syncAll();
    }, 500);
  };

  const handleSetAlwaysLocal = () => {
    setSessionPreference('always_local');
  };

  const handleSetAlwaysServer = () => {
    setSessionPreference('always_server');
  };

  // Pas de conflits, ne rien afficher
  if (!currentConflict) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        // Ne pas permettre de fermer - on doit resoudre le conflit
      }}
      showCloseButton={false}
      size="lg"
    >
      {/* Header avec indicateur de progression */}
      {hasMultipleConflicts && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevConflict}
            disabled={!canGoPrev}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Precedent
          </Button>

          <span className="text-sm font-medium text-gray-600">
            Conflit {currentIndex + 1} / {totalConflicts}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextConflict}
            disabled={!canGoNext}
            className="flex items-center gap-1"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Contenu du conflit */}
      <ConflictModalContent
        conflict={currentConflict}
        onResolve={handleResolve}
      />

      {/* Options supplementaires pour conflits multiples */}
      {hasMultipleConflicts && (
        <div className="mt-4 pt-3 border-t space-y-3">
          {/* Checkbox Appliquer a tous */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">
              Appliquer ce choix aux {totalConflicts - currentIndex - 1} conflits restants
            </span>
          </label>

          {/* Preference de session */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Pour cette session :</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetAlwaysLocal}
              className="text-xs"
            >
              Toujours garder ma version
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetAlwaysServer}
              className="text-xs"
            >
              Toujours garder serveur
            </Button>
          </div>
        </div>
      )}
    </Modal>
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
