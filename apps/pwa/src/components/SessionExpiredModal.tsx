import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';
import { useWebAuthn } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { SESSION_EXPIRED_EVENT } from '@/api/client';

function FingerprintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2s2-.9 2-2v-3c0-1.1-.9-2-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c-3.3 0-6 2.7-6 6v3c0 3.3 2.7 6 6 6s6-2.7 6-6v-3c0-3.3-2.7-6-6-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-5.5 0-10 4.5-10 10v3c0 5.5 4.5 10 10 10s10-4.5 10-10v-3c0-5.5-4.5-10-10-10z" />
    </svg>
  );
}

export function SessionExpiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    authenticate,
    biometricLabel,
    isLoading,
  } = useWebAuthn();

  const handleSessionExpired = useCallback(() => {
    setIsOpen(true);
    setAuthError(null);
  }, []);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [handleSessionExpired]);

  const handleBiometricLogin = async () => {
    setAuthError(null);
    try {
      const result = await authenticate();
      login(result.user, result.accessToken, result.refreshToken);
      setIsOpen(false);
      // Reload to refresh any failed requests
      window.location.reload();
    } catch (err) {
      setAuthError('Authentification annulee ou echouee');
    }
  };

  const handleGoToLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleGoToLogin}
      title="Session expiree"
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center py-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <FingerprintIcon className="h-8 w-8 text-amber-600" />
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Votre session a expire. Reconnectez-vous rapidement avec {biometricLabel}.
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {authError}
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleGoToLogin} disabled={isLoading}>
          Utiliser mot de passe
        </Button>
        <Button onClick={handleBiometricLogin} isLoading={isLoading}>
          Utiliser {biometricLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
