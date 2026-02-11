# FEAT-097: [Flutter] Phase 14 - Settings + Terrain Mode + Idle Timer

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** M
**Tags:** mobile, flutter, settings, terrain, security
**Date creation:** 2026-02-10

---

## Description

Page settings complete (theme, terrain, biometrie, sync), mode terrain avec grosses cibles tactiles, idle timer avec warning et expiration.

## User Story

**En tant que** employe terrain
**Je veux** configurer l'app pour une utilisation en exterieur (gros boutons, haptic)
**Afin de** pouvoir utiliser l'app avec des gants ou les doigts mouilles

## Criteres d'acceptation

- [ ] Settings : theme (3 modes), terrain toggle, biometrie config, sync status
- [ ] Terrain mode : touch targets 64px, font +4px, spacing x2, haptic
- [ ] Idle timer : patron 30min, employe 2h, warning 2min avant
- [ ] Sur expiration : proposer biometrie ou logout
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests ThemeProvider (~6 tests)
- [ ] Changement theme Clair -> ThemeMode.light
- [ ] Changement theme Sombre -> ThemeMode.dark
- [ ] Changement theme Systeme -> ThemeMode.system
- [ ] Theme persiste en SharedPreferences
- [ ] Theme charge au demarrage
- [ ] Theme par defaut = system

### Unit tests TerrainModeProvider (~8 tests)
- [ ] Toggle ON -> terrainTheme applique
- [ ] Toggle OFF -> theme normal
- [ ] Touch targets >= 64px quand actif
- [ ] Font size augmentee de 4px
- [ ] Spacing double
- [ ] Haptic feedback active
- [ ] Persiste en SharedPreferences
- [ ] High contrast : couleurs plus saturees

### Unit tests IdleTimer (~12 tests)
- [ ] Timer patron = 30 minutes
- [ ] Timer employe = 2 heures
- [ ] Reset sur interaction utilisateur (touch)
- [ ] Reset sur navigation
- [ ] Warning dialog 2 minutes avant expiration
- [ ] Countdown dans le dialog
- [ ] "Continuer" dans warning -> reset timer
- [ ] Expiration -> propose biometrie
- [ ] Biometrie OK -> reset timer, continue
- [ ] Biometrie KO ou pas dispo -> logout
- [ ] App en background -> timer continue
- [ ] App en foreground -> verifie si expire

### Widget tests SettingsPage (~8 tests)
- [ ] 3 boutons theme (Clair/Sombre/Systeme)
- [ ] Toggle terrain mode visible
- [ ] Section biometrie : config visible
- [ ] Section sync : pending count + bouton sync
- [ ] Version app affichee
- [ ] Changement theme applique immediatement
- [ ] Toggle terrain change les tailles
- [ ] Bouton sync declenche syncAll

**Total attendu : ~34 tests**

## Fichiers concernes

- `lib/features/settings/`
- `lib/services/idle/idle_timer_service.dart`
