# FEAT-042: Dashboard analytics KPI

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** L
**Tags:** ui, api, analytics, dashboard
**Date creation:** 2026-01-30

---

## Description

Dashboard analytique avancé pour les associés, affichant les KPIs clés de l'entreprise : chiffre d'affaires, taux de conversion devis, interventions, productivité.

---

## User Story

**En tant que** associé de l'entreprise
**Je veux** visualiser les KPIs de l'activité sur un dashboard
**Afin de** piloter l'entreprise avec des données concrètes

---

## Criteres d'acceptation

- [ ] Page `/analytics` accessible aux associés uniquement
- [ ] KPI Chiffre d'affaires (mois en cours, cumul annuel, comparaison N-1)
- [ ] KPI Taux de conversion devis (nombre, montant)
- [ ] KPI Interventions (réalisées, planifiées, annulées)
- [ ] KPI Clients (nouveaux, actifs, total)
- [ ] Graphiques interactifs (évolution mensuelle)
- [ ] Filtres par période (mois, trimestre, année, personnalisé)
- [ ] Endpoint API `GET /api/v1/analytics/dashboard`
- [ ] Cache des calculs (invalidation intelligente)
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/analytics/`
- `apps/pwa/src/pages/Analytics.tsx`
- `apps/pwa/src/components/analytics/KPICard.tsx`
- `apps/pwa/src/components/analytics/Charts.tsx`

---

## Approche proposee

1. Module analytics avec service de calcul des métriques
2. Queries SQL optimisées avec agrégations
3. Cache Redis ou in-memory pour les calculs lourds
4. Bibliothèque charts (Recharts ou Chart.js)
5. Composants KPI cards réutilisables

---

## Tests de validation

- [ ] KPIs calculés correctement
- [ ] Graphiques s'affichent sans erreur
- [ ] Filtres période fonctionnent
- [ ] Performance < 2s pour le chargement
- [ ] Accès restreint aux associés
