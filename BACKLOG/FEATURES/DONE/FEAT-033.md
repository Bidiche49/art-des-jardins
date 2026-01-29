# FEAT-033: Vue calendrier interventions

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** calendar, pwa, interventions, ui
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.3

---

## Description

Ajouter une vue calendrier dans la PWA pour visualiser les interventions planifiees de l'equipe.

## User Story

**En tant que** patron ou employe
**Je veux** voir les interventions sur un calendrier
**Afin de** visualiser la charge de travail et planifier efficacement

## Criteres d'acceptation

- [x] Vue calendrier mensuelle avec interventions
- [x] Vue semaine detaillee
- [x] Vue jour avec timeline
- [x] Vue agenda (liste)
- [x] Filtrage par employe
- [x] Code couleur par employe
- [x] Clic sur intervention = navigation vers details
- [x] Navigation entre mois/semaines fluide
- [x] Legende des couleurs par employe

## Fichiers crees/modifies

- `apps/pwa/src/pages/Calendar.tsx` - Page calendrier principale
- `apps/pwa/src/components/calendar/CalendarToolbar.tsx` - Toolbar navigation
- `apps/pwa/src/components/calendar/CalendarEvent.tsx` - Composant evenement
- `apps/pwa/src/components/calendar/index.ts` - Exports
- `apps/pwa/src/App.tsx` - Route /calendar
- `apps/pwa/src/components/layout/Layout.tsx` - Lien navigation
- `apps/pwa/package.json` - react-big-calendar + types

## Implementation

### Librairie: react-big-calendar
- MIT license, bien maintenu
- Support multi-vues (mois, semaine, jour, agenda)
- Localisation francaise avec date-fns
- Personnalisation facile des composants

### Fonctionnalites
- **Vues**: Mois, Semaine, Jour, Liste (agenda)
- **Navigation**: Aujourd'hui, Precedent/Suivant
- **Filtrage**: Par employe ou interventions non assignees
- **Couleurs**: 8 couleurs distinctes par employe
- **Legende**: Barre en bas avec correspondance couleur/employe

### API utilisee
- `interventionsApi.getAll()` avec plage de dates (mois -1 a +1)
- Charge jusqu'a 500 interventions pour la periode

## Tests de validation

- [x] Affichage correct des interventions
- [x] Navigation mois/semaine/jour
- [x] Filtrage par employe fonctionne
- [x] Clic sur evenement navigue vers intervention
- [x] Responsive (styles adaptes)

## Dependencies

Aucune
