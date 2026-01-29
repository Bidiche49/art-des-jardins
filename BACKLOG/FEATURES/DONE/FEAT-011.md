# FEAT-011: Tests unitaires ChantiersService

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, api, chantiers
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour ChantiersService : CRUD, filtres, gestion des statuts, relations.

## Criteres d'acceptation

- [ ] Test findAll avec pagination
- [ ] Test findAll filtre par clientId
- [ ] Test findAll filtre par statut (lead, en_cours, termine, etc.)
- [ ] Test findAll filtre par responsableId
- [ ] Test findAll filtre par ville
- [ ] Test findAll recherche full-text
- [ ] Test findOne avec includes (client, responsable, devis, interventions)
- [ ] Test findOne inexistant (404)
- [ ] Test create avec client existant
- [ ] Test create avec client inexistant (400)
- [ ] Test create avec responsable optionnel
- [ ] Test create avec coordonnées GPS
- [ ] Test create avec types de prestation multiples
- [ ] Test update statut (workflow valide)
- [ ] Test update chantier inexistant (404)
- [ ] Test delete existant
- [ ] Test delete avec devis liés (cascade)
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/chantiers/chantiers.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService
2. Mock vérification existence client
3. Tester tous les filtres combinés
4. Vérifier les includes dans findOne

## Tests de validation

- [ ] Tous les tests passent
- [ ] Coverage chantiers module > 90%
