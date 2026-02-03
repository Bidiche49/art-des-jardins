# FEAT-077: Authentification biometrique (WebAuthn)

**Type:** Feature
**Statut:** Pret
**Priorite:** Haute
**Complexite:** M
**Tags:** security, auth, ux, pwa, mobile
**Date creation:** 2026-02-03
**Phase:** 12

---

## Description

Permettre l'authentification via Face ID (iPhone), Touch ID (iPhone/Mac), empreinte digitale (Android) ou Windows Hello grace a l'API WebAuthn.

## User Story

**En tant que** utilisateur
**Je veux** me connecter avec mon empreinte ou mon visage
**Afin de** ne pas avoir a retaper mon mot de passe a chaque expiration de session

## Contexte

Avec l'expiration des sessions inactives (IMP-006), les utilisateurs doivent se reconnecter frequemment. Sur le terrain, taper un mot de passe avec des gants ou les mains sales est penible.

WebAuthn permet une authentification biometrique native:
- Face ID / Touch ID sur iOS
- Empreinte digitale sur Android
- Windows Hello sur PC
- Touch ID sur Mac

C'est plus securise qu'un mot de passe (biometrie + device physique).

## Criteres d'acceptation

### Enregistrement
- [ ] Proposition d'activer la biometrie apres premiere connexion reussie
- [ ] Enregistrement credential WebAuthn lie au device
- [ ] Stockage cle publique en BDD (jamais la cle privee)
- [ ] Possibilite d'enregistrer plusieurs devices par user
- [ ] Nommage des devices (ex: "iPhone de Jean")

### Authentification
- [ ] Login par biometrie si credential enregistre
- [ ] Fallback mot de passe si biometrie echoue/indisponible
- [ ] Reconnexion rapide apres expiration session
- [ ] Option "Se souvenir de ce device" pour bypass 2FA

### Gestion
- [ ] Liste des devices enregistres dans profil
- [ ] Suppression d'un device a distance
- [ ] Alerte si nouveau device enregistre
- [ ] Revocation de tous les devices en cas de compromission

### Securite
- [ ] Challenge unique a chaque authentification
- [ ] Verification origine (anti-phishing)
- [ ] Expiration des credentials apres X mois d'inactivite
- [ ] Pas de biometrie pour actions critiques (suppression compte, etc.)

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (WebAuthnCredential)
- `apps/api/src/modules/auth/webauthn.service.ts` (nouveau)
- `apps/api/src/modules/auth/webauthn.controller.ts` (nouveau)
- `apps/api/src/modules/auth/auth.service.ts` (modification)
- `apps/pwa/src/services/webauthn.service.ts` (nouveau)
- `apps/pwa/src/components/BiometricSetup.tsx` (nouveau)
- `apps/pwa/src/pages/login/index.tsx` (modification)

## Analyse / Approche

### Schema BDD

```prisma
model WebAuthnCredential {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  credentialId    String   @unique // Base64 encoded
  publicKey       String   // Base64 encoded
  counter         Int      @default(0)
  deviceName      String?
  deviceType      String?  // platform, cross-platform
  transports      String[] // usb, nfc, ble, internal
  lastUsedAt      DateTime?
  createdAt       DateTime @default(now())

  @@index([userId])
}
```

### Backend (NestJS)

Utiliser la lib `@simplewebauthn/server`:

```typescript
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// Enregistrement - etape 1: generer options
async startRegistration(userId: string) {
  const user = await this.userService.findById(userId);
  const existingCredentials = await this.getCredentials(userId);

  const options = await generateRegistrationOptions({
    rpName: 'Art & Jardin',
    rpID: 'app.artetjardin.fr',
    userID: userId,
    userName: user.email,
    userDisplayName: user.name,
    excludeCredentials: existingCredentials.map(c => ({
      id: Buffer.from(c.credentialId, 'base64'),
      type: 'public-key',
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Stocker challenge temporairement
  await this.cache.set(`webauthn:reg:${userId}`, options.challenge, 300);

  return options;
}

// Enregistrement - etape 2: verifier reponse
async finishRegistration(userId: string, response: RegistrationResponseJSON) {
  const expectedChallenge = await this.cache.get(`webauthn:reg:${userId}`);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: 'https://app.artetjardin.fr',
    expectedRPID: 'app.artetjardin.fr',
  });

  if (verification.verified) {
    await this.prisma.webAuthnCredential.create({
      data: {
        userId,
        credentialId: Buffer.from(verification.registrationInfo.credentialID).toString('base64'),
        publicKey: Buffer.from(verification.registrationInfo.credentialPublicKey).toString('base64'),
        counter: verification.registrationInfo.counter,
      },
    });
  }

  return { verified: verification.verified };
}
```

### Frontend (PWA)

Utiliser `@simplewebauthn/browser`:

```typescript
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';

// Verifier support
const isSupported = browserSupportsWebAuthn();

// Enregistrement
const register = async () => {
  const options = await api.get('/auth/webauthn/register/start');
  const response = await startRegistration(options);
  await api.post('/auth/webauthn/register/finish', response);
};

// Authentification
const authenticate = async () => {
  const options = await api.get('/auth/webauthn/login/start');
  const response = await startAuthentication(options);
  const { accessToken } = await api.post('/auth/webauthn/login/finish', response);
  return accessToken;
};
```

### Flow UX

```
┌─────────────────────────────────────────┐
│           Ecran de connexion            │
├─────────────────────────────────────────┤
│                                         │
│  [👆 Se connecter avec Face ID]         │  <- Si credential existe
│                                         │
│  ─────────── ou ───────────             │
│                                         │
│  Email: [____________________]          │
│  Mot de passe: [_____________]          │
│                                         │
│  [Se connecter]                         │
│                                         │
└─────────────────────────────────────────┘
```

## Tests de validation

- [ ] Detection support WebAuthn (navigateur)
- [ ] Enregistrement credential Face ID/Touch ID
- [ ] Authentification par biometrie
- [ ] Fallback mot de passe si biometrie indisponible
- [ ] Liste devices dans profil
- [ ] Suppression device fonctionne
- [ ] Nouveau device = alerte email
- [ ] Counter incremente (anti-replay)
