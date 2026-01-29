import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api';
import { Button, Input } from '@/components/ui';
import { usePWAInstall } from '@/hooks';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isInstalled } = usePWAInstall();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Identifiants invalides');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <span className="text-5xl">🌿</span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Art & Jardin</h2>
          <p className="mt-2 text-gray-600">Connectez-vous a votre compte</p>
          {!isInstalled && (
            <p className="mt-1 text-xs text-gray-400">
              Installez l'app pour un acces rapide
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              autoComplete="email"
            />

            <Input
              id="password"
              type="password"
              label="Mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-3"
          >
            Se connecter
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Art & Jardin - Application de gestion
        </p>
      </div>
    </div>
  );
}
