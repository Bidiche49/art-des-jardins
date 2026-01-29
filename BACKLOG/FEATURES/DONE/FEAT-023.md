# FEAT-023: Tests e2e Audit logging

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, e2e, audit, security
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le système d'audit : logging automatique, consultation, export.

## Criteres d'acceptation

### Logging automatique
- [ ] POST /clients crée un log CREATE
- [ ] PUT /clients/:id crée un log UPDATE
- [ ] DELETE /clients/:id crée un log DELETE
- [ ] Log contient userId de l'auteur
- [ ] Log contient entité (Client)
- [ ] Log contient entiteId
- [ ] Log contient IP address
- [ ] Log contient User-Agent
- [ ] Log ne contient PAS de passwords

### GET /audit (patron only)
- [ ] Liste paginée → 200
- [ ] Filtre par userId
- [ ] Filtre par action (CREATE, UPDATE, DELETE)
- [ ] Filtre par entite
- [ ] Filtre par date range
- [ ] Accès employe → 403

### GET /audit/export/csv (patron only)
- [ ] Export CSV → 200
- [ ] Headers corrects
- [ ] Données formatées
- [ ] Accès employe → 403

### Sanitization
- [ ] password dans body → remplacé par ***
- [ ] passwordHash → non visible
- [ ] token/refreshToken → non visible

## Fichiers concernes

- `apps/api/test/audit.e2e-spec.ts`

## Analyse / Approche

1. Effectuer des actions CRUD sur différentes entités
2. Vérifier logs créés automatiquement
3. Tester filtres et export
4. Vérifier sanitization données sensibles

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Audit trail complet
- [ ] Données sensibles protégées
