import { useState, useEffect, useCallback, useRef } from 'react';

export interface IdleTimerConfig {
  timeout: number; // en millisecondes
  warningTime?: number; // temps avant expiration pour afficher warning (default: 2 min)
  onIdle: () => void;
  onWarning?: () => void;
  enabled?: boolean;
}

export interface IdleTimerState {
  remaining: number;
  isWarning: boolean;
  isIdle: boolean;
  resetTimer: () => void;
}

const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'mousemove',
  'click',
] as const;

const DEFAULT_WARNING_TIME = 2 * 60 * 1000; // 2 minutes

export function useIdleTimer({
  timeout,
  warningTime = DEFAULT_WARNING_TIME,
  onIdle,
  onWarning,
  enabled = true,
}: IdleTimerConfig): IdleTimerState {
  const [remaining, setRemaining] = useState(timeout);
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  const timeoutRef = useRef(timeout);
  const lastActivityRef = useRef(Date.now());
  const warningTriggeredRef = useRef(false);
  const idleTriggeredRef = useRef(false);

  // Reset le timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemaining(timeoutRef.current);
    setIsWarning(false);
    setIsIdle(false);
    warningTriggeredRef.current = false;
    idleTriggeredRef.current = false;
  }, []);

  // Gestion des evenements d'activite
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      if (!idleTriggeredRef.current) {
        lastActivityRef.current = Date.now();
        if (warningTriggeredRef.current) {
          warningTriggeredRef.current = false;
          setIsWarning(false);
        }
      }
    };

    // Ajoute les listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled]);

  // Interval pour mettre a jour le temps restant
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const newRemaining = Math.max(0, timeoutRef.current - elapsed);

      setRemaining(newRemaining);

      // Warning
      if (newRemaining <= warningTime && newRemaining > 0 && !warningTriggeredRef.current) {
        warningTriggeredRef.current = true;
        setIsWarning(true);
        onWarning?.();
      }

      // Idle
      if (newRemaining <= 0 && !idleTriggeredRef.current) {
        idleTriggeredRef.current = true;
        setIsIdle(true);
        onIdle();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, timeout, warningTime, onIdle, onWarning]);

  // Met a jour le timeout si il change
  useEffect(() => {
    timeoutRef.current = timeout;
    resetTimer();
  }, [timeout, resetTimer]);

  return {
    remaining,
    isWarning,
    isIdle,
    resetTimer,
  };
}

// Timeouts par role (en millisecondes)
export const IDLE_TIMEOUTS = {
  patron: 30 * 60 * 1000, // 30 minutes
  employe: 2 * 60 * 60 * 1000, // 2 heures
  client: 60 * 60 * 1000, // 1 heure
} as const;

export type UserRole = keyof typeof IDLE_TIMEOUTS;

export function getIdleTimeoutForRole(role: UserRole): number {
  return IDLE_TIMEOUTS[role] || IDLE_TIMEOUTS.employe;
}
