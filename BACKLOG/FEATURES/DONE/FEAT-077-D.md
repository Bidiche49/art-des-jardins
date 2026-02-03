# FEAT-077-D: Frontend - Service WebAuthn + Composant BiometricSetup

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** security, auth, pwa, ux
**Parent:** FEAT-077
**Depends:** FEAT-077-C
**Date creation:** 2026-02-03

---

## Description

Implementer le service WebAuthn frontend et le composant de configuration biometrique qui propose l'activation apres la premiere connexion.

## Scope limite

- Installation de `@simplewebauthn/browser`
- Service WebAuthn frontend avec detection support et methodes register/authenticate
- Composant `BiometricSetup` modal/bottom-sheet
- Hook `useWebAuthn` pour faciliter l'utilisation
- Stockage local du flag "biometrie disponible"

## Criteres d'acceptation

- [ ] Package `@simplewebauthn/browser` installe
- [ ] `WebAuthnService` frontend avec:
  - `isSupported()` - detection support navigateur
  - `hasCredential()` - check si credential existe pour ce device
  - `register(deviceName?)` - enregistrement biometrie
  - `authenticate()` - authentification biometrie
- [ ] Hook `useWebAuthn` exposant les methodes et etats
- [ ] Composant `BiometricSetup` avec:
  - Explication des benefices
  - Champ nom du device (pre-rempli)
  - Bouton "Activer Face ID/Touch ID"
  - Option "Ne plus demander"
- [ ] Detection automatique du type de biometrie (Face ID vs Touch ID vs empreinte)
- [ ] Tests unitaires pour le service et le composant

## Fichiers concernes

- `apps/pwa/src/services/webauthn.service.ts` (nouveau)
- `apps/pwa/src/hooks/useWebAuthn.ts` (nouveau)
- `apps/pwa/src/components/BiometricSetup.tsx` (nouveau)
- `apps/pwa/src/components/BiometricSetup.test.tsx` (nouveau)
- `apps/pwa/package.json` (ajout dep)

## SECTION AUTOMATISATION

**Score:** 85/100

### Raison du score
- Lib `@simplewebauthn/browser` bien documentee
- Code exemple fourni
- Detection type biometrie = heuristique UA

### Prompt d'execution

```
Tu dois creer le service WebAuthn frontend et le composant BiometricSetup.

1. Installe la dependance:
   cd apps/pwa
   pnpm add @simplewebauthn/browser

2. Cree `apps/pwa/src/services/webauthn.service.ts`:

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';
import { api } from './api';

const BIOMETRIC_DISMISSED_KEY = 'webauthn_setup_dismissed';
const HAS_CREDENTIAL_KEY = 'webauthn_has_credential';

export const webAuthnService = {
  isSupported(): boolean {
    return browserSupportsWebAuthn();
  },

  supportsAutofill(): boolean {
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

  async register(deviceName?: string): Promise<boolean> {
    const options = await api.get('/auth/webauthn/register/options');
    const response = await startRegistration(options);
    const result = await api.post('/auth/webauthn/register/verify', {
      response: JSON.stringify(response),
      deviceName,
    });
    if (result.verified) {
      this.setHasCredential(true);
    }
    return result.verified;
  },

  async authenticate(): Promise<{ accessToken: string; refreshToken: string }> {
    const options = await api.get('/auth/webauthn/login/options');
    const response = await startAuthentication(options);
    return api.post('/auth/webauthn/login/verify', {
      response: JSON.stringify(response),
    });
  },

  getBiometricType(): 'face' | 'fingerprint' | 'unknown' {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad/.test(ua)) {
      // iPhone X+ = Face ID, autres = Touch ID
      return /iphone1[1-9]|iphone[2-9][0-9]/.test(ua) ? 'face' : 'fingerprint';
    }
    if (/mac/.test(ua)) return 'fingerprint'; // Touch ID Mac
    if (/android/.test(ua)) return 'fingerprint';
    if (/windows/.test(ua)) return 'face'; // Windows Hello
    return 'unknown';
  },
};

3. Cree le hook `apps/pwa/src/hooks/useWebAuthn.ts`:

import { useState, useCallback, useEffect } from 'react';
import { webAuthnService } from '../services/webauthn.service';

export function useWebAuthn() {
  const [isSupported, setIsSupported] = useState(false);
  const [hasCredential, setHasCredential] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint' | 'unknown'>('unknown');

  useEffect(() => {
    setIsSupported(webAuthnService.isSupported());
    setHasCredential(webAuthnService.hasCredential());
    setBiometricType(webAuthnService.getBiometricType());
  }, []);

  const register = useCallback(async (deviceName?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await webAuthnService.register(deviceName);
      if (success) setHasCredential(true);
      return success;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await webAuthnService.authenticate();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    hasCredential,
    isLoading,
    error,
    biometricType,
    register,
    authenticate,
    shouldShowSetup: isSupported && !hasCredential && !webAuthnService.isSetupDismissed(),
    dismissSetup: webAuthnService.dismissSetup,
  };
}

4. Cree le composant `apps/pwa/src/components/BiometricSetup.tsx`:

- Modal/BottomSheet qui s'affiche apres login
- Icone Face ID ou empreinte selon biometricType
- Texte explicatif des benefices
- Input pour nommer le device (defaut: "Mon iPhone" / "Mon Android" / etc.)
- Bouton "Activer" qui appelle register()
- Lien "Ne plus demander" qui appelle dismissSetup()
- Gestion etats loading/error

5. Cree les tests:
   - `webauthn.service.test.ts`: mock des fonctions browser
   - `BiometricSetup.test.tsx`: render, interaction, appels service
```

### Criteres de succes automatises

- `pnpm test` passe dans apps/pwa
- Composant s'affiche correctement
- Detection biometrie fonctionne
