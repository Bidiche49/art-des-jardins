# FEAT-100: [Flutter] Phase 17 - Tests integration + Polish

**Type:** Feature
**Statut:** Fait
**Date resolution:** 2026-02-12
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, tests, integration, polish
**Date creation:** 2026-02-10

---

## Description

Tests d'integration end-to-end couvrant les flows critiques, et finitions UX (shimmer, pull-to-refresh, transitions, empty states, splash screen).

## User Story

**En tant que** equipe dev
**Je veux** des tests d'integration et un polish UX complet
**Afin de** garantir la qualite et offrir une experience fluide

## Criteres d'acceptation

- [ ] Tests d'integration couvrant les flows critiques
- [ ] Shimmer loading skeletons sur toutes les listes
- [ ] Pull-to-refresh sur toutes les listes
- [ ] Transitions page (slide, fade) via GoRouter
- [ ] Empty states sur toutes les listes vides
- [ ] Etats d'erreur avec bouton retry
- [ ] Splash screen natif (iOS + Android)
- [ ] Icone app
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests d'integration obligatoires

### auth_flow_test.dart (~8 tests)
- [ ] Login email/mdp -> Dashboard affiche
- [ ] Dashboard -> contenu visible (KPI cards)
- [ ] Logout -> retour Login
- [ ] Login biometrique (mock) -> Dashboard
- [ ] Session expire -> dialog -> re-login
- [ ] Token refresh transparent pendant navigation
- [ ] Acces route protegee sans auth -> redirect login
- [ ] Login avec mauvais credentials -> erreur visible

### offline_sync_test.dart (~8 tests)
- [ ] Passer offline (mock connectivity)
- [ ] Creer client offline -> ID temporaire
- [ ] Modifier client offline -> queue sync
- [ ] Retour online -> sync automatique
- [ ] Client synce -> ID reel remplace temp
- [ ] Offline indicator visible quand offline
- [ ] Sync count affiche dans l'UI
- [ ] Conflit detecte -> banner visible

### devis_builder_test.dart (~8 tests)
- [ ] Ouvrir builder -> formulaire vide
- [ ] Selectionner chantier -> client affiche
- [ ] Ajouter 3 lignes -> totaux corrects
- [ ] Modifier quantite -> recalcul immediat
- [ ] Supprimer ligne -> recalcul
- [ ] Sauver brouillon -> succes
- [ ] Envoyer devis -> statut change
- [ ] Import template -> ligne pre-remplie

### crud_flow_test.dart (~8 tests)
- [ ] Creer client -> visible dans la liste
- [ ] Modifier client -> changements visibles
- [ ] Creer chantier pour ce client -> visible
- [ ] Creer intervention sur chantier -> visible
- [ ] Navigation : liste -> detail -> edit -> retour
- [ ] Suppression -> disparait de la liste
- [ ] Filtre applique -> resultats corrects
- [ ] Recherche -> resultats corrects

### calendar_flow_test.dart (~6 tests)
- [ ] Calendrier affiche le mois courant
- [ ] Tap jour -> evenements du jour
- [ ] Navigation mois suivant -> charge
- [ ] Creer absence -> visible dans calendrier
- [ ] Meteo affichee
- [ ] Tap intervention -> navigation detail

### settings_flow_test.dart (~6 tests)
- [ ] Changer theme -> applique immediatement
- [ ] Activer terrain mode -> tailles changent
- [ ] Sync manuel -> declenche syncAll
- [ ] Configurer biometrie -> persiste
- [ ] Idle timer -> warning affiche
- [ ] Idle expire -> logout ou biometrie

## Tests polish (~15 tests)
- [ ] Shimmer visible pendant chargement listes (clients, chantiers, devis, factures, interventions)
- [ ] Pull-to-refresh declenche reload sur chaque liste
- [ ] Transition slide entre pages
- [ ] Empty state visible sur liste vide (5 listes)
- [ ] Etat erreur avec bouton retry
- [ ] Retry recharge les donnees
- [ ] Splash screen affiche au demarrage

**Total attendu : ~59 tests**

## Fichiers concernes

- `test/integration/auth_flow_test.dart`
- `test/integration/offline_sync_test.dart`
- `test/integration/devis_builder_test.dart`
- `test/integration/crud_flow_test.dart`
- `test/integration/calendar_flow_test.dart`
- `test/integration/settings_flow_test.dart`
- Polish transversal sur tous les ecrans
