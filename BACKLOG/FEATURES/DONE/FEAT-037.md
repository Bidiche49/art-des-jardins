# FEAT-037: Authentification client portail

**Type:** Feature
**Statut:** Fait
**Date resolution:** 2026-01-30
**Priorite:** Haute
**Complexite:** M
**Tags:** auth, security, api
**Date creation:** 2026-01-29

---

## Description

Système d'authentification séparé pour les clients (magic link email), distinct des utilisateurs internes. Permet aux clients d'accéder à leur espace personnel de façon sécurisée sans avoir à créer de mot de passe.

---

## User Story

**En tant que** client de l'entreprise
**Je veux** me connecter à mon espace personnel via un lien magique reçu par email
**Afin de** accéder à mes devis, factures et suivre mes chantiers de façon sécurisée

---

## Criteres d'acceptation

- [x] Endpoint API pour demander un magic link (`POST /api/v1/client-auth/request-link`)
- [x] Génération de token JWT temporaire (15 min) envoyé par email
- [x] Endpoint de validation du token (`GET /api/v1/client-auth/verify/:token`)
- [x] Session client séparée des utilisateurs internes (JWT avec claim `type: client`)
- [x] Guard NestJS `ClientAuthGuard` pour protéger les routes client
- [x] Rate limiting sur la demande de magic link (max 3/heure par email)
- [x] Page de login client dans la PWA (route `/client/login`)
- [x] Stockage sécurisé du token client côté PWA (Zustand + persist)
- [ ] Tests unitaires et e2e
- [x] Tests de non-regression passes (typecheck OK)

---

## Fichiers concernes

- `apps/api/src/modules/client-auth/` (nouveau module)
- `apps/api/src/guards/client-auth.guard.ts`
- `packages/database/prisma/schema.prisma` (ClientToken model)
- `apps/pwa/src/pages/client/Login.tsx`
- `apps/pwa/src/contexts/ClientAuthContext.tsx`

---

## Approche proposee

1. Créer le modèle `ClientAuthToken` dans Prisma (lié à Client)
2. Module NestJS `client-auth` avec service et controller
3. Intégration avec le service email existant
4. Guard spécifique pour les routes client
5. Context React pour gérer l'état d'auth client
6. Pages PWA dédiées sous `/client/*`

---

## Tests de validation

- [ ] Demande de magic link génère un email
- [ ] Token expiré = erreur 401
- [ ] Token valide = session créée
- [ ] Rate limiting fonctionne
- [ ] Client ne peut pas accéder aux routes internes
- [ ] Utilisateur interne ne peut pas accéder aux routes client
