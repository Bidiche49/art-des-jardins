import { useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useIdleTimer, getIdleTimeoutForRole, type UserRole } from '@/hooks/useIdleTimer';
import { IdleWarningModal } from './IdleWarningModal';

interface IdleTimerProviderProps {
  children: React.ReactNode;
}

export function IdleTimerProvider({ children }: IdleTimerProviderProps) {
  const { user, isAuthenticated, logout, rememberMe } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);

  const handleIdle = useCallback(() => {
    setShowWarning(false);
    logout();
    // Redirection vers login sera geree par ProtectedRoute
  }, [logout]);

  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, []);

  const handleStayConnected = useCallback(() => {
    setShowWarning(false);
  }, []);

  // Determine le timeout selon le role
  const timeout = user?.role
    ? getIdleTimeoutForRole(user.role as UserRole)
    : getIdleTimeoutForRole('employe');

  // Le timer est actif uniquement si:
  // - L'utilisateur est authentifie
  // - L'option "Se souvenir de moi" n'est PAS activee
  const isTimerEnabled = isAuthenticated && !rememberMe;

  const { remaining, resetTimer } = useIdleTimer({
    timeout,
    onIdle: handleIdle,
    onWarning: handleWarning,
    enabled: isTimerEnabled,
  });

  const handleStayConnectedWithReset = useCallback(() => {
    resetTimer();
    handleStayConnected();
  }, [resetTimer, handleStayConnected]);

  return (
    <>
      {children}
      <IdleWarningModal
        isOpen={showWarning && isTimerEnabled}
        remainingMs={remaining}
        onStayConnected={handleStayConnectedWithReset}
        onLogout={handleIdle}
      />
    </>
  );
}
