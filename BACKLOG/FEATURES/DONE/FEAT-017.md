# FEAT-017: Tests e2e Auth flow

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** tests, e2e, auth, security
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le flow d'authentification via HTTP.

## Criteres d'acceptation

### Login
- [ ] POST /auth/login avec credentials valides → 200 + tokens
- [ ] POST /auth/login avec email inexistant → 401
- [ ] POST /auth/login avec mauvais password → 401
- [ ] POST /auth/login avec user inactif → 401
- [ ] POST /auth/login sans body → 400

### Token refresh
- [ ] POST /auth/refresh avec token valide → 200 + nouveaux tokens
- [ ] POST /auth/refresh avec token expiré → 401
- [ ] POST /auth/refresh avec token invalide → 401
- [ ] POST /auth/refresh sans token → 400

### Routes protégées
- [ ] GET /clients sans token → 401
- [ ] GET /clients avec token valide → 200
- [ ] GET /clients avec token expiré → 401
- [ ] GET /clients avec token malformé → 401

### Rôles
- [ ] DELETE /clients/:id avec role patron → 200
- [ ] DELETE /clients/:id avec role employe → 403
- [ ] GET /audit avec role patron → 200
- [ ] GET /audit avec role employe → 403

### Route publique
- [ ] GET /health sans token → 200

## Fichiers concernes

- `apps/api/test/auth.e2e-spec.ts`

## Analyse / Approche

1. Setup TestingModule avec base de données test
2. Seed users (patron + employe) avant tests
3. Utiliser supertest pour requêtes HTTP
4. Nettoyer DB après tests

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Tests isolés (pas d'effets de bord)
