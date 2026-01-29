# FEAT-036: Export calendrier iCal

**Type:** Feature
**Statut:** Fait
**Priorite:** Basse
**Complexite:** S
**Tags:** calendar, export, ical
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.3

---

## Description

Permettre l'export du calendrier au format iCal pour synchronisation avec les agendas externes (Google Calendar, Outlook, Apple Calendar).

## User Story

**En tant que** employe
**Je veux** synchroniser mes interventions avec mon agenda personnel
**Afin de** tout avoir au meme endroit

## Criteres d'acceptation

- [x] Export .ics telechargeable
- [x] Lien d'abonnement iCal (URL dynamique)
- [x] Filtrage par employe (mes interventions uniquement)
- [x] Mise a jour automatique via URL d'abonnement
- [x] Contenu: titre, lieu, heure, description

## Fichiers concernes

- `apps/api/src/modules/calendar/` - Module export iCal
- `apps/api/src/modules/calendar/calendar.controller.ts` - Endpoints
- `apps/pwa/src/pages/Calendar.tsx` - Bouton export

## Analyse / Approche

1. Utiliser librairie `ical-generator` (npm)
2. Endpoint `/calendar/ical/:userId` avec token d'auth dans URL
3. Generer token unique par utilisateur pour URL d'abonnement
4. Format VCALENDAR standard

Exemple output:
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Art & Jardin//Calendar//FR
BEGIN:VEVENT
UID:intervention-uuid@artjardin.fr
DTSTART:20260130T090000
DTEND:20260130T120000
SUMMARY:Taille haies - Dupont
LOCATION:12 rue des Fleurs, Angers
DESCRIPTION:Chantier: Jardin Dupont
END:VEVENT
END:VCALENDAR
```

## Tests de validation

- [x] Export .ics valide (ical-generator)
- [ ] Import dans Google Calendar OK (test manuel)
- [x] URL d'abonnement fonctionne
- [x] Seules mes interventions exportees
- [x] Token securise (token unique par user)

## Dependencies

- FEAT-033 (Vue calendrier)
