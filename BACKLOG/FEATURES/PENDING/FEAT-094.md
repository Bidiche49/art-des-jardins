# FEAT-094: [Flutter] Phase 11 - Dashboard + Analytics + Finance

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** mobile, flutter, dashboard, analytics, charts
**Date creation:** 2026-02-10

---

## Description

Dashboard avec KPI cards et graphiques, page analytics avec selecteur annee, rapports financiers avec 4 tabs.

## User Story

**En tant que** patron
**Je veux** voir les stats de l'entreprise et les rapports financiers
**Afin de** prendre des decisions basees sur les donnees

## Criteres d'acceptation

- [ ] Dashboard : 4 KPI cards, graphique CA mensuel, interventions a venir, alerte impayes
- [ ] Analytics : KPI cards, revenue chart, selecteur annee
- [ ] Finance : 4 tabs (Resume, Par client, Impayes, Previsionnel)
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests DashboardProvider (~10 tests)
- [ ] Chargement stats OK -> 4 KPI affiches
- [ ] clientsTotal correct
- [ ] chantiersEnCours correct
- [ ] devisEnAttente correct
- [ ] caMois correct
- [ ] Interventions 7 jours filtrees correctement
- [ ] Factures impayees detectees
- [ ] Erreur API -> fallback cache ou erreur
- [ ] Refresh force recharge les stats
- [ ] Stats formatees pour affichage (EUR, %)

### Unit tests AnalyticsProvider (~8 tests)
- [ ] Chargement KPI par annee
- [ ] Changement annee -> reload
- [ ] Revenue data pour graphique (12 mois)
- [ ] Mois sans donnees -> 0
- [ ] Stats activite (nombre interventions, devis, etc.)
- [ ] Comparaison annee N vs N-1
- [ ] Calcul pourcentage evolution
- [ ] Annee invalide -> erreur

### Unit tests FinanceProvider (~10 tests)
- [ ] Tab Resume : totaux CA, depenses, marge
- [ ] Tab Par client : ventilation par client
- [ ] Tab Impayes : liste factures impayees
- [ ] Tab Previsionnel : devis en attente = potentiel
- [ ] Calcul total impayes correct
- [ ] Tri par montant decroissant
- [ ] Filtre par periode
- [ ] Formatage EUR correct
- [ ] Calcul marge brute et nette
- [ ] Donnees vides -> affiche 0

### Widget tests (~10 tests)
- [ ] DashboardPage : 4 cards KPI visibles
- [ ] DashboardPage : graphique barres CA
- [ ] DashboardPage : liste interventions a venir
- [ ] DashboardPage : alerte impayes si > 0
- [ ] AnalyticsPage : selecteur annee fonctionne
- [ ] AnalyticsPage : revenue chart affiche
- [ ] FinancePage : 4 tabs navigables
- [ ] FinancePage : tableaux de donnees
- [ ] Montants formates en EUR
- [ ] Loading shimmer pendant chargement

**Total attendu : ~38 tests**

## Fichiers concernes

- `lib/features/dashboard/`
- `lib/features/analytics/`
