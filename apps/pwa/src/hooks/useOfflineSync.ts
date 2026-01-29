import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/ui';

interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: unknown;
  timestamp: number;
}

const STORAGE_KEY = 'pending-sync-operations';

function getStoredOperations(): PendingOperation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredOperations(operations: PendingOperation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
}

export function useOfflineSync() {
  const { isOnline, setPendingSyncCount, decrementPendingSync } = useUIStore();

  useEffect(() => {
    const operations = getStoredOperations();
    setPendingSyncCount(operations.length);
  }, [setPendingSyncCount]);

  const addPendingOperation = useCallback(
    (operation: Omit<PendingOperation, 'id' | 'timestamp'>) => {
      const operations = getStoredOperations();
      const newOperation: PendingOperation = {
        ...operation,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      setStoredOperations([...operations, newOperation]);
      setPendingSyncCount(operations.length + 1);
    },
    [setPendingSyncCount]
  );

  const syncPendingOperations = useCallback(async () => {
    if (!isOnline) return;

    const operations = getStoredOperations();
    if (operations.length === 0) return;

    for (const operation of operations) {
      try {
        const response = await fetch(`/api/v1/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(operation),
        });

        if (response.ok) {
          const remaining = getStoredOperations().filter(
            (op) => op.id !== operation.id
          );
          setStoredOperations(remaining);
          decrementPendingSync();
        }
      } catch (error) {
        console.error('Sync error:', error);
        break;
      }
    }
  }, [isOnline, decrementPendingSync]);

  useEffect(() => {
    if (isOnline) {
      syncPendingOperations();
    }
  }, [isOnline, syncPendingOperations]);

  return {
    addPendingOperation,
    syncPendingOperations,
    hasPendingOperations: getStoredOperations().length > 0,
  };
}
