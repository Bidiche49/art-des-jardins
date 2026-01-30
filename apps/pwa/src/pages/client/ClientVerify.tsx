import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientAuthStore } from '@/stores/clientAuth';
import { clientAuthApi } from '@/api/clientAuth';
import { Button } from '@/components/ui';

export function ClientVerify() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const login = useClientAuthStore((state) => state.login);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Lien invalide');
      return;
    }

    const verify = async () => {
      try {
        const data = await clientAuthApi.verifyToken(token);
        login(data.client, data.accessToken, data.refreshToken);
        setStatus('success');
        setTimeout(() => {
          navigate('/client/dashboard');
        }, 1500);
      } catch (err) {
        setStatus('error');
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ce lien est invalide ou a expire');
        }
      }
    };

    verify();
  }, [token, login, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verification en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-5xl">✓</span>
          <h2 className="mt-4 text-2xl font-bold text-green-600">Connexion reussie</h2>
          <p className="mt-2 text-gray-600">Redirection vers votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-5xl">❌</span>
        <h2 className="text-2xl font-bold text-gray-900">Lien invalide</h2>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm text-gray-500">
          Les liens de connexion expirent apres 15 minutes et ne peuvent etre utilises qu'une fois.
        </p>
        <Button onClick={() => navigate('/client/login')}>
          Demander un nouveau lien
        </Button>
      </div>
    </div>
  );
}
