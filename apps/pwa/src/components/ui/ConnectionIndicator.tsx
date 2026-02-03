import { useState, useEffect } from 'react';
import { websocketService } from '../../services/websocket.service';
import type { ConnectionState } from '../../services/websocket.types';

interface ConnectionIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

const stateConfig: Record<ConnectionState, { color: string; label: string; title: string }> = {
  connected: {
    color: 'bg-green-500',
    label: 'Temps réel',
    title: 'Connexion temps réel active',
  },
  reconnecting: {
    color: 'bg-yellow-500 animate-pulse',
    label: 'Reconnexion...',
    title: 'Tentative de reconnexion en cours',
  },
  disconnected: {
    color: 'bg-red-500',
    label: 'Déconnecté',
    title: 'Connexion temps réel perdue',
  },
  fallback: {
    color: 'bg-orange-500',
    label: 'Mode dégradé',
    title: 'WebSocket indisponible, actualisation automatique activée',
  },
};

export function ConnectionIndicator({ className = '', showLabel = true }: ConnectionIndicatorProps) {
  const [state, setState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    const unsubscribe = websocketService.onStateChange(setState);
    return unsubscribe;
  }, []);

  const config = stateConfig[state];

  return (
    <div className={`flex items-center gap-1.5 ${className}`} title={config.title}>
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      {showLabel && (
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          {config.label}
        </span>
      )}
    </div>
  );
}
