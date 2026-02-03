import { useState, useCallback, useEffect } from 'react';
import { webAuthnService, BiometricType } from '@/services/webauthn.service';

interface UseWebAuthnReturn {
  isSupported: boolean;
  hasCredential: boolean;
  isLoading: boolean;
  error: string | null;
  biometricType: BiometricType;
  biometricLabel: string;
  defaultDeviceName: string;
  shouldShowSetup: boolean;
  register: (deviceName?: string) => Promise<boolean>;
  authenticate: (email?: string) => Promise<{ accessToken: string; refreshToken: string }>;
  dismissSetup: () => void;
  clearError: () => void;
}

export function useWebAuthn(): UseWebAuthnReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [hasCredential, setHasCredential] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<BiometricType>('unknown');
  const [biometricLabel, setBiometricLabel] = useState('Biometrie');
  const [defaultDeviceName, setDefaultDeviceName] = useState('Mon appareil');
  const [isSetupDismissed, setIsSetupDismissed] = useState(false);

  useEffect(() => {
    setIsSupported(webAuthnService.isSupported());
    setHasCredential(webAuthnService.hasCredential());
    setBiometricType(webAuthnService.getBiometricType());
    setBiometricLabel(webAuthnService.getBiometricLabel());
    setDefaultDeviceName(webAuthnService.getDefaultDeviceName());
    setIsSetupDismissed(webAuthnService.isSetupDismissed());
  }, []);

  const register = useCallback(async (deviceName?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await webAuthnService.register(deviceName);
      if (success) {
        setHasCredential(true);
      }
      return success;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticate = useCallback(async (email?: string): Promise<{ accessToken: string; refreshToken: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      return await webAuthnService.authenticate(email);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur lors de l\'authentification';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismissSetup = useCallback(() => {
    webAuthnService.dismissSetup();
    setIsSetupDismissed(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSupported,
    hasCredential,
    isLoading,
    error,
    biometricType,
    biometricLabel,
    defaultDeviceName,
    shouldShowSetup: isSupported && !hasCredential && !isSetupDismissed,
    register,
    authenticate,
    dismissSetup,
    clearError,
  };
}
