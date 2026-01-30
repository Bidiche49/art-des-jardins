import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui';
import { syncService, db } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface SyncStatusProps {
  showDetails?: boolean;
}

export function SyncStatus({ showDetails = false }: SyncStatusProps) {
  const { isOnline, pendingSyncCount } = useUIStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const failedItems = useLiveQuery(
    () => db.syncQueue.where('status').equals('failed').count(),
    []
  );

  useEffect(() => {
    const loadLastSync = async () => {
      const clientSync = await syncService.getLastSync('clients');
      if (clientSync) {
        setLastSyncTime(new Date(clientSync));
      }
    };
    loadLastSync();
  }, []);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await syncService.syncAll();
      setLastSyncTime(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await syncService.retryFailed();
      setLastSyncTime(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Jamais';

    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'A l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;

    return lastSyncTime.toLocaleDateString('fr-FR');
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {!isOnline && <span className="text-red-600">Hors ligne</span>}
        {isOnline && pendingSyncCount > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {isSyncing ? 'Sync...' : `${pendingSyncCount} en attente`}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Synchronisation</h3>
        <span
          className={`flex items-center gap-1.5 text-sm ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {isOnline ? 'Connecte' : 'Hors ligne'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Derniere sync</span>
          <span className="text-gray-900">{formatLastSync()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">En attente</span>
          <span className="text-gray-900">{pendingSyncCount}</span>
        </div>

        {failedItems !== undefined && failedItems > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-red-500">Echecs</span>
            <span className="text-red-600">{failedItems}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSync}
            disabled={!isOnline || isSyncing || pendingSyncCount === 0}
            className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
          </button>

          {failedItems !== undefined && failedItems > 0 && (
            <button
              onClick={handleRetryFailed}
              disabled={!isOnline || isSyncing}
              className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              Reessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
