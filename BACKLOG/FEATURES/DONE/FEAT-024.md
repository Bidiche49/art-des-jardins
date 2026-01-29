# FEAT-024: Tests e2e Export

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** tests, e2e, export, data
**Date creation:** 2026-01-25

---

## Description

Tests end-to-end complets pour le module export : CSV individuels et ZIP complet.

## Criteres d'acceptation

### GET /export/:table (patron only)
- [ ] Export clients CSV → 200
- [ ] Export chantiers CSV → 200
- [ ] Export devis CSV → 200
- [ ] Export factures CSV → 200
- [ ] Export interventions CSV → 200
- [ ] Export users CSV (sans passwordHash) → 200
- [ ] Table invalide → 400
- [ ] Accès employe → 403

### Format CSV
- [ ] Content-Type: text/csv
- [ ] Headers corrects pour chaque table
- [ ] Données échappées correctement
- [ ] Dates au format ISO

### GET /export/zip (patron only)
- [ ] Export ZIP → 200
- [ ] Content-Type: application/zip
- [ ] ZIP contient tous les CSV
- [ ] ZIP contient metadata.json
- [ ] Accès employe → 403

### Contenu export
- [ ] Données complètes exportées
- [ ] Relations incluses (IDs)
- [ ] Arrays sérialisés (tags, photos)
- [ ] passwordHash NON inclus dans users

## Fichiers concernes

- `apps/api/test/export.e2e-spec.ts`

## Analyse / Approche

1. Seed données dans toutes les tables
2. Tester export de chaque table
3. Vérifier contenu des CSV
4. Tester et extraire le ZIP

## Tests de validation

- [ ] Tous les tests e2e passent
- [ ] Export réversibilité fonctionnel
