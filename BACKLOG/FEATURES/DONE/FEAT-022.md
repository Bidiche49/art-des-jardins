# FEAT-022: Tests e2e Interventions (start/stop)

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** tests, e2e, interventions, terrain
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le workflow interventions : pointage terrain, validation.

## Criteres d'acceptation

### POST /interventions/start/:chantierId
- [ ] Démarrer intervention → 201
- [ ] heureDebut set, heureFin null
- [ ] employeId depuis JWT
- [ ] Intervention déjà en cours → 400
- [ ] Chantier inexistant → 404

### PATCH /interventions/:id/stop
- [ ] Arrêter intervention → 200
- [ ] heureFin set
- [ ] dureeMinutes calculée automatiquement
- [ ] Intervention d'un autre employé → 403
- [ ] Intervention déjà terminée → 400
- [ ] Intervention inexistante → 404

### GET /interventions/en-cours
- [ ] Retourne intervention active de l'employé connecté
- [ ] Null si pas d'intervention en cours

### GET /interventions
- [ ] Liste paginée
- [ ] Filtre par chantierId
- [ ] Filtre par employeId
- [ ] Filtre par date range
- [ ] Filtre valide = true/false
- [ ] Filtre enCours = true

### GET /interventions/:id
- [ ] Intervention existante → 200 + relations
- [ ] Inclut chantier et employe
- [ ] Inexistante → 404

### POST /interventions
- [ ] Création manuelle → 201
- [ ] Avec heureDebut et heureFin → calcul durée
- [ ] Validation données → 400

### PUT /interventions/:id
- [ ] Update non validée → 200
- [ ] Recalcul durée si heures modifiées
- [ ] Update validée → 400

### PATCH /interventions/:id/valider
- [ ] Valider (patron) → 200
- [ ] Valider (employe) → 403

### DELETE /interventions/:id
- [ ] Suppression → 200
- [ ] Inexistante → 404

## Fichiers concernes

- `apps/api/test/interventions.e2e-spec.ts`

## Analyse / Approche

1. Setup avec chantier et 2 users (patron, employe)
2. Tester workflow start/stop complet
3. Tester contraintes (1 seule en cours)
4. Tester validation par patron

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Pointage terrain fonctionnel
