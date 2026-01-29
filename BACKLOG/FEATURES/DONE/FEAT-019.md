# FEAT-019: Tests e2e CRUD Chantiers

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, e2e, chantiers
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le CRUD chantiers via HTTP.

## Criteres d'acceptation

### GET /chantiers
- [ ] Liste paginée par défaut
- [ ] Filtre par clientId
- [ ] Filtre par statut (lead, en_cours, termine)
- [ ] Filtre par responsableId
- [ ] Filtre par ville
- [ ] Recherche full-text
- [ ] Combinaison filtres

### GET /chantiers/:id
- [ ] Chantier existant → 200 + relations
- [ ] Inclut client, responsable, devis, interventions
- [ ] Chantier inexistant → 404

### POST /chantiers
- [ ] Création avec client existant → 201
- [ ] Création avec client inexistant → 400
- [ ] Création avec responsable optionnel → 201
- [ ] Création avec coordonnées GPS → 201
- [ ] Création avec types prestation multiples → 201
- [ ] Validation données → 400

### PUT /chantiers/:id
- [ ] Update complet → 200
- [ ] Update partiel → 200
- [ ] Chantier inexistant → 404

### PATCH /chantiers/:id/statut
- [ ] Changement statut valide → 200
- [ ] Workflow lead → visite_planifiee → devis_envoye → accepte

### DELETE /chantiers/:id
- [ ] Suppression → 200
- [ ] Cascade delete devis et interventions
- [ ] Chantier inexistant → 404

## Fichiers concernes

- `apps/api/test/chantiers.e2e-spec.ts`

## Analyse / Approche

1. Setup avec client de test créé
2. Tester lifecycle complet d'un chantier
3. Vérifier les relations chargées

## Tests de validation

- [ ] Tous les tests e2e passent
