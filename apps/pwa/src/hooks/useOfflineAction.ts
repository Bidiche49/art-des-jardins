import { useCallback, useState } from 'react';
import { useUIStore } from '@/stores/ui';
import { syncService } from '@/db';

interface OfflineActionOptions<T> {
  onlineAction: () => Promise<T>;
  offlineAction: () => Promise<T>;
  entity: 'client' | 'chantier' | 'intervention' | 'devis' | 'facture';
  operation: 'create' | 'update' | 'delete';
  entityId?: string;
  data?: unknown;
}

interface OfflineActionResult<T> {
  data: T | null;
  isOffline: boolean;
  error: Error | null;
}

export function useOfflineAction<T>() {
  const { isOnline, addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (options: OfflineActionOptions<T>): Promise<OfflineActionResult<T>> => {
      setIsLoading(true);
      setError(null);

      try {
        if (isOnline) {
          try {
            const result = await options.onlineAction();
            return { data: result, isOffline: false, error: null };
          } catch (onlineError) {
            console.warn('Online action failed, falling back to offline:', onlineError);
          }
        }

        const result = await options.offlineAction();

        if (options.data) {
          await syncService.addToQueue(
            options.operation,
            options.entity,
            options.data,
            options.entityId
          );

          addNotification({
            type: 'info',
            message: 'Action enregistree - sera synchronisee au retour de la connexion',
          });
        }

        return { data: result, isOffline: true, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);

        addNotification({
          type: 'error',
          message: `Erreur: ${error.message}`,
        });

        return { data: null, isOffline: !isOnline, error };
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, addNotification]
  );

  return { execute, isLoading, error, isOnline };
}

export function useOfflineMutation<TData, TVariables>(
  entity: 'client' | 'chantier' | 'intervention' | 'devis' | 'facture',
  operation: 'create' | 'update' | 'delete',
  mutationFn: (variables: TVariables) => Promise<TData>,
  offlineFn: (variables: TVariables) => Promise<TData>
) {
  const { isOnline, addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables, entityId?: string): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        if (isOnline) {
          try {
            const result = await mutationFn(variables);
            setData(result);
            return result;
          } catch (onlineError) {
            console.warn('Mutation failed, falling back to offline:', onlineError);
          }
        }

        const result = await offlineFn(variables);
        setData(result);

        await syncService.addToQueue(operation, entity, variables, entityId);

        addNotification({
          type: 'info',
          message: 'Modification enregistree hors ligne',
        });

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        addNotification({
          type: 'error',
          message: `Erreur: ${error.message}`,
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, entity, operation, mutationFn, offlineFn, addNotification]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { mutate, isLoading, data, error, reset, isOnline };
}
