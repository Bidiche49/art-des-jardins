# FEAT-106: Integrer monitoring erreurs Sentry

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** api, pwa, infra
**Date creation:** 2026-02-12

---

## Description

Aucun systeme de monitoring d'erreurs en place. Les bugs en production ne sont pas detectes. Le debugging se fait uniquement via les logs Pino (difficiles a exploiter). Sentry est la solution standard pour le monitoring d'erreurs Node.js + React.

## User Story

**En tant que** developpeur/mainteneur
**Je veux** etre alerte automatiquement des erreurs en production
**Afin de** corriger les bugs rapidement avant qu'ils n'impactent les utilisateurs

## Criteres d'acceptation

- [ ] Compte Sentry cree (plan gratuit = 5k events/mois)
- [ ] SDK Sentry installe dans l'API NestJS
- [ ] SDK Sentry installe dans la PWA React
- [ ] Source maps uploadees pour le debugging
- [ ] Erreurs non-catchees remontees automatiquement
- [ ] Environnement (dev/staging/prod) visible dans Sentry
- [ ] Alerte email configuree pour erreurs critiques
- [ ] Sentry desactive en local (import.meta.env.DEV / NODE_ENV)

## Fichiers concernes

- `apps/api/src/main.ts` - init Sentry API
- `apps/api/package.json` - @sentry/nestjs
- `apps/pwa/src/main.tsx` - init Sentry PWA
- `apps/pwa/package.json` - @sentry/react
- `apps/pwa/vite.config.ts` - source maps upload
- `.env.example` - SENTRY_DSN

## Analyse / Approche

### API (NestJS)
```typescript
// apps/api/src/main.ts
import * as Sentry from '@sentry/nestjs';

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}
```

### PWA (React)
```typescript
// apps/pwa/src/main.tsx
import * as Sentry from '@sentry/react';

if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
}
```

## Tests de validation

- [ ] Provoquer une erreur en dev → pas d'envoi Sentry
- [ ] Provoquer une erreur en prod → visible dans dashboard Sentry
- [ ] Source maps fonctionnent (stack trace lisible dans Sentry)
- [ ] Build OK (pas d'erreur d'import)
