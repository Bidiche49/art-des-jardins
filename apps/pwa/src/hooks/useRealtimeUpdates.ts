import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { websocketService } from '../services/websocket.service';
import {
  WS_EVENTS,
  DevisSignedPayload,
  DevisRejectedPayload,
  FacturePaidPayload,
  FactureCreatedPayload,
  InterventionStartedPayload,
  InterventionCompletedPayload,
  ClientCreatedPayload,
  DevisCreatedPayload,
} from '../services/websocket.types';
import { useAuthStore } from '../stores/auth';

const LEADER_KEY = 'ws_leader_tab';
const LEADER_HEARTBEAT_KEY = 'ws_leader_heartbeat';
const LEADER_TIMEOUT = 5000; // 5 seconds
const HEARTBEAT_INTERVAL = 2000; // 2 seconds

/**
 * Generate a unique tab ID
 */
const generateTabId = () => `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`;

/**
 * Hook for managing real-time WebSocket updates
 * Includes leader election to prevent duplicate toasts across tabs
 */
export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();
  const { token, user } = useAuthStore();
  const tabIdRef = useRef(generateTabId());
  const isLeaderRef = useRef(false);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Check if this tab should be the leader
   */
  const checkLeadership = useCallback(() => {
    const currentLeader = localStorage.getItem(LEADER_KEY);
    const lastHeartbeat = localStorage.getItem(LEADER_HEARTBEAT_KEY);
    const now = Date.now();

    // If no leader or leader is stale, claim leadership
    if (!currentLeader || !lastHeartbeat || now - parseInt(lastHeartbeat, 10) > LEADER_TIMEOUT) {
      localStorage.setItem(LEADER_KEY, tabIdRef.current);
      localStorage.setItem(LEADER_HEARTBEAT_KEY, now.toString());
      isLeaderRef.current = true;
      return true;
    }

    // Check if we are the leader
    isLeaderRef.current = currentLeader === tabIdRef.current;
    return isLeaderRef.current;
  }, []);

  /**
   * Update heartbeat if we are the leader
   */
  const updateHeartbeat = useCallback(() => {
    if (isLeaderRef.current) {
      localStorage.setItem(LEADER_HEARTBEAT_KEY, Date.now().toString());
    } else {
      // Check if we should take over
      checkLeadership();
    }
  }, [checkLeadership]);

  /**
   * Release leadership when tab closes
   */
  const releaseLeadership = useCallback(() => {
    if (isLeaderRef.current) {
      const currentLeader = localStorage.getItem(LEADER_KEY);
      if (currentLeader === tabIdRef.current) {
        localStorage.removeItem(LEADER_KEY);
        localStorage.removeItem(LEADER_HEARTBEAT_KEY);
      }
    }
  }, []);

  /**
   * Show toast only if this tab is the leader
   */
  const showToastIfLeader = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      if (isLeaderRef.current) {
        if (type === 'success') {
          toast.success(message);
        } else if (type === 'error') {
          toast.error(message);
        } else {
          toast(message);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    // Claim or check leadership
    checkLeadership();

    // Start heartbeat interval
    heartbeatIntervalRef.current = setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);

    // Connect to WebSocket
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    websocketService.connect({
      url: apiUrl,
      token,
    });

    // Event handlers
    const handleDevisCreated = (data: DevisCreatedPayload) => {
      showToastIfLeader(`Nouveau devis: ${data.numero} - ${data.clientName}`, 'info');
      queryClient.invalidateQueries({ queryKey: ['devis'] });
    };

    const handleDevisSigned = (data: DevisSignedPayload) => {
      showToastIfLeader(`Devis signé par ${data.clientName}`, 'success');
      queryClient.invalidateQueries({ queryKey: ['devis'] });
      queryClient.invalidateQueries({ queryKey: ['devis', data.id] });
    };

    const handleDevisRejected = (data: DevisRejectedPayload) => {
      const reason = data.reason ? ` - ${data.reason}` : '';
      showToastIfLeader(`Devis refusé par ${data.clientName}${reason}`, 'error');
      queryClient.invalidateQueries({ queryKey: ['devis'] });
      queryClient.invalidateQueries({ queryKey: ['devis', data.id] });
    };

    const handleFactureCreated = (data: FactureCreatedPayload) => {
      showToastIfLeader(`Nouvelle facture: ${data.numero} - ${data.amount}€`, 'info');
      queryClient.invalidateQueries({ queryKey: ['factures'] });
    };

    const handleFacturePaid = (data: FacturePaidPayload) => {
      showToastIfLeader(`Facture payée: ${data.numero} - ${data.amount}€`, 'success');
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['factures', data.id] });
    };

    const handleInterventionStarted = (data: InterventionStartedPayload) => {
      showToastIfLeader(`Intervention démarrée: ${data.address} (${data.assignee})`, 'info');
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
    };

    const handleInterventionCompleted = (data: InterventionCompletedPayload) => {
      const hours = Math.floor(data.duration / 60);
      const minutes = data.duration % 60;
      const durationStr = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`;
      showToastIfLeader(`Intervention terminée: ${data.address} (${durationStr})`, 'success');
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.invalidateQueries({ queryKey: ['interventions', data.id] });
    };

    const handleClientCreated = (data: ClientCreatedPayload) => {
      showToastIfLeader(`Nouveau client: ${data.name}`, 'info');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    };

    // Register event listeners
    websocketService.on(WS_EVENTS.DEVIS_CREATED, handleDevisCreated);
    websocketService.on(WS_EVENTS.DEVIS_SIGNED, handleDevisSigned);
    websocketService.on(WS_EVENTS.DEVIS_REJECTED, handleDevisRejected);
    websocketService.on(WS_EVENTS.FACTURE_CREATED, handleFactureCreated);
    websocketService.on(WS_EVENTS.FACTURE_PAID, handleFacturePaid);
    websocketService.on(WS_EVENTS.INTERVENTION_STARTED, handleInterventionStarted);
    websocketService.on(WS_EVENTS.INTERVENTION_COMPLETED, handleInterventionCompleted);
    websocketService.on(WS_EVENTS.CLIENT_CREATED, handleClientCreated);

    // Handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkLeadership();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle tab close
    window.addEventListener('beforeunload', releaseLeadership);

    // Handle storage events (other tabs changing leadership)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LEADER_KEY && e.newValue !== tabIdRef.current) {
        isLeaderRef.current = false;
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      // Clear heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Release leadership
      releaseLeadership();

      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', releaseLeadership);
      window.removeEventListener('storage', handleStorageChange);

      // Unsubscribe from WebSocket events
      websocketService.off(WS_EVENTS.DEVIS_CREATED);
      websocketService.off(WS_EVENTS.DEVIS_SIGNED);
      websocketService.off(WS_EVENTS.DEVIS_REJECTED);
      websocketService.off(WS_EVENTS.FACTURE_CREATED);
      websocketService.off(WS_EVENTS.FACTURE_PAID);
      websocketService.off(WS_EVENTS.INTERVENTION_STARTED);
      websocketService.off(WS_EVENTS.INTERVENTION_COMPLETED);
      websocketService.off(WS_EVENTS.CLIENT_CREATED);

      // Disconnect WebSocket
      websocketService.disconnect();
    };
  }, [
    token,
    user,
    queryClient,
    checkLeadership,
    updateHeartbeat,
    releaseLeadership,
    showToastIfLeader,
  ]);
};
