# FEAT-077-B: Backend - WebAuthn Service (Registration + Authentication)

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** security, auth, api
**Parent:** FEAT-077
**Depends:** FEAT-077-A
**Date creation:** 2026-02-03

---

## Description

Implementer le service WebAuthn backend avec les methodes d'enregistrement et d'authentification. Utilise la librairie `@simplewebauthn/server`.

## Scope limite

- Installation de `@simplewebauthn/server`
- Service avec 4 methodes principales: startRegistration, finishRegistration, startAuthentication, finishAuthentication
- Gestion du cache pour les challenges temporaires
- CRUD basique sur les credentials

## Criteres d'acceptation

- [ ] Package `@simplewebauthn/server` installe
- [ ] `WebAuthnService` cree dans `apps/api/src/modules/auth/`
- [ ] Methode `startRegistration(userId)` retourne les options
- [ ] Methode `finishRegistration(userId, response)` verifie et stocke le credential
- [ ] Methode `startAuthentication(email?)` retourne les options
- [ ] Methode `finishAuthentication(response)` verifie et retourne le user
- [ ] Methode `getUserCredentials(userId)` liste les credentials
- [ ] Methode `deleteCredential(userId, credentialId)` supprime un credential
- [ ] Configuration RP (rpName, rpID, origin) via env vars
- [ ] Tests unitaires pour chaque methode

## Fichiers concernes

- `apps/api/src/modules/auth/webauthn.service.ts` (nouveau)
- `apps/api/src/modules/auth/webauthn.service.spec.ts` (nouveau)
- `apps/api/package.json` (ajout dep)

## SECTION AUTOMATISATION

**Score:** 85/100

### Raison du score
- Code exemple fourni dans le ticket parent
- Lib `@simplewebauthn` bien documentee
- Necessite integration cache (Redis ou memory)

### Prompt d'execution

```
Tu dois creer le service WebAuthn backend.

1. Installe la dependance:
   cd apps/api
   pnpm add @simplewebauthn/server

2. Cree `apps/api/src/modules/auth/webauthn.service.ts`:

import { Injectable } from '@nestjs/common';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class WebAuthnService {
  private rpName: string;
  private rpID: string;
  private origin: string;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private config: ConfigService,
  ) {
    this.rpName = this.config.get('WEBAUTHN_RP_NAME', 'Art & Jardin');
    this.rpID = this.config.get('WEBAUTHN_RP_ID', 'localhost');
    this.origin = this.config.get('WEBAUTHN_ORIGIN', 'http://localhost:3000');
  }

  // Implemente les methodes:
  // - startRegistration(userId: string)
  // - finishRegistration(userId: string, response: RegistrationResponseJSON, deviceName?: string)
  // - startAuthentication(email?: string)
  // - finishAuthentication(response: AuthenticationResponseJSON)
  // - getUserCredentials(userId: string)
  // - deleteCredential(userId: string, credentialId: string)
  // - revokeAllCredentials(userId: string)
}

3. Points cles:
   - Stocke le challenge dans le cache avec TTL 5min
   - Cle cache: `webauthn:reg:{userId}` ou `webauthn:auth:{challenge}`
   - Incremente le counter a chaque auth
   - Met a jour lastUsedAt a chaque utilisation

4. Cree les tests unitaires dans `webauthn.service.spec.ts`:
   - Mock PrismaService et CacheService
   - Test startRegistration retourne des options valides
   - Test finishRegistration stocke le credential
   - Test startAuthentication avec/sans email
   - Test finishAuthentication retourne le user
   - Test deleteCredential supprime bien

5. Exporte le service dans le module auth
```

### Criteres de succes automatises

- `pnpm test` passe dans apps/api
- Service injectable sans erreur
- Pas d'erreur TypeScript
