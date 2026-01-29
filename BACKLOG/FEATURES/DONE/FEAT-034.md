# FEAT-034: Drag & drop planification

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** calendar, drag-drop, interventions, ux
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.3

---

## Description

Permettre de planifier et replanifier les interventions par drag & drop sur le calendrier.

## User Story

**En tant que** patron
**Je veux** deplacer les interventions par glisser-deposer
**Afin de** reorganiser rapidement le planning

## Criteres d'acceptation

- [x] Drag & drop pour changer la date d'une intervention
- [x] Drag & drop pour changer l'heure
- [x] Resize pour modifier la duree
- [ ] Assigner a un employe par drop sur sa colonne (necessite vue par ressource)
- [x] Confirmation avant modification (toast avec feedback)
- [x] Annulation possible (undo) - bouton Annuler dans toast pendant 5s
- [x] Restriction aux utilisateurs autorises (patron)

## Implementation

### Approche technique

1. HOC `withDragAndDrop` de react-big-calendar pour activer DnD
2. Handlers `onEventDrop` et `onEventResize` pour capturer les modifications
3. Optimistic update immediat dans le state local
4. Toast avec bouton "Annuler" pendant 5 secondes
5. Appel API apres 3 secondes (permet undo avant)
6. Rollback automatique si erreur API
7. `draggableAccessor` et `resizableAccessor` retournent `true` uniquement pour role `patron`

### Fichiers modifies

- `apps/pwa/src/pages/Calendar.tsx` - Ajout DnD handlers
- `apps/pwa/src/pages/Calendar.test.tsx` - Tests unitaires (12 tests)

## Tests de validation

- [x] Drag change la date correctement
- [x] Resize change la duree
- [x] Rollback si erreur API
- [x] Seul le patron peut modifier
- [x] Tests unitaires passent (12 tests)

## Dependencies

- FEAT-033 (Vue calendrier) - DONE

## Notes

- L'assignation d'employe par drop necessite une vue "ressource" (colonne par employe) qui pourrait etre ajoutee dans un ticket futur
- Le delai de 3s avant appel API offre une fenetre d'annulation confortable
