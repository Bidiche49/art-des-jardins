import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterventionsStore, useChantiersStore } from '@/stores';
import {
  Button,
  Card,
  CardTitle,
  Badge,
  LoadingOverlay,
  Modal,
} from '@/components/ui';
import { PhotoCapture, type PhotoData } from '@/components/PhotoCapture';
import { PhotoGallery, type PhotoItem } from '@/components/PhotoGallery';
import { PhotoCompare } from '@/components/PhotoCompare';
import type { InterventionStatut } from '@/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const STATUT_BADGES: Record<
  InterventionStatut,
  { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' }
> = {
  planifiee: { label: 'Planifiee', variant: 'default' },
  en_cours: { label: 'En cours', variant: 'primary' },
  terminee: { label: 'Terminee', variant: 'success' },
  annulee: { label: 'Annulee', variant: 'danger' },
};

export function InterventionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedIntervention,
    isLoading,
    fetchInterventionById,
    startIntervention,
    completeIntervention,
    addPhoto,
  } = useInterventionsStore();
  const { selectedChantier, fetchChantierById } = useChantiersStore();

  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInterventionById(id);
    }
  }, [id, fetchInterventionById]);

  useEffect(() => {
    if (selectedIntervention?.chantierId) {
      fetchChantierById(selectedIntervention.chantierId);
    }
  }, [selectedIntervention?.chantierId, fetchChantierById]);

  const handleStart = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await startIntervention(id);
      toast.success('Intervention demarree');
    } catch {
      toast.error('Erreur lors du demarrage');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const now = new Date();
      const heureFin = format(now, 'HH:mm');
      await completeIntervention(id, heureFin);
      toast.success('Intervention terminee');
      setShowCompleteConfirm(false);
    } catch {
      toast.error('Erreur lors de la completion');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePhotoTaken = async (photo: PhotoData) => {
    if (!id) return;
    try {
      await addPhoto(id, photo.url);
    } catch {
      toast.error("Erreur lors de l'enregistrement de la photo");
    }
  };

  const photoItems = useMemo((): PhotoItem[] => {
    const rawPhotos = selectedIntervention?.photos || [];
    return rawPhotos.map((url, index) => ({
      id: `photo-${index}`,
      url,
      type: 'DURING' as const,
      createdAt: selectedIntervention?.createdAt?.toString() || new Date().toISOString(),
    }));
  }, [selectedIntervention?.photos, selectedIntervention?.createdAt]);

  const beforePhotos = useMemo(
    () => photoItems.filter((p) => p.type === 'BEFORE'),
    [photoItems]
  );

  const afterPhotos = useMemo(
    () => photoItems.filter((p) => p.type === 'AFTER'),
    [photoItems]
  );

  const handleDeletePhoto = async (photoId: string) => {
    toast.success('Photo supprimee');
  };

  if (isLoading || !selectedIntervention) {
    return <LoadingOverlay message="Chargement de l'intervention..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/interventions')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            Intervention du{' '}
            {format(new Date(selectedIntervention.date), 'dd MMMM yyyy', {
              locale: fr,
            })}
          </h1>
          <p className="text-gray-500">
            {selectedIntervention.heureDebut}
            {selectedIntervention.heureFin &&
              ` - ${selectedIntervention.heureFin}`}
          </p>
        </div>
        <Badge
          variant={STATUT_BADGES[selectedIntervention.statut].variant}
          size="md"
        >
          {STATUT_BADGES[selectedIntervention.statut].label}
        </Badge>
      </div>

      {selectedChantier && (
        <Card
          onClick={() => navigate(`/chantiers/${selectedChantier.id}`)}
          hoverable
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📍</div>
            <div>
              <div className="font-medium">{selectedChantier.adresse}</div>
              <div className="text-sm text-gray-500">
                {selectedChantier.codePostal} {selectedChantier.ville}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardTitle>Description</CardTitle>
        <p className="mt-2 text-gray-700">{selectedIntervention.description}</p>
        {selectedIntervention.notes && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500 mb-1">Notes</div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedIntervention.notes}
            </p>
          </div>
        )}
      </Card>

      {selectedIntervention.statut !== 'terminee' &&
        selectedIntervention.statut !== 'annulee' && (
          <div className="flex gap-3">
            {selectedIntervention.statut === 'planifiee' && (
              <Button
                onClick={handleStart}
                isLoading={actionLoading}
                className="flex-1"
              >
                Demarrer l'intervention
              </Button>
            )}
            {selectedIntervention.statut === 'en_cours' && (
              <Button
                variant="success"
                onClick={() => setShowCompleteConfirm(true)}
                className="flex-1"
              >
                Terminer l'intervention
              </Button>
            )}
          </div>
        )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Photos ({photoItems.length})</h2>
          {selectedIntervention.statut !== 'annulee' && (
            <Button size="sm" onClick={() => setShowPhotoCapture(true)}>
              + Ajouter photo
            </Button>
          )}
        </div>

        {photoItems.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-500">Aucune photo</p>
            {selectedIntervention.statut !== 'annulee' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPhotoCapture(true)}
                className="mt-3"
              >
                Prendre une photo
              </Button>
            )}
          </Card>
        ) : (
          <PhotoGallery
            photos={photoItems}
            onDelete={handleDeletePhoto}
            onCompare={() => setShowCompare(true)}
          />
        )}
      </div>

      <PhotoCapture
        interventionId={id || ''}
        isOpen={showPhotoCapture}
        onClose={() => setShowPhotoCapture(false)}
        onPhotoTaken={handlePhotoTaken}
      />

      <Modal
        isOpen={showCompleteConfirm}
        onClose={() => setShowCompleteConfirm(false)}
        title="Terminer l'intervention"
      >
        <p className="text-gray-600 mb-6">
          Confirmez-vous la fin de cette intervention ?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowCompleteConfirm(false)}>
            Annuler
          </Button>
          <Button onClick={handleComplete} isLoading={actionLoading}>
            Confirmer
          </Button>
        </div>
      </Modal>

      <PhotoCompare
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        beforePhotos={beforePhotos}
        afterPhotos={afterPhotos}
      />
    </div>
  );
}
