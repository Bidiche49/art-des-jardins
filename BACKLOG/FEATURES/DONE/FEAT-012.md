# FEAT-012: Tests unitaires DevisService

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** L
**Tags:** tests, api, devis, calculs
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour DevisService : CRUD, numérotation auto, calculs HT/TVA/TTC, workflow statuts.

## Criteres d'acceptation

### Numérotation automatique
- [ ] Test génération numéro DEV-YYYYMM-001
- [ ] Test incrémentation DEV-YYYYMM-002, 003...
- [ ] Test reset compteur nouveau mois
- [ ] Test création/update Sequence dans DB

### Calculs financiers
- [ ] Test calcul ligne: quantite * prixUnitaireHT = montantHT
- [ ] Test calcul TVA ligne: montantHT * tva / 100
- [ ] Test calcul TTC ligne: montantHT + TVA
- [ ] Test calcul totalHT (somme lignes)
- [ ] Test calcul totalTVA (somme TVA lignes)
- [ ] Test calcul totalTTC (somme TTC lignes)
- [ ] Test TVA par défaut 20%
- [ ] Test TVA custom par ligne

### CRUD et workflow
- [ ] Test create avec lignes
- [ ] Test findAll avec filtres (chantierId, statut, dates)
- [ ] Test findOne avec lignes incluses
- [ ] Test update en statut brouillon (autorisé)
- [ ] Test update en statut envoyé (interdit - 400)
- [ ] Test update statut brouillon → envoyé
- [ ] Test update statut envoyé → accepté (dateAcceptation set)
- [ ] Test update statut envoyé → refusé
- [ ] Test delete sans factures (autorisé)
- [ ] Test delete avec factures (interdit - 400)
- [ ] Test validité 30 jours par défaut
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/devis/devis.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService et Sequence
2. Créer helpers pour lignes de devis
3. Tester précision des calculs (décimales)
4. Vérifier workflow statuts strict

## Tests de validation

- [ ] Tous les tests passent
- [ ] Calculs financiers exacts (pas d'erreurs d'arrondi)
- [ ] Coverage devis module > 90%
