import { Navigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';

interface ProtectedClientRouteProps {
  children: React.ReactNode;
}

export function ProtectedClientRoute({ children }: ProtectedClientRouteProps) {
  const { isAuthenticated, isLoading } = useClientAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/client/login" replace />;
  }

  return <>{children}</>;
}
