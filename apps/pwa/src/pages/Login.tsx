import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api';
import { Button, Input } from '@/components/ui';
import { usePWAInstall, useWebAuthn } from '@/hooks';
import { BiometricSetup } from '@/components/BiometricSetup';

function FaceIdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h6m-6 0v1.5M15 3h4a2 2 0 012 2v4m0 6v4a2 2 0 01-2 2h-4m0 0v-1.5m0 1.5H9m-6-6v4a2 2 0 002 2h4M3 9v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v1.5M15 9v1.5M9 15.5c1.5 1 4.5 1 6 0" />
    </svg>
  );
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

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isInstalled } = usePWAInstall();
  const {
    hasCredential,
    authenticate,
    biometricType,
    biometricLabel,
    shouldShowSetup,
    isLoading: biometricLoading,
  } = useWebAuthn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  const handleBiometricLogin = async () => {
    setError('');
    try {
      const result = await authenticate();
      // The WebAuthn login endpoint returns the full auth response with user
      login(result.user, result.accessToken, result.refreshToken);
      navigate('/');
    } catch (err) {
      // Silent fallback - user can use password form
      console.log('Biometric auth cancelled or failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login(data.user, data.accessToken, data.refreshToken);

      // Show biometric setup if supported and not already set up
      if (shouldShowSetup) {
        setShowBiometricSetup(true);
      } else {
        navigate('/');
      }
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

  const BiometricIcon = biometricType === 'face' ? FaceIdIcon : FingerprintIcon;

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

        {hasCredential && (
          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleBiometricLogin}
              isLoading={biometricLoading}
              className="w-full py-3"
              leftIcon={<BiometricIcon className="h-5 w-5" />}
            >
              Se connecter avec {biometricLabel}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">ou</span>
              </div>
            </div>
          </div>
        )}

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

      <BiometricSetup
        isOpen={showBiometricSetup}
        onClose={() => {
          setShowBiometricSetup(false);
          navigate('/');
        }}
        onSuccess={() => {
          setShowBiometricSetup(false);
          navigate('/');
        }}
      />
    </div>
  );
}
