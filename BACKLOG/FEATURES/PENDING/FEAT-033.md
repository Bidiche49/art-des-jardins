# FEAT-033: Vue calendrier interventions

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** calendar, pwa, interventions, ui
**Date creation:** 2026-01-29
**Phase:** 5.3

---

## Description

Ajouter une vue calendrier dans la PWA pour visualiser les interventions planifiees de l'equipe.

## User Story

**En tant que** patron ou employe
**Je veux** voir les interventions sur un calendrier
**Afin de** visualiser la charge de travail et planifier efficacement

## Criteres d'acceptation

- [ ] Vue calendrier mensuelle avec interventions
- [ ] Vue semaine detaillee
- [ ] Vue jour avec timeline
- [ ] Filtrage par employe
- [ ] Code couleur par type d'intervention ou employe
- [ ] Clic sur intervention = details/modification
- [ ] Navigation entre mois/semaines fluide

## Fichiers concernes

- `apps/pwa/src/pages/Calendar.tsx` - Page calendrier
- `apps/pwa/src/components/calendar/` - Composants calendrier
- `apps/pwa/src/api/interventions.ts` - Query par plage de dates
- `apps/pwa/src/App.tsx` - Route /calendar

## Analyse / Approche

Options de librairie calendrier:
1. **react-big-calendar** - Complet, style Google Calendar
2. **@fullcalendar/react** - Tres complet, premium features
3. **Custom** - Plus leger, controle total

Recommandation: `react-big-calendar` (MIT, bien maintenu, responsive)

## Tests de validation

- [ ] Affichage correct des interventions
- [ ] Navigation mois/semaine/jour
- [ ] Filtrage par employe fonctionne
- [ ] Performance OK avec beaucoup d'interventions
- [ ] Responsive mobile

## Dependencies

Aucune
