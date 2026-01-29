# FEAT-013: Tests unitaires FacturesService

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** tests, api, factures, calculs
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour FacturesService : création depuis devis, numérotation, paiements, retards.

## Criteres d'acceptation

### Création depuis devis
- [ ] Test createFromDevis avec devis accepté (OK)
- [ ] Test createFromDevis avec devis brouillon (400)
- [ ] Test createFromDevis avec devis refusé (400)
- [ ] Test copie des lignes depuis devis
- [ ] Test copie des totaux (HT, TVA, TTC)
- [ ] Test génération numéro FAC-YYYYMM-XXX

### Numérotation automatique
- [ ] Test génération numéro FAC-YYYYMM-001
- [ ] Test incrémentation séparée des devis
- [ ] Test reset compteur nouveau mois

### Paiements
- [ ] Test marquerPayee avec mode paiement
- [ ] Test marquerPayee set datePaiement
- [ ] Test marquerPayee set statut = payee
- [ ] Test marquerPayee avec référence paiement

### Retards
- [ ] Test filtre enRetard = true (dateEcheance < now && statut != payee)
- [ ] Test filtre enRetard = false
- [ ] Test délai paiement 30 jours par défaut

### CRUD
- [ ] Test findAll avec filtres (devisId, clientId, statut, dates)
- [ ] Test findOne avec lignes et devis inclus
- [ ] Test update mentions légales
- [ ] Test delete facture brouillon (autorisé)
- [ ] Test delete facture payée (interdit - 400)
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/factures/factures.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService et DevisService
2. Mock Sequence pour numérotation
3. Tester les transitions de statut
4. Vérifier calcul dateEcheance

## Tests de validation

- [ ] Tous les tests passent
- [ ] Coverage factures module > 90%
