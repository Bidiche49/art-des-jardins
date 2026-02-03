import { useState, useMemo } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { History, Smartphone, Monitor, GitMerge, Calendar, Trash2 } from 'lucide-react';
import { useConflictStore } from '../../stores/conflicts';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { ConflictResolutionResult } from '../../types/sync.types';

interface ConflictHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'keep_local' | 'keep_server' | 'merge';

const RESOLUTION_LABELS: Record<string, { label: string; icon: typeof Smartphone; color: string }> = {
  keep_local: {
    label: 'Version locale',
    icon: Smartphone,
    color: 'text-blue-600 bg-blue-50',
  },
  keep_server: {
    label: 'Version serveur',
    icon: Monitor,
    color: 'text-orange-600 bg-orange-50',
  },
  merge: {
    label: 'Fusion',
    icon: GitMerge,
    color: 'text-purple-600 bg-purple-50',
  },
};

function ResolutionBadge({ resolution }: { resolution: string }) {
  const config = RESOLUTION_LABELS[resolution] || RESOLUTION_LABELS.keep_local;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function HistoryItem({ result }: { result: ConflictResolutionResult }) {
  const timestamp = result.timestamp instanceof Date ? result.timestamp : new Date(result.timestamp);

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <ResolutionBadge resolution={result.resolution} />
        <div>
          <div className="text-sm font-medium text-gray-900">
            Conflit #{result.conflictId.slice(0, 8)}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(timestamp, { addSuffix: true, locale: fr })}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        {format(timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}
      </div>
    </div>
  );
}

export function ConflictHistory({ isOpen, onClose }: ConflictHistoryProps) {
  const resolutionHistory = useConflictStore((state) => state.resolutionHistory);
  const clearHistory = useConflictStore((state) => state.clearHistory);

  const [filter, setFilter] = useState<FilterType>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = useMemo(() => {
    let filtered = [...resolutionHistory].reverse(); // Plus recent en premier

    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.resolution === filter);
    }

    return filtered;
  }, [resolutionHistory, filter]);

  const stats = useMemo(() => {
    const total = resolutionHistory.length;
    const local = resolutionHistory.filter((r) => r.resolution === 'keep_local').length;
    const server = resolutionHistory.filter((r) => r.resolution === 'keep_server').length;
    const merge = resolutionHistory.filter((r) => r.resolution === 'merge').length;

    return { total, local, server, merge };
  }, [resolutionHistory]);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historique des resolutions" size="lg">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 bg-gray-50 rounded-lg text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.local}</div>
            <div className="text-xs text-blue-500">Local</div>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg text-center">
            <div className="text-lg font-semibold text-orange-600">{stats.server}</div>
            <div className="text-xs text-orange-500">Serveur</div>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg text-center">
            <div className="text-lg font-semibold text-purple-600">{stats.merge}</div>
            <div className="text-xs text-purple-500">Fusion</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrer:</span>
          <div className="flex gap-1">
            {(['all', 'keep_local', 'keep_server', 'merge'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Tout' : RESOLUTION_LABELS[f]?.label || f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="border rounded-lg max-h-80 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Aucune resolution dans l&apos;historique</p>
            </div>
          ) : (
            filteredHistory.map((result, index) => (
              <HistoryItem key={`${result.conflictId}-${index}`} result={result} />
            ))
          )}
        </div>

        {/* Actions */}
        {resolutionHistory.length > 0 && (
          <div className="flex justify-end pt-2 border-t">
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Effacer l&apos;historique ?</span>
                <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Annuler
                </Button>
                <Button variant="danger" size="sm" onClick={handleClearHistory}>
                  Confirmer
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Effacer l&apos;historique
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ConflictHistory;
