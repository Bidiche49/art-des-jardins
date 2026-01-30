# FEAT-044: Rapports d'activité

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** api, analytics, activity
**Date creation:** 2026-01-30

---

## Description

Rapports d'activité opérationnelle : interventions par employé, par type, taux de complétion, temps passé, productivité équipe.

---

## User Story

**En tant que** associé de l'entreprise
**Je veux** analyser l'activité opérationnelle de l'équipe
**Afin de** optimiser la planification et identifier les axes d'amélioration

---

## Criteres d'acceptation

- [ ] Page `/analytics/activity` avec rapports d'activité
- [ ] Rapport interventions par employé (nombre, durée, types)
- [ ] Rapport interventions par type de prestation
- [ ] Taux de complétion (réalisées vs planifiées)
- [ ] Temps moyen par type d'intervention
- [ ] Graphique charge de travail par employé
- [ ] Calendrier heatmap de l'activité
- [ ] Export PDF et Excel
- [ ] Endpoints API dédiés
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/analytics/activity-reports.service.ts`
- `apps/api/src/modules/analytics/activity-reports.controller.ts`
- `apps/pwa/src/pages/analytics/ActivityReports.tsx`
- `apps/pwa/src/components/analytics/ActivityCharts.tsx`
- `apps/pwa/src/components/analytics/HeatmapCalendar.tsx`

---

## Approche proposee

1. Service calculs activité basé sur Interventions
2. Agrégations par employé, type, période
3. Composant heatmap calendrier (style GitHub contributions)
4. Graphiques barres et camemberts
5. Export PDF/Excel réutilisant les composants de FEAT-043

---

## Tests de validation

- [ ] Statistiques par employé exactes
- [ ] Heatmap affiche correctement l'intensité
- [ ] Filtres période fonctionnent
- [ ] Export contient toutes les données
- [ ] Performance acceptable
