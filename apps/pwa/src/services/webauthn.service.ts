import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';
import apiClient from '@/api/client';
import type { AuthResponse } from '@art-et-jardin/shared';

const BIOMETRIC_DISMISSED_KEY = 'webauthn_setup_dismissed';
const HAS_CREDENTIAL_KEY = 'webauthn_has_credential';

export type BiometricType = 'face' | 'fingerprint' | 'unknown';

export const webAuthnService = {
  isSupported(): boolean {
    if (!browserSupportsWebAuthn()) return false;
    // WebAuthn requires a proper domain, not an IP address
    const hostname = window.location.hostname;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return false;
    return true;
  },

  async supportsAutofill(): Promise<boolean> {
    return browserSupportsWebAuthnAutofill();
  },

  hasCredential(): boolean {
    return localStorage.getItem(HAS_CREDENTIAL_KEY) === 'true';
  },

  setHasCredential(value: boolean): void {
    localStorage.setItem(HAS_CREDENTIAL_KEY, String(value));
  },

  isSetupDismissed(): boolean {
    return localStorage.getItem(BIOMETRIC_DISMISSED_KEY) === 'true';
  },

  dismissSetup(): void {
    localStorage.setItem(BIOMETRIC_DISMISSED_KEY, 'true');
  },

  clearDismissedFlag(): void {
    localStorage.removeItem(BIOMETRIC_DISMISSED_KEY);
  },

  async register(deviceName?: string): Promise<boolean> {
    const { data: options } = await apiClient.get('/auth/webauthn/register/options');
    const response = await startRegistration({ optionsJSON: options });
    const { data: result } = await apiClient.post('/auth/webauthn/register/verify', {
      response: JSON.stringify(response),
      deviceName,
    });
    if (result.verified) {
      this.setHasCredential(true);
    }
    return result.verified;
  },

  async authenticate(email?: string): Promise<AuthResponse> {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    const { data: options } = await apiClient.get(`/auth/webauthn/login/options${params}`);
    const response = await startAuthentication({ optionsJSON: options });
    const { data: result } = await apiClient.post<AuthResponse>('/auth/webauthn/login/verify', {
      response: JSON.stringify(response),
    });
    return result;
  },

  getBiometricType(): BiometricType {
    const ua = navigator.userAgent.toLowerCase();

    // iOS devices
    if (/iphone|ipad/.test(ua)) {
      const isIPad = /ipad/.test(ua);
      if (isIPad) {
        return 'face';
      }
      // iPhone with Face ID: screen height >= 812 (iPhone X+)
      // iPhone SE (Touch ID): screen height < 812
      const screenHeight = Math.max(window.screen.height, window.screen.width);
      if (screenHeight >= 812) {
        return 'face';
      }
      return 'fingerprint';
    }

    // macOS - Touch ID on MacBook
    if (/mac/.test(ua)) {
      return 'fingerprint';
    }

    // Android devices - typically fingerprint
    if (/android/.test(ua)) {
      return 'fingerprint';
    }

    // Windows Hello - can be face or fingerprint, default to face
    if (/windows/.test(ua)) {
      return 'face';
    }

    return 'unknown';
  },

  getBiometricLabel(): string {
    const type = this.getBiometricType();
    const ua = navigator.userAgent.toLowerCase();

    if (/iphone|ipad/.test(ua)) {
      return type === 'face' ? 'Face ID' : 'Touch ID';
    }
    if (/mac/.test(ua)) {
      return 'Touch ID';
    }
    if (/windows/.test(ua)) {
      return 'Windows Hello';
    }
    if (/android/.test(ua)) {
      return 'Empreinte digitale';
    }

    return 'Biometrie';
  },

  getDefaultDeviceName(): string {
    const ua = navigator.userAgent.toLowerCase();

    if (/iphone/.test(ua)) {
      return 'Mon iPhone';
    }
    if (/ipad/.test(ua)) {
      return 'Mon iPad';
    }
    if (/mac/.test(ua)) {
      return 'Mon Mac';
    }
    if (/android/.test(ua)) {
      return 'Mon Android';
    }
    if (/windows/.test(ua)) {
      return 'Mon PC Windows';
    }

    return 'Mon appareil';
  },
};
