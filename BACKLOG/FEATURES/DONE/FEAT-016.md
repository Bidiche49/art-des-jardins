# FEAT-016: Tests unitaires ExportService

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** tests, api, export, data
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour ExportService : export CSV par table, export ZIP complet.

## Criteres d'acceptation

### Export CSV individuel
- [ ] Test export clients CSV
- [ ] Test export chantiers CSV
- [ ] Test export devis CSV
- [ ] Test export factures CSV
- [ ] Test export interventions CSV
- [ ] Test export users CSV (sans passwordHash)
- [ ] Test table inexistante (400)

### Format CSV
- [ ] Test headers corrects pour chaque table
- [ ] Test échappement caractères spéciaux (virgules, guillemets, newlines)
- [ ] Test dates au format ISO
- [ ] Test valeurs null gérées
- [ ] Test arrays (tags, photos) sérialisés correctement

### Export ZIP complet
- [ ] Test génération ZIP avec tous les CSV
- [ ] Test metadata.json inclus dans ZIP
- [ ] Test metadata contient date export et version
- [ ] Test ZIP lisible et extractible
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/export/export.service.spec.ts`

## Analyse / Approche

1. Mock PrismaService avec données de test
2. Tester génération CSV isolément
3. Tester génération ZIP avec archiver
4. Vérifier contenu du ZIP

## Tests de validation

- [ ] Tous les tests passent
- [ ] Export reversibilité fonctionnel
- [ ] Coverage export module > 90%
