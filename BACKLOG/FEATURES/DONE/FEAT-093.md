# FEAT-093: [Flutter] Phase 10 - Calendrier + Meteo + Absences

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, calendar, meteo, absences
**Date creation:** 2026-02-10

---

## Description

Calendrier table_calendar (mois/semaine/jour) avec interventions et absences, meteo Open-Meteo 7 jours, CRUD absences avec validation patron.

## User Story

**En tant que** employe/patron
**Je veux** voir mon planning, la meteo, et gerer les absences
**Afin de** organiser mon travail et celui de l'equipe

## Criteres d'acceptation

- [ ] table_calendar vues mois/semaine/jour
- [ ] Evenements : interventions (couleur par employe) + absences (couleur par type)
- [ ] Tap event -> navigation detail, tap slot vide -> creation
- [ ] Meteo Open-Meteo API, 7 jours, cache 3h
- [ ] Absences : 3 tabs (Mes absences / En attente patron / Toutes patron)
- [ ] Patron : Valider/Refuser absences
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests CalendarProvider (~10 tests)
- [ ] Chargement evenements par mois
- [ ] Interventions mappees aux bons jours
- [ ] Absences mappees aux bonnes periodes (multi-jours)
- [ ] Couleur par employe correcte
- [ ] Couleur par type absence correcte
- [ ] Navigation mois precedent/suivant charge les bons evenements
- [ ] Vue semaine affiche 7 jours
- [ ] Vue jour affiche les details
- [ ] Pas d'evenements -> jours vides
- [ ] Combinaison interventions + absences meme jour

### Unit tests MeteoService (~8 tests)
- [ ] Appel Open-Meteo API parse 7 jours
- [ ] Cache 3h : pas de re-fetch avant expiration
- [ ] Cache expire : re-fetch
- [ ] Parse temperature min/max
- [ ] Parse precipitation
- [ ] Parse description meteo
- [ ] Erreur API -> retourne cache ou null
- [ ] Pas de network -> retourne cache ou vide

### Unit tests AbsencesRepository (~10 tests)
- [ ] getMyAbsences -> filtre par userId courant
- [ ] getPendingAbsences (patron) -> filtre validee=null
- [ ] getAllAbsences (patron) -> toutes
- [ ] create absence -> POST API
- [ ] Validate absence (patron) -> PATCH
- [ ] Refuse absence (patron) -> PATCH
- [ ] Validation : date fin >= date debut
- [ ] Validation : type obligatoire
- [ ] Employe ne peut pas valider
- [ ] Calcul nombre jours absence

### Widget tests (~10 tests)
- [ ] Calendrier affiche le mois courant
- [ ] Dots evenements visibles sur les jours
- [ ] Icones meteo dans les cellules
- [ ] Tap jour -> liste evenements du jour
- [ ] AbsencesPage : 3 tabs visibles (patron)
- [ ] AbsencesPage : 1 tab visible (employe)
- [ ] Formulaire absence : date picker, type, motif
- [ ] Boutons Valider/Refuser visibles pour patron
- [ ] Liste absences en attente
- [ ] Badge meteo alerte si precipitation > seuil

**Total attendu : ~38 tests**

## Fichiers concernes

- `lib/features/calendar/`
- `lib/features/absences/`
- `lib/services/meteo/meteo_service.dart` (ou dans data/)
