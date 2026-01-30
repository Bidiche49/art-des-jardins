# FEAT-045: Exports statistiques avancés

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** api, analytics, export
**Date creation:** 2026-01-30

---

## Description

Système d'export avancé permettant de générer des rapports personnalisés avec sélection des métriques, période, et format de sortie.

---

## User Story

**En tant que** associé de l'entreprise
**Je veux** créer des exports personnalisés avec les métriques de mon choix
**Afin de** répondre à des besoins spécifiques (comptable, banque, analyse)

---

## Criteres d'acceptation

- [ ] Page `/analytics/export` avec assistant d'export
- [ ] Sélection des métriques à inclure (checkboxes)
- [ ] Sélection de la période (prédéfinie ou personnalisée)
- [ ] Choix du format (PDF, Excel, CSV)
- [ ] Prévisualisation avant export
- [ ] Historique des exports générés
- [ ] Possibilité de sauvegarder un "template" d'export
- [ ] Endpoint API `POST /api/v1/analytics/export`
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/analytics/export.service.ts`
- `apps/api/src/modules/analytics/export.controller.ts`
- `apps/pwa/src/pages/analytics/ExportWizard.tsx`
- `apps/pwa/src/components/analytics/MetricSelector.tsx`
- `apps/pwa/src/components/analytics/ExportPreview.tsx`

---

## Approche proposee

1. Wizard multi-étapes pour guider l'utilisateur
2. Configuration JSON des métriques disponibles
3. Service d'export générique appelant les services existants
4. Stockage templates en base (ExportTemplate model)
5. Génération asynchrone pour gros exports (job queue)

---

## Tests de validation

- [ ] Tous les formats d'export fonctionnent
- [ ] Templates sauvegardés et rechargés correctement
- [ ] Prévisualisation reflète l'export final
- [ ] Gros exports ne timeout pas
- [ ] Historique accessible et téléchargeable
