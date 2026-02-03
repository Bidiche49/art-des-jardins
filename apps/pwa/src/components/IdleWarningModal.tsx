import { useEffect, useState } from 'react';
import { Modal, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';

interface IdleWarningModalProps {
  isOpen: boolean;
  remainingMs: number;
  onStayConnected: () => void;
  onLogout: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function IdleWarningModal({
  isOpen,
  remainingMs,
  onStayConnected,
  onLogout,
}: IdleWarningModalProps) {
  const [displayTime, setDisplayTime] = useState(formatTime(remainingMs));

  useEffect(() => {
    setDisplayTime(formatTime(remainingMs));
  }, [remainingMs]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onStayConnected}
      title="Session inactive"
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center py-4">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-gray-600 mb-2">
          Votre session va expirer dans
        </p>

        <p className="text-3xl font-bold text-gray-900 mb-4">
          {displayTime}
        </p>

        <p className="text-sm text-gray-500">
          Pour des raisons de securite, vous serez deconnecte apres une periode d'inactivite.
        </p>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onLogout}>
          Se deconnecter
        </Button>
        <Button variant="primary" onClick={onStayConnected}>
          Rester connecte
        </Button>
      </ModalFooter>
    </Modal>
  );
}
