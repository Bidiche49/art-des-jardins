# FEAT-084: [Flutter] Phase 4B - Router complet + App Shell

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** mobile, flutter, navigation, ui
**Date creation:** 2026-02-10

---

## Description

Navigation complete GoRouter avec bottom nav, guards d'auth, deep links, et AppShell (AppBar + BottomNavigationBar).

## User Story

**En tant que** employe
**Je veux** naviguer facilement entre les ecrans avec une bottom nav
**Afin de** acceder rapidement aux fonctions principales

## Criteres d'acceptation

- [ ] GoRouter avec toutes les routes (20+ routes)
- [ ] ShellRoute avec AppShell (AppBar + BottomNav 6 items)
- [ ] Auth guard : redirect vers /login si non authentifie
- [ ] Routes publiques : /login, /signer/:token
- [ ] Deep links fonctionnels
- [ ] AppBar : logo, OfflineIndicator, NotificationBell, Settings, Logout
- [ ] SafeArea pour iOS notch
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests router guard (~10 tests)
- [ ] Non authentifie + route protegee -> redirect /login
- [ ] Authentifie + route protegee -> acces autorise
- [ ] Non authentifie + /login -> reste sur /login
- [ ] Authentifie + /login -> redirect vers /
- [ ] Non authentifie + /signer/:token -> acces autorise (route publique)
- [ ] Route inconnue -> redirect vers / ou 404
- [ ] Deep link /clients/uuid -> resolu correctement
- [ ] Deep link /devis/uuid -> resolu correctement
- [ ] Logout -> redirect /login
- [ ] Session expired -> redirect /login

### Widget tests AppShell (~10 tests)
- [ ] BottomNav affiche 6 items avec icones et labels
- [ ] Tap "Clients" -> navigation vers /clients
- [ ] Tap "Chantiers" -> navigation vers /chantiers
- [ ] Tap "Devis" -> navigation vers /devis
- [ ] Tap "Calendrier" -> navigation vers /calendar
- [ ] Tap "Analytics" -> navigation vers /analytics
- [ ] Item actif est highlight (couleur differente)
- [ ] AppBar affiche le titre de la page courante
- [ ] OfflineIndicator visible quand offline
- [ ] SafeArea respecte le notch iOS

### Unit tests route names (~5 tests)
- [ ] Toutes les routes ont un nom unique
- [ ] Route path correspond au nom attendu
- [ ] Parametres de route extraits correctement (:id, :token)
- [ ] Route /chantiers/:id/rentabilite nested correctement
- [ ] Pas de route dupliquee

**Total attendu : ~25 tests**

## Fichiers concernes

- `lib/core/router/app_router.dart`
- `lib/core/router/route_names.dart`
- `lib/core/router/auth_guard.dart`
- `lib/shared/layouts/app_shell.dart`
