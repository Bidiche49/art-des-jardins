# FEAT-034: Drag & drop planification

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** calendar, drag-drop, interventions, ux
**Date creation:** 2026-01-29
**Phase:** 5.3

---

## Description

Permettre de planifier et replanifier les interventions par drag & drop sur le calendrier.

## User Story

**En tant que** patron
**Je veux** deplacer les interventions par glisser-deposer
**Afin de** reorganiser rapidement le planning

## Criteres d'acceptation

- [ ] Drag & drop pour changer la date d'une intervention
- [ ] Drag & drop pour changer l'heure
- [ ] Resize pour modifier la duree
- [ ] Assigner a un employe par drop sur sa colonne
- [ ] Confirmation avant modification
- [ ] Annulation possible (undo)
- [ ] Restriction aux utilisateurs autorises (patron)

## Fichiers concernes

- `apps/pwa/src/components/calendar/` - Composants DnD
- `apps/api/src/modules/interventions/` - Endpoint update rapide
- `apps/pwa/src/stores/interventions.ts` - Optimistic update

## Analyse / Approche

1. Utiliser les fonctionnalites DnD natives de react-big-calendar
2. Implementer optimistic updates pour UX fluide
3. Rollback si erreur API
4. Toast de confirmation avec bouton Annuler

## Tests de validation

- [ ] Drag change la date correctement
- [ ] Resize change la duree
- [ ] Changement d'employe fonctionne
- [ ] Rollback si erreur API
- [ ] Seul le patron peut modifier

## Dependencies

- FEAT-033 (Vue calendrier)
