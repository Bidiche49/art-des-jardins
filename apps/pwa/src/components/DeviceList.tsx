import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';
import { Button, Card, Spinner } from '@/components/ui';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useWebAuthn } from '@/hooks';

interface WebAuthnCredential {
  id: string;
  credentialId: string;
  deviceName: string | null;
  deviceType: string | null;
  lastUsedAt: string | null;
  createdAt: string;
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Jamais';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function DeviceList() {
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);

  const {
    isSupported,
    hasCredential,
    biometricLabel,
    register,
    defaultDeviceName,
    isLoading: registering,
    error: registerError,
    clearError: clearRegisterError,
  } = useWebAuthn();

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<WebAuthnCredential[]>('/auth/webauthn/credentials');
      setCredentials(data);
    } catch (e) {
      setError('Erreur lors du chargement des appareils');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleDelete = async (credentialId: string) => {
    try {
      setDeleting(true);
      await apiClient.delete(`/auth/webauthn/credentials/${credentialId}`);
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
      setDeleteConfirm(null);
    } catch (e) {
      setError('Erreur lors de la suppression');
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddDevice = async () => {
    clearRegisterError();
    const success = await register(defaultDeviceName);
    if (success) {
      setShowAddDevice(false);
      fetchCredentials();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchCredentials} variant="outline">
          Reessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FingerprintIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="mb-4">Aucun appareil biometrique enregistre</p>
          {isSupported && (
            <Button onClick={() => setShowAddDevice(true)} leftIcon={<PlusIcon className="h-4 w-4" />}>
              Ajouter cet appareil
            </Button>
          )}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {credentials.map((credential) => (
              <li key={credential.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FingerprintIcon className="h-8 w-8 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {credential.deviceName || 'Appareil inconnu'}
                      {hasCredential && credential.credentialId && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          Cet appareil
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ajoute le {formatDate(credential.createdAt)}
                    </p>
                    {credential.lastUsedAt && (
                      <p className="text-xs text-gray-400">
                        Derniere utilisation: {formatDate(credential.lastUsedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(credential.id)}
                  aria-label="Supprimer"
                >
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>

          {isSupported && !hasCredential && (
            <Button
              onClick={() => setShowAddDevice(true)}
              variant="outline"
              className="w-full"
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Ajouter cet appareil
            </Button>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Supprimer l'appareil"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400">
          Etes-vous sur de vouloir supprimer cet appareil ? Vous ne pourrez plus l'utiliser pour vous connecter.
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            isLoading={deleting}
          >
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add device modal */}
      <Modal
        isOpen={showAddDevice}
        onClose={() => {
          setShowAddDevice(false);
          clearRegisterError();
        }}
        title="Ajouter cet appareil"
        size="sm"
      >
        <div className="text-center py-4">
          <FingerprintIcon className="h-16 w-16 mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Utilisez {biometricLabel} pour vous connecter rapidement a l'application.
          </p>
          {registerError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {registerError}
            </div>
          )}
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowAddDevice(false);
              clearRegisterError();
            }}
            disabled={registering}
          >
            Annuler
          </Button>
          <Button onClick={handleAddDevice} isLoading={registering}>
            Activer {biometricLabel}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
