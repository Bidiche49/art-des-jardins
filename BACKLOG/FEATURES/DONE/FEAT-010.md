# FEAT-010: Tests unitaires ClientsService

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, api, clients
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour ClientsService : CRUD, pagination, filtres, recherche full-text.

## Criteres d'acceptation

- [ ] Test findAll avec pagination (page, limit)
- [ ] Test findAll avec filtre type (particulier, pro, syndic)
- [ ] Test findAll avec filtre ville
- [ ] Test findAll avec recherche full-text (nom, prenom, email, raisonSociale)
- [ ] Test findOne existant
- [ ] Test findOne inexistant (404)
- [ ] Test create client particulier
- [ ] Test create client professionnel avec raisonSociale
- [ ] Test create client syndic
- [ ] Test create avec email dupliqué (si contrainte)
- [ ] Test update complet
- [ ] Test update partiel
- [ ] Test update client inexistant (404)
- [ ] Test delete existant
- [ ] Test delete inexistant (404)
- [ ] Test delete avec chantiers liés (comportement cascade)
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/clients/clients.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService avec toutes les méthodes (findMany, findUnique, create, update, delete)
2. Créer fixtures de clients pour chaque type
3. Tester la construction des filtres Prisma
4. Vérifier le format de retour avec pagination

## Tests de validation

- [ ] Tous les tests passent
- [ ] Coverage clients module > 90%
