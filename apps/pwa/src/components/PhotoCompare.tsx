import { useState } from 'react';
import { Modal, Badge, Button } from '@/components/ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { PhotoItem } from './PhotoGallery';

interface PhotoCompareProps {
  isOpen: boolean;
  onClose: () => void;
  beforePhotos: PhotoItem[];
  afterPhotos: PhotoItem[];
}

export function PhotoCompare({
  isOpen,
  onClose,
  beforePhotos,
  afterPhotos,
}: PhotoCompareProps) {
  const [beforeIndex, setBeforeIndex] = useState(0);
  const [afterIndex, setAfterIndex] = useState(0);

  const currentBefore = beforePhotos[beforeIndex];
  const currentAfter = afterPhotos[afterIndex];

  const handlePrevBefore = () => {
    setBeforeIndex((prev) => (prev > 0 ? prev - 1 : beforePhotos.length - 1));
  };

  const handleNextBefore = () => {
    setBeforeIndex((prev) => (prev < beforePhotos.length - 1 ? prev + 1 : 0));
  };

  const handlePrevAfter = () => {
    setAfterIndex((prev) => (prev > 0 ? prev - 1 : afterPhotos.length - 1));
  };

  const handleNextAfter = () => {
    setAfterIndex((prev) => (prev < afterPhotos.length - 1 ? prev + 1 : 0));
  };

  if (!currentBefore || !currentAfter) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title="Comparaison avant / apres"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="relative aspect-square lg:aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={currentBefore.url}
              alt="Avant"
              className="w-full h-full object-contain"
            />
            <Badge variant="warning" className="absolute top-3 left-3">
              Avant
            </Badge>
            {beforePhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrevBefore}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Photo precedente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextBefore}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Photo suivante"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="text-center text-sm text-gray-500">
            {format(new Date(currentBefore.createdAt), 'dd MMM yyyy HH:mm', {
              locale: fr,
            })}
            {beforePhotos.length > 1 && (
              <span className="ml-2">
                ({beforeIndex + 1}/{beforePhotos.length})
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="relative aspect-square lg:aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={currentAfter.url}
              alt="Apres"
              className="w-full h-full object-contain"
            />
            <Badge variant="success" className="absolute top-3 left-3">
              Apres
            </Badge>
            {afterPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrevAfter}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Photo precedente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextAfter}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Photo suivante"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="text-center text-sm text-gray-500">
            {format(new Date(currentAfter.createdAt), 'dd MMM yyyy HH:mm', {
              locale: fr,
            })}
            {afterPhotos.length > 1 && (
              <span className="ml-2">
                ({afterIndex + 1}/{afterPhotos.length})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
}
