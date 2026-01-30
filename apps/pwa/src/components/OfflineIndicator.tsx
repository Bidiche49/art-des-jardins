import { useUIStore } from '@/stores/ui';
import { useEffect, useState } from 'react';

interface OfflineIndicatorProps {
  variant?: 'banner' | 'badge' | 'dot';
  className?: string;
}

export function OfflineIndicator({ variant = 'banner', className = '' }: OfflineIndicatorProps) {
  const { isOnline, pendingSyncCount } = useUIStore();
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
      setWasOffline(true);
    } else if (wasOffline) {
      const timer = setTimeout(() => {
        setShowBanner(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (variant === 'dot') {
    return (
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'
        } ${className}`}
        title={isOnline ? 'Connecte' : 'Hors ligne'}
      />
    );
  }

  if (variant === 'badge') {
    if (isOnline && pendingSyncCount === 0) return null;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
          !isOnline
            ? 'bg-red-100 text-red-800 animate-pulse'
            : 'bg-yellow-100 text-yellow-800'
        } ${className}`}
      >
        {!isOnline ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Hors ligne
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            {pendingSyncCount} en attente
          </>
        )}
      </span>
    );
  }

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showBanner ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}
    >
      <div
        className={`px-4 py-2 text-center text-sm font-medium ${
          !isOnline
            ? 'bg-red-600 text-white'
            : 'bg-green-600 text-white'
        }`}
      >
        {!isOnline ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656m-7.072 7.072a9 9 0 010-12.728m3.536 3.536a4 4 0 010 5.656" />
            </svg>
            Mode hors ligne - Les modifications seront synchronisees au retour de la connexion
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Connexion retablie - Synchronisation en cours...
          </span>
        )}
      </div>
    </div>
  );
}
