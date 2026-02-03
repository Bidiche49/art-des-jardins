import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, Smartphone, Monitor, GitMerge } from 'lucide-react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ConflictField } from './ConflictField';
import type { SyncConflict, ConflictResolution } from '../../types/sync.types';

interface ConflictModalProps {
  conflict: SyncConflict;
  onResolve: (resolution: ConflictResolution, mergedData?: Record<string, unknown>) => void;
  onCancel?: () => void;
}

interface ConflictModalContentProps {
  conflict: SyncConflict;
  onResolve: (resolution: ConflictResolution, mergedData?: Record<string, unknown>) => void;
}

const FIELD_LABELS: Record<string, string> = {
  notes: 'Notes',
  status: 'Statut',
  statut: 'Statut',
  description: 'Description',
  adresse: 'Adresse',
  telephone: 'Telephone',
  email: 'Email',
  nom: 'Nom',
  prenom: 'Prenom',
  date_debut: 'Date de debut',
  date_fin: 'Date de fin',
  montant: 'Montant',
  prix: 'Prix',
  quantite: 'Quantite',
  commentaire: 'Commentaire',
  priorite: 'Priorite',
  type: 'Type',
};

function getFieldLabel(fieldName: string): string {
  return FIELD_LABELS[fieldName] || fieldName.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

/**
 * Composant interne avec le contenu du modal de conflit.
 * Utilisable standalone ou integre dans ConflictQueue.
 */
export function ConflictModalContent({ conflict, onResolve }: ConflictModalContentProps) {
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [mergedData, setMergedData] = useState<Record<string, unknown>>(() => ({
    ...conflict.localVersion,
  }));

  const allFields = useMemo(() => {
    const fields = new Set([
      ...Object.keys(conflict.localVersion),
      ...Object.keys(conflict.serverVersion),
    ]);
    // Filter out internal fields
    return Array.from(fields).filter(
      f => !f.startsWith('_') && f !== 'id' && f !== 'createdAt' && f !== 'updatedAt'
    );
  }, [conflict.localVersion, conflict.serverVersion]);

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const handleMergeValueChange = (fieldName: string, value: unknown) => {
    setMergedData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleKeepLocal = () => {
    onResolve('keep_local');
  };

  const handleKeepServer = () => {
    onResolve('keep_server');
  };

  const handleStartMerge = () => {
    setIsMergeMode(true);
  };

  const handleConfirmMerge = () => {
    onResolve('merge', mergedData);
  };

  const handleCancelMerge = () => {
    setIsMergeMode(false);
    setMergedData({ ...conflict.localVersion });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <div className="p-2 bg-amber-100 rounded-full">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Conflit sur {conflict.entityLabel}
          </h3>
          <p className="text-sm text-gray-500">
            Les donnees ont ete modifiees a la fois en local et sur le serveur
          </p>
        </div>
      </div>

      {/* Version headers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900">
              {isMergeMode ? 'Version fusionnee' : 'Votre version'}
            </div>
            <div className="text-xs text-blue-600">
              {formatTimestamp(conflict.localTimestamp)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
          <Monitor className="w-5 h-5 text-orange-600" />
          <div>
            <div className="font-medium text-orange-900">Version serveur</div>
            <div className="text-xs text-orange-600">
              {formatTimestamp(conflict.serverTimestamp)}
            </div>
          </div>
        </div>
      </div>

      {/* Fields comparison */}
      <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
        {allFields.map(fieldName => {
          const isConflicting = conflict.conflictingFields.includes(fieldName);
          return (
            <ConflictField
              key={fieldName}
              fieldName={fieldName}
              fieldLabel={getFieldLabel(fieldName)}
              localValue={conflict.localVersion[fieldName]}
              serverValue={conflict.serverVersion[fieldName]}
              isConflicting={isConflicting}
              isMergeMode={isMergeMode}
              mergedValue={mergedData[fieldName]}
              onMergeValueChange={value => handleMergeValueChange(fieldName, value)}
            />
          );
        })}
      </div>

      {/* Legend */}
      {!isMergeMode && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-50 border border-amber-200 rounded"></span>
            <span>Champs en conflit</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <ModalFooter className="flex-wrap">
        {isMergeMode ? (
          <>
            <Button variant="outline" onClick={handleCancelMerge}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleConfirmMerge}>
              <GitMerge className="w-4 h-4 mr-2" />
              Confirmer la fusion
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleKeepLocal}>
              <Smartphone className="w-4 h-4 mr-2" />
              Garder la mienne
            </Button>
            <Button variant="outline" onClick={handleKeepServer}>
              <Monitor className="w-4 h-4 mr-2" />
              Garder serveur
            </Button>
            <Button variant="secondary" onClick={handleStartMerge}>
              <GitMerge className="w-4 h-4 mr-2" />
              Fusionner
            </Button>
          </>
        )}
      </ModalFooter>
    </div>
  );
}

/**
 * Modal de resolution de conflit standalone.
 * Utilise pour afficher un conflit unique.
 */
export function ConflictModal({ conflict, onResolve, onCancel }: ConflictModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={() => onCancel?.()}
      title=""
      size="lg"
      showCloseButton={false}
    >
      <ConflictModalContent conflict={conflict} onResolve={onResolve} />
    </Modal>
  );
}
