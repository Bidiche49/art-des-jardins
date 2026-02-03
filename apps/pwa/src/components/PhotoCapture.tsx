import { useState, useRef, useEffect } from 'react';
import { uploadApi } from '@/api';
import { Button, Modal, ModalFooter, Badge, Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

export type PhotoType = 'BEFORE' | 'DURING' | 'AFTER';

export interface PhotoData {
  url: string;
  type: PhotoType;
  latitude?: number;
  longitude?: number;
  timestamp: Date;
}

interface PhotoCaptureProps {
  interventionId: string;
  onPhotoTaken: (photo: PhotoData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  BEFORE: 'Avant',
  DURING: 'Pendant',
  AFTER: 'Apres',
};

const PHOTO_TYPE_VARIANTS: Record<PhotoType, 'warning' | 'primary' | 'success'> = {
  BEFORE: 'warning',
  DURING: 'primary',
  AFTER: 'success',
};

type GeoStatus = 'pending' | 'acquiring' | 'success' | 'denied' | 'error';

export function PhotoCapture({
  interventionId,
  onPhotoTaken,
  isOpen,
  onClose,
}: PhotoCaptureProps) {
  const [selectedType, setSelectedType] = useState<PhotoType>('BEFORE');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('pending');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedType('BEFORE');
      setPreview(null);
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);
      setGeoStatus('pending');
      setCoordinates(null);
      acquireGeolocation();
    }
  }, [isOpen]);

  const acquireGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }

    setGeoStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus('success');
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoStatus('denied');
        } else {
          setGeoStatus('error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit etre une image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne doit pas depasser 10 MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const result = await uploadApi.uploadImage(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      const photoData: PhotoData = {
        url: result.url,
        type: selectedType,
        latitude: coordinates?.lat,
        longitude: coordinates?.lng,
        timestamp: new Date(),
      };

      onPhotoTaken(photoData);
      toast.success('Photo enregistree');
      onClose();
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderGeoIndicator = () => {
    switch (geoStatus) {
      case 'pending':
      case 'acquiring':
        return (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Spinner size="sm" />
            <span>Acquisition GPS...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Position GPS acquise</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-2 text-yellow-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>GPS refuse</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>GPS indisponible</span>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prendre une photo" size="lg">
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de photo
          </label>
          <div className="flex gap-2">
            {(Object.keys(PHOTO_TYPE_LABELS) as PhotoType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    selectedType === type
                      ? type === 'BEFORE'
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
                        : type === 'DURING'
                        ? 'bg-primary-100 text-primary-800 border-2 border-primary-400'
                        : 'bg-green-100 text-green-800 border-2 border-green-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }
                `}
                disabled={isUploading}
              >
                {PHOTO_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {renderGeoIndicator()}
          {geoStatus === 'denied' || geoStatus === 'error' ? (
            <button
              type="button"
              onClick={acquireGeolocation}
              className="text-sm text-primary-600 hover:underline"
            >
              Reessayer
            </button>
          ) : null}
        </div>

        {!preview ? (
          <div
            onClick={handleCapture}
            className="
              border-2 border-dashed border-gray-300 rounded-lg p-8
              flex flex-col items-center justify-center cursor-pointer
              hover:border-primary-400 hover:bg-gray-50 transition-colors
            "
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 font-medium">Prendre une photo</p>
            <p className="text-gray-400 text-sm mt-1">
              Appuyez pour ouvrir l'appareil photo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain"
              />
              <Badge
                variant={PHOTO_TYPE_VARIANTS[selectedType]}
                className="absolute top-2 left-2"
              >
                {PHOTO_TYPE_LABELS[selectedType]}
              </Badge>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Upload en cours...</span>
                  <span className="text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModalFooter>
        {!preview ? (
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Reprendre
            </Button>
            <Button
              onClick={handleConfirm}
              isLoading={isUploading}
              disabled={isUploading}
            >
              Confirmer
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
