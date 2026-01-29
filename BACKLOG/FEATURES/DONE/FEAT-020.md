# FEAT-020: Tests e2e Devis workflow

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** tests, e2e, devis, workflow
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le workflow devis : création, calculs, transitions de statut.

## Criteres d'acceptation

### GET /devis
- [ ] Liste paginée
- [ ] Filtre par chantierId
- [ ] Filtre par clientId (via chantier)
- [ ] Filtre par statut
- [ ] Filtre par date range
- [ ] Recherche sur numéro

### GET /devis/:id
- [ ] Devis existant → 200 + lignes
- [ ] Inclut chantier et client
- [ ] Devis inexistant → 404

### POST /devis
- [ ] Création avec lignes → 201
- [ ] Numéro auto-généré DEV-YYYYMM-XXX
- [ ] Calculs HT/TVA/TTC corrects
- [ ] Validité 30 jours par défaut
- [ ] Statut initial = brouillon
- [ ] Chantier inexistant → 400
- [ ] Lignes invalides → 400

### PUT /devis/:id
- [ ] Update en brouillon → 200
- [ ] Recalcul totaux automatique
- [ ] Update hors brouillon → 400
- [ ] Devis inexistant → 404

### PATCH /devis/:id/statut
- [ ] brouillon → envoye → 200
- [ ] envoye → accepte → 200 (dateAcceptation set)
- [ ] envoye → refuse → 200
- [ ] accepte → autre → 400 (irréversible)

### DELETE /devis/:id
- [ ] Sans factures → 200
- [ ] Avec factures → 400
- [ ] Inexistant → 404

### Calculs (edge cases)
- [ ] Ligne avec quantité décimale (2.5)
- [ ] Ligne avec TVA custom (10%, 5.5%)
- [ ] Multiple lignes → somme correcte
- [ ] Précision décimales (pas d'erreur arrondi)

## Fichiers concernes

- `apps/api/test/devis.e2e-spec.ts`

## Analyse / Approche

1. Setup avec chantier de test
2. Tester workflow complet
3. Vérifier calculs avec précision
4. Tester toutes les transitions

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Calculs financiers exacts
