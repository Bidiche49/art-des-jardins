# FEAT-081: [Flutter] Phase 2 - Domain Models + Enums

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** mobile, flutter, models, domain
**Date creation:** 2026-02-10

---

## Description

Tous les modeles freezed (~20) et enums (14) avec serialisation JSON, en se basant sur le schema Prisma et les types PWA.

## User Story

**En tant que** developpeur Flutter
**Je veux** des modeles type-safe, immutables, avec serialisation JSON
**Afin de** manipuler les donnees de maniere sure et coherente avec l'API

## Criteres d'acceptation

- [ ] 20 modeles freezed crees (User, Client, Chantier, Devis, LigneDevis, Facture, Intervention, Photo, Absence, Conversation, Message, InAppNotification, PrestationTemplate, DashboardStats, DailyWeather, AuthResponse, SyncQueueItem, SyncConflict, SearchResult, RentabiliteData)
- [ ] 14 enums avec `value` (JSON) et `label` (FR)
- [ ] `build_runner build` genere sans erreur
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Round-trip JSON pour chaque modele (~40 tests)
Pour CHAQUE modele (20 modeles x 2 tests minimum) :
- [ ] `fromJson(toJson(model))` == model original
- [ ] `fromJson` avec JSON API reel (snapshot)

### Tests champs optionnels / null (~15 tests)
- [ ] Client sans email (nullable) -> parse OK
- [ ] Client sans raisonSociale (nullable) -> parse OK
- [ ] Chantier sans dateFin (nullable) -> parse OK
- [ ] Devis sans signature (nullable) -> parse OK
- [ ] Intervention sans photos (liste vide) -> parse OK
- [ ] Absence sans motif (nullable) -> parse OK
- [ ] JSON avec champs manquants -> default ou erreur claire
- [ ] JSON avec champs supplementaires -> ignore sans crash
- [ ] Tous les champs required presents -> OK
- [ ] Champ required manquant -> erreur explicite

### Tests enums (~28 tests, 14 enums x 2)
Pour CHAQUE enum :
- [ ] Serialisation : enum -> value string correcte
- [ ] Deserialisation : value string -> enum correcte

### Tests enum edge cases (~8 tests)
- [ ] Valeur inconnue dans JSON -> erreur ou fallback
- [ ] Label FR correct pour chaque valeur (spot check 8 valeurs)
- [ ] ChantierStatut a bien 9 valeurs
- [ ] TypePrestation a bien 7 valeurs
- [ ] DevisStatut a bien 6 valeurs

### Tests copyWith / equality (~10 tests)
- [ ] `client.copyWith(nom: 'Nouveau')` change uniquement nom
- [ ] Egalite structurelle entre 2 instances identiques
- [ ] Inegalite quand un champ differe
- [ ] hashCode coherent avec ==
- [ ] copyWith avec null explicite sur champ nullable

**Total attendu : ~100 tests**

## Fichiers concernes

- `lib/domain/models/*.dart` (20 fichiers)
- `lib/domain/enums/*.dart` (14 fichiers)
