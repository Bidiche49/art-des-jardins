# FEAT-021: Tests e2e Factures workflow

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** tests, e2e, factures, workflow
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le workflow factures : création depuis devis, paiements, retards.

## Criteres d'acceptation

### POST /factures/from-devis/:devisId
- [ ] Depuis devis accepté → 201
- [ ] Numéro auto-généré FAC-YYYYMM-XXX
- [ ] Lignes copiées depuis devis
- [ ] Totaux identiques au devis
- [ ] Délai paiement 30 jours par défaut
- [ ] Depuis devis brouillon → 400
- [ ] Depuis devis refusé → 400
- [ ] Devis inexistant → 404

### GET /factures
- [ ] Liste paginée
- [ ] Filtre par devisId
- [ ] Filtre par clientId
- [ ] Filtre par statut
- [ ] Filtre par date range
- [ ] Filtre enRetard = true
- [ ] Recherche sur numéro

### GET /factures/:id
- [ ] Facture existante → 200 + lignes + devis
- [ ] Facture inexistante → 404

### PUT /factures/:id
- [ ] Update mentions légales → 200
- [ ] Update notes → 200
- [ ] Facture inexistante → 404

### PATCH /factures/:id/payer
- [ ] Marquer payée → 200
- [ ] datePaiement set à maintenant
- [ ] modePaiement set
- [ ] referencePaiement optionnel
- [ ] Facture déjà payée → 400

### DELETE /factures/:id
- [ ] Facture brouillon → 200
- [ ] Facture payée → 400
- [ ] Inexistante → 404

### Retards
- [ ] Facture en retard (dateEcheance passée, non payée) → filtre fonctionne
- [ ] Facture à jour (dateEcheance future) → pas dans filtre

## Fichiers concernes

- `apps/api/test/factures.e2e-spec.ts`

## Analyse / Approche

1. Setup avec devis accepté
2. Tester création depuis devis
3. Tester workflow paiement
4. Tester détection retards

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Workflow paiement correct
