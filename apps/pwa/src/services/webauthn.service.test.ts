import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { webAuthnService } from './webauthn.service';

// Mock @simplewebauthn/browser
vi.mock('@simplewebauthn/browser', () => ({
  browserSupportsWebAuthn: vi.fn(),
  browserSupportsWebAuthnAutofill: vi.fn(),
  startRegistration: vi.fn(),
  startAuthentication: vi.fn(),
}));

// Mock api client
vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';
import apiClient from '@/api/client';

describe('webAuthnService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
    vi.mocked(localStorage.removeItem).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isSupported', () => {
    it('should return true when WebAuthn is supported', () => {
      vi.mocked(browserSupportsWebAuthn).mockReturnValue(true);
      expect(webAuthnService.isSupported()).toBe(true);
    });

    it('should return false when WebAuthn is not supported', () => {
      vi.mocked(browserSupportsWebAuthn).mockReturnValue(false);
      expect(webAuthnService.isSupported()).toBe(false);
    });
  });

  describe('supportsAutofill', () => {
    it('should return true when autofill is supported', async () => {
      vi.mocked(browserSupportsWebAuthnAutofill).mockResolvedValue(true);
      await expect(webAuthnService.supportsAutofill()).resolves.toBe(true);
    });

    it('should return false when autofill is not supported', async () => {
      vi.mocked(browserSupportsWebAuthnAutofill).mockResolvedValue(false);
      await expect(webAuthnService.supportsAutofill()).resolves.toBe(false);
    });
  });

  describe('hasCredential', () => {
    it('should return false by default', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(webAuthnService.hasCredential()).toBe(false);
    });

    it('should return true when credential flag is set', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('true');
      expect(webAuthnService.hasCredential()).toBe(true);
    });
  });

  describe('setHasCredential', () => {
    it('should set the credential flag to true', () => {
      webAuthnService.setHasCredential(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('webauthn_has_credential', 'true');
    });

    it('should set the credential flag to false', () => {
      webAuthnService.setHasCredential(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('webauthn_has_credential', 'false');
    });
  });

  describe('isSetupDismissed', () => {
    it('should return false by default', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(webAuthnService.isSetupDismissed()).toBe(false);
    });

    it('should return true when dismissed', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('true');
      expect(webAuthnService.isSetupDismissed()).toBe(true);
    });
  });

  describe('dismissSetup', () => {
    it('should set the dismissed flag', () => {
      webAuthnService.dismissSetup();
      expect(localStorage.setItem).toHaveBeenCalledWith('webauthn_setup_dismissed', 'true');
    });
  });

  describe('clearDismissedFlag', () => {
    it('should clear the dismissed flag', () => {
      webAuthnService.clearDismissedFlag();
      expect(localStorage.removeItem).toHaveBeenCalledWith('webauthn_setup_dismissed');
    });
  });

  describe('register', () => {
    it('should register a credential successfully', async () => {
      const mockOptions = { challenge: 'test-challenge' };
      const mockResponse = { id: 'credential-id' };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockOptions });
      vi.mocked(startRegistration).mockResolvedValue(mockResponse as never);
      vi.mocked(apiClient.post).mockResolvedValue({ data: { verified: true } });

      const result = await webAuthnService.register('Mon iPhone');

      expect(result).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/webauthn/register/options');
      expect(startRegistration).toHaveBeenCalledWith({ optionsJSON: mockOptions });
      expect(apiClient.post).toHaveBeenCalledWith('/auth/webauthn/register/verify', {
        response: JSON.stringify(mockResponse),
        deviceName: 'Mon iPhone',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('webauthn_has_credential', 'true');
    });

    it('should return false when registration fails', async () => {
      const mockOptions = { challenge: 'test-challenge' };
      const mockResponse = { id: 'credential-id' };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockOptions });
      vi.mocked(startRegistration).mockResolvedValue(mockResponse as never);
      vi.mocked(apiClient.post).mockResolvedValue({ data: { verified: false } });

      const result = await webAuthnService.register();

      expect(result).toBe(false);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      const mockOptions = { challenge: 'test-challenge' };
      const mockResponse = { id: 'assertion-id' };
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockOptions });
      vi.mocked(startAuthentication).mockResolvedValue(mockResponse as never);
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockTokens });

      const result = await webAuthnService.authenticate();

      expect(result).toEqual(mockTokens);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/webauthn/login/options');
    });

    it('should pass email parameter when provided', async () => {
      const mockOptions = { challenge: 'test-challenge' };
      const mockResponse = { id: 'assertion-id' };
      const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockOptions });
      vi.mocked(startAuthentication).mockResolvedValue(mockResponse as never);
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockTokens });

      await webAuthnService.authenticate('test@example.com');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/auth/webauthn/login/options?email=test%40example.com'
      );
    });
  });

  describe('getBiometricType', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return fingerprint for iPhone', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('fingerprint');
    });

    it('should return face for iPad', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('face');
    });

    it('should return fingerprint for Mac', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('fingerprint');
    });

    it('should return fingerprint for Android', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Linux; Android 12)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('fingerprint');
    });

    it('should return face for Windows', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('face');
    });

    it('should return unknown for other platforms', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Unknown Platform)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricType()).toBe('unknown');
    });
  });

  describe('getBiometricLabel', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return Touch ID for iPhone', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricLabel()).toBe('Touch ID');
    });

    it('should return Touch ID for Mac', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricLabel()).toBe('Touch ID');
    });

    it('should return Windows Hello for Windows', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricLabel()).toBe('Windows Hello');
    });

    it('should return Empreinte digitale for Android', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Linux; Android 12)' },
        writable: true,
      });
      expect(webAuthnService.getBiometricLabel()).toBe('Empreinte digitale');
    });
  });

  describe('getDefaultDeviceName', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return Mon iPhone for iPhone', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon iPhone');
    });

    it('should return Mon iPad for iPad', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon iPad');
    });

    it('should return Mon Mac for Mac', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon Mac');
    });

    it('should return Mon Android for Android', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Linux; Android 12)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon Android');
    });

    it('should return Mon PC Windows for Windows', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon PC Windows');
    });

    it('should return Mon appareil for unknown platform', () => {
      Object.defineProperty(global, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Unknown Platform)' },
        writable: true,
      });
      expect(webAuthnService.getDefaultDeviceName()).toBe('Mon appareil');
    });
  });
});
