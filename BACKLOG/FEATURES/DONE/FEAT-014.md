# FEAT-014: Tests unitaires InterventionsService

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, api, interventions, terrain
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour InterventionsService : CRUD, start/stop, calcul durée, validation.

## Criteres d'acceptation

### Start/Stop
- [ ] Test start intervention (heureDebut set, heureFin null)
- [ ] Test start avec intervention déjà en cours (400)
- [ ] Test stop intervention (heureFin set)
- [ ] Test stop calcule dureeMinutes automatiquement
- [ ] Test stop intervention d'un autre employé (403)
- [ ] Test stop intervention déjà terminée (400)
- [ ] Test getEnCours retourne intervention active de l'employé

### Calcul durée
- [ ] Test calcul durée simple (1h = 60 min)
- [ ] Test calcul durée avec minutes (1h30 = 90 min)
- [ ] Test recalcul durée sur update heures

### CRUD
- [ ] Test create avec employeId depuis JWT
- [ ] Test findAll filtre par chantierId
- [ ] Test findAll filtre par employeId
- [ ] Test findAll filtre par date range
- [ ] Test findAll filtre valide = true/false
- [ ] Test findAll filtre enCours = true
- [ ] Test findOne avec chantier et employe inclus
- [ ] Test update intervention non validée (OK)
- [ ] Test update intervention validée (interdit - 400)
- [ ] Test delete intervention

### Validation
- [ ] Test valider intervention (patron only - testé dans e2e)
- [ ] Test valider set valide = true
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/interventions/interventions.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService
2. Mock user context pour employeId
3. Tester logique start/stop stricte
4. Vérifier calculs durée précis

## Tests de validation

- [ ] Tous les tests passent
- [ ] Coverage interventions module > 90%
