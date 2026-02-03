# FEAT-059: Authentification 2FA pour patrons

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** security, auth, 2fa, totp
**Date creation:** 2026-01-30
**Date completion:** 2026-02-02

---

## Description

Implémenter l'authentification à deux facteurs (2FA) via TOTP pour les utilisateurs avec rôle "patron", avec option d'activation pour les employés.

## User Story

**En tant que** patron
**Je veux** une double authentification sur mon compte
**Afin de** protéger l'accès aux données sensibles de l'entreprise

## Criteres d'acceptation

- [x] TOTP compatible Google Authenticator / Authy
- [x] 2FA obligatoire pour les patrons (configurable via TWO_FACTOR_REQUIRED_ROLES)
- [x] 2FA optionnel pour les employés
- [x] QR code pour setup initial
- [x] Codes de récupération (10 codes à usage unique)
- [x] Endpoint `POST /auth/2fa/setup` - génère secret + QR
- [x] Endpoint `POST /auth/2fa/verify` - vérifie code et active
- [x] Endpoint `POST /auth/2fa/disable` - désactive (avec vérification code)
- [x] Endpoint `POST /auth/2fa/recovery-codes` - régénère codes récupération
- [x] Endpoint `POST /auth/2fa/status` - vérifie statut 2FA
- [x] Endpoint `POST /auth/login` adapté pour 2FA
- [x] Stockage sécurisé du secret (chiffré AES-256-GCM en BDD)
- [x] Rate limiting sur vérification 2FA (5 essais max, lockout 15 min)
- [ ] Audit log pour activation/désactivation 2FA (à faire dans un ticket séparé)

## Implementation

### Fichiers créés/modifiés

| Fichier | Type | Description |
|---------|------|-------------|
| `apps/api/src/modules/auth/two-factor.service.ts` | Nouveau | Service complet 2FA (setup, verify, disable, recovery) |
| `apps/api/src/modules/auth/two-factor.service.spec.ts` | Nouveau | 27 tests unitaires |
| `apps/api/src/modules/auth/dto/verify-2fa.dto.ts` | Nouveau | DTOs pour endpoints 2FA |
| `apps/api/src/modules/auth/auth.service.ts` | Modifié | Intégration 2FA dans login |
| `apps/api/src/modules/auth/auth.controller.ts` | Modifié | 5 nouveaux endpoints 2FA |
| `apps/api/src/modules/auth/auth.module.ts` | Modifié | Export TwoFactorService |
| `apps/api/src/config/env.validation.ts` | Modifié | +2 vars env 2FA |
| `packages/database/prisma/schema.prisma` | Modifié | +5 champs User |
| `packages/database/prisma/migrations/20260202150000_two_factor_auth/` | Nouveau | Migration 2FA |

### Schema Prisma ajouté

```prisma
model User {
  // ... existing fields
  twoFactorSecret      String?    // Chiffré AES-256-GCM
  twoFactorEnabled     Boolean    @default(false)
  recoveryCodes        String[]   // Hashés bcrypt
  twoFactorAttempts    Int        @default(0)
  twoFactorLockedUntil DateTime?
}
```

### Dépendances ajoutées

```bash
pnpm add otplib qrcode
pnpm add -D @types/qrcode
```

### Variables d'environnement

```env
TWO_FACTOR_ENCRYPTION_KEY=your-32-char-secret-key  # Optionnel, fallback dev
TWO_FACTOR_REQUIRED_ROLES=patron                    # Rôles avec 2FA obligatoire
```

### Endpoints API

| Endpoint | Description |
|----------|-------------|
| `POST /auth/2fa/setup` | Génère secret + QR code (authentifié) |
| `POST /auth/2fa/verify` | Vérifie code et active 2FA (authentifié) |
| `POST /auth/2fa/disable` | Désactive 2FA avec vérification (authentifié) |
| `POST /auth/2fa/recovery-codes` | Régénère codes récupération (authentifié) |
| `POST /auth/2fa/status` | Vérifie si 2FA enabled/required (authentifié) |

### Flow Login avec 2FA

1. Client envoie `{ email, password }`
2. Si user a 2FA enabled et pas de `totpCode`: retourne `{ requires2FA: true, userId }`
3. Client renvoie `{ email, password, totpCode }`
4. Si code valide (TOTP ou recovery): retourne tokens
5. Si code invalide: incrémente attempts, lockout après 5 tentatives

## Tests de validation

- [x] Test unitaire: génération secret TOTP
- [x] Test unitaire: vérification code TOTP
- [x] Test unitaire: codes de récupération
- [x] Test unitaire: chiffrement/déchiffrement secret
- [x] Test unitaire: lockout après 5 tentatives
- [x] Test unitaire: login avec 2FA
- [ ] Test e2e: setup 2FA complet (FEAT-060)
- [ ] Test e2e: login avec 2FA (FEAT-060)
- [ ] Test manuel: scan QR avec Google Authenticator

## Statistiques

- 30 nouveaux tests (27 TwoFactorService + 3 AuthService)
- Total tests: 374 (était 344)
