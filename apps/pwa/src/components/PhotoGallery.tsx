import { useState } from 'react';
import { Badge, Button, Modal, ModalFooter } from '@/components/ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { PhotoType } from './PhotoCapture';

export interface PhotoItem {
  id: string;
  url: string;
  type: PhotoType;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onDelete?: (photoId: string) => void;
  onCompare?: () => void;
}

type FilterType = 'ALL' | PhotoType;

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: 'Tous',
  BEFORE: 'Avant',
  DURING: 'Pendant',
  AFTER: 'Apres',
};

const TYPE_VARIANTS: Record<PhotoType, 'warning' | 'primary' | 'success'> = {
  BEFORE: 'warning',
  DURING: 'primary',
  AFTER: 'success',
};

export function PhotoGallery({ photos, onDelete, onCompare }: PhotoGalleryProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredPhotos =
    filter === 'ALL' ? photos : photos.filter((p) => p.type === filter);

  const hasBeforePhotos = photos.some((p) => p.type === 'BEFORE');
  const hasAfterPhotos = photos.some((p) => p.type === 'AFTER');
  const canCompare = hasBeforePhotos && hasAfterPhotos;

  const handlePhotoClick = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPhoto && onDelete) {
      onDelete(selectedPhoto.id);
      setShowDeleteConfirm(false);
      setSelectedPhoto(null);
    }
  };

  const formatCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return null;
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {(Object.keys(FILTER_LABELS) as FilterType[]).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFilter(filterKey)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  filter === filterKey
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                }
              `}
            >
              {FILTER_LABELS[filterKey]}
              {filterKey !== 'ALL' && (
                <span className="ml-1 text-xs">
                  ({photos.filter((p) => p.type === filterKey).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {canCompare && onCompare && (
          <Button size="sm" variant="outline" onClick={onCompare}>
            Comparer avant/apres
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => handlePhotoClick(photo)}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={`Photo ${photo.type}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <Badge
              variant={TYPE_VARIANTS[photo.type]}
              size="sm"
              className="absolute top-2 left-2"
            >
              {FILTER_LABELS[photo.type]}
            </Badge>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune photo de type "{FILTER_LABELS[filter]}"
        </div>
      )}

      <Modal
        isOpen={!!selectedPhoto}
        onClose={closeLightbox}
        size="xl"
        title="Photo"
      >
        {selectedPhoto && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={selectedPhoto.url}
                alt={`Photo ${selectedPhoto.type}`}
                className="w-full max-h-[60vh] object-contain"
              />
              <Badge
                variant={TYPE_VARIANTS[selectedPhoto.type]}
                className="absolute top-3 left-3"
              >
                {FILTER_LABELS[selectedPhoto.type]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Date</span>
                <p className="font-medium">
                  {format(new Date(selectedPhoto.createdAt), 'dd MMM yyyy HH:mm', {
                    locale: fr,
                  })}
                </p>
              </div>
              {formatCoordinates(selectedPhoto.latitude, selectedPhoto.longitude) && (
                <div>
                  <span className="text-gray-500">Position GPS</span>
                  <p className="font-medium font-mono text-xs">
                    {formatCoordinates(selectedPhoto.latitude, selectedPhoto.longitude)}
                  </p>
                </div>
              )}
            </div>

            {onDelete && (
              <ModalFooter>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteClick}
                >
                  Supprimer
                </Button>
              </ModalFooter>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Supprimer la photo"
        size="sm"
      >
        <p className="text-gray-600 mb-4">
          Etes-vous sur de vouloir supprimer cette photo ? Cette action est
          irreversible.
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
