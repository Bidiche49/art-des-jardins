# FEAT-043: Rapports financiers

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** api, analytics, finance, export
**Date creation:** 2026-01-30

---

## Description

Génération de rapports financiers détaillés : CA par période, par client, par type de prestation, marges, impayés, prévisionnel.

---

## User Story

**En tant que** associé de l'entreprise
**Je veux** générer des rapports financiers détaillés
**Afin de** analyser la santé financière et préparer la comptabilité

---

## Criteres d'acceptation

- [ ] Page `/analytics/finance` avec rapports financiers
- [ ] Rapport CA par période (jour/semaine/mois/année)
- [ ] Rapport CA par client (top clients, répartition)
- [ ] Rapport CA par type de prestation
- [ ] Rapport impayés (factures en retard, montants)
- [ ] Rapport prévisionnel (devis acceptés non facturés)
- [ ] Export PDF de chaque rapport
- [ ] Export Excel/CSV des données brutes
- [ ] Endpoints API dédiés
- [ ] Tests unitaires et e2e
- [ ] Tests de non-regression passes

---

## Fichiers concernes

- `apps/api/src/modules/analytics/finance-reports.service.ts`
- `apps/api/src/modules/analytics/finance-reports.controller.ts`
- `apps/pwa/src/pages/analytics/FinanceReports.tsx`
- `apps/pwa/src/components/analytics/ReportTable.tsx`

---

## Approche proposee

1. Service dédié aux calculs financiers
2. Queries SQL avec GROUP BY et agrégations
3. Génération PDF avec pdfkit ou puppeteer
4. Export Excel avec exceljs
5. Composants tableau avec tri et filtres

---

## Tests de validation

- [ ] Calculs financiers exacts (vérification manuelle)
- [ ] Export PDF lisible et complet
- [ ] Export Excel importable dans logiciel compta
- [ ] Filtres fonctionnent correctement
- [ ] Performance acceptable sur gros volumes
