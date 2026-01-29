# FEAT-018: Tests e2e CRUD Clients

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, e2e, clients
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le CRUD clients via HTTP.

## Criteres d'acceptation

### GET /clients
- [ ] Liste paginée par défaut (page 1, limit 10)
- [ ] Pagination custom (page 2, limit 5)
- [ ] Filtre par type=particulier
- [ ] Filtre par type=professionnel
- [ ] Filtre par ville
- [ ] Recherche full-text sur nom
- [ ] Recherche full-text sur email
- [ ] Combinaison filtres

### GET /clients/:id
- [ ] Client existant → 200 + données complètes
- [ ] Client inexistant → 404
- [ ] Inclut les 10 derniers chantiers

### POST /clients
- [ ] Création client particulier → 201
- [ ] Création client professionnel avec raisonSociale → 201
- [ ] Création client syndic → 201
- [ ] Validation email format → 400
- [ ] Validation téléphone format → 400
- [ ] Champs requis manquants → 400

### PUT /clients/:id
- [ ] Update complet → 200
- [ ] Update partiel → 200
- [ ] Client inexistant → 404
- [ ] Validation données → 400

### DELETE /clients/:id
- [ ] Suppression (patron) → 200
- [ ] Suppression (employe) → 403
- [ ] Client inexistant → 404
- [ ] Cascade delete chantiers liés

## Fichiers concernes

- `apps/api/test/clients.e2e-spec.ts`

## Analyse / Approche

1. Setup avec auth tokens (patron + employe)
2. Créer clients de test dans beforeEach
3. Tester chaque endpoint exhaustivement
4. Nettoyer après chaque test

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Tests isolés et reproductibles
