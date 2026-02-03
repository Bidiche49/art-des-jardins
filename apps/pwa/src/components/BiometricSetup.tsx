import { useState } from 'react';
import { Modal, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';
import { useWebAuthn } from '@/hooks/useWebAuthn';

interface BiometricSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function FaceIdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h6m-6 0v1.5M15 3h4a2 2 0 012 2v4m0 6v4a2 2 0 01-2 2h-4m0 0v-1.5m0 1.5H9m-6-6v4a2 2 0 002 2h4M3 9v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v1.5M15 9v1.5M9 15.5c1.5 1 4.5 1 6 0" />
    </svg>
  );
}

function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-1.1-.9-2-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c-3.3 0-6 2.7-6 6v3c0 3.3 2.7 6 6 6s6-2.7 6-6v-3c0-3.3-2.7-6-6-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-5.5 0-10 4.5-10 10v3c0 5.5 4.5 10 10 10s10-4.5 10-10v-3c0-5.5-4.5-10-10-10z" />
    </svg>
  );
}

export function BiometricSetup({ isOpen, onClose, onSuccess }: BiometricSetupProps) {
  const {
    biometricType,
    biometricLabel,
    defaultDeviceName,
    register,
    isLoading,
    error,
    dismissSetup,
    clearError,
  } = useWebAuthn();

  const [deviceName, setDeviceName] = useState(defaultDeviceName);
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    clearError();
    const result = await register(deviceName);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    }
  };

  const handleDismiss = () => {
    dismissSetup();
    onClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const BiometricIcon = biometricType === 'face' ? FaceIdIcon : FingerprintIcon;

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm" showCloseButton={false}>
        <div className="text-center py-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {biometricLabel} active
          </h3>
          <p className="text-gray-600">
            Vous pourrez vous connecter avec {biometricLabel} lors de vos prochaines connexions.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Connexion rapide" size="sm">
      <div className="text-center py-2">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <BiometricIcon className="h-8 w-8 text-primary-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Activer {biometricLabel} ?
        </h3>

        <p className="text-gray-600 mb-6">
          Connectez-vous plus rapidement et en toute securite avec {biometricLabel}.
          Plus besoin de retaper votre mot de passe a chaque connexion.
        </p>

        <div className="mb-4">
          <label htmlFor="device-name" className="block text-sm font-medium text-gray-700 text-left mb-1">
            Nom de cet appareil
          </label>
          <input
            id="device-name"
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ex: Mon iPhone"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <ModalFooter>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isLoading}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          Ne plus demander
        </button>
        <Button
          variant="primary"
          onClick={handleActivate}
          isLoading={isLoading}
          disabled={isLoading || !deviceName.trim()}
        >
          Activer {biometricLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
