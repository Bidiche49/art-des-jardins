# FEAT-079: [Flutter] Phase 1A - Theme + Config + Utils

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** S
**Tags:** mobile, flutter, theme, utils
**Date creation:** 2026-02-10

---

## Description

Systeme de theme complet (light/dark/terrain), utilitaires (date FR, currency EUR, validators), constantes de config, et sealed class d'erreurs.

## User Story

**En tant que** developpeur Flutter
**Je veux** un design system et des utils prets a l'emploi
**Afin de** construire les ecrans avec des styles coherents et des formatters localises FR

## Criteres d'acceptation

- [ ] `env_config.dart` : API_URL via `--dart-define`, timeout 30s
- [ ] `app_constants.dart` : max retries, debounce, idle timeouts
- [ ] `app_colors.dart` : palette verte (#16A34A), nuances 50-900
- [ ] `app_theme.dart` : ThemeData light + dark, Material 3
- [ ] `terrain_theme.dart` : touch targets 64px, fontSize +4px, spacing x2
- [ ] `theme_provider.dart` : Riverpod themeModeProvider + terrainModeProvider
- [ ] `date_utils.dart` : formatDate, formatDateTime, formatRelative (locale FR)
- [ ] `currency_utils.dart` : formatEUR -> "1 234,56 EUR"
- [ ] `validators.dart` : email, phone FR, code postal, required, UUID
- [ ] `debouncer.dart` : timer-based, configurable
- [ ] `failures.dart` : sealed class ServerFailure, CacheFailure, NetworkFailure
- [ ] Extensions BuildContext, String, DateTime
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests date_utils (~10 tests)
- [ ] `formatDate` avec date valide -> "10/02/2026"
- [ ] `formatDate` avec DateTime.now -> date du jour
- [ ] `formatDateTime` -> "10/02/2026 14:30"
- [ ] `formatRelative` avec aujourd'hui -> "Aujourd'hui"
- [ ] `formatRelative` avec hier -> "Hier"
- [ ] `formatRelative` avec date ancienne -> "il y a X jours"
- [ ] Edge: DateTime a minuit
- [ ] Edge: 31 decembre / 1er janvier (changement d'annee)

### Unit tests currency_utils (~8 tests)
- [ ] `formatEUR(1234.56)` -> "1 234,56 EUR"
- [ ] `formatEUR(0)` -> "0,00 EUR"
- [ ] `formatEUR(1000000)` -> "1 000 000,00 EUR"
- [ ] `formatEUR(-500.10)` -> "-500,10 EUR"
- [ ] `formatEUR(0.1)` -> "0,10 EUR" (arrondi)
- [ ] `formatEUR(99.999)` -> "100,00 EUR" (arrondi)
- [ ] Tres grands montants (> 1M)
- [ ] Tres petits montants (centimes)

### Unit tests validators (~15 tests)
- [ ] Email valide + invalide (5 cas min)
- [ ] Telephone FR valide : 06, 07, +33, avec/sans espaces
- [ ] Telephone invalide : trop court, lettres, vide
- [ ] Code postal : 5 chiffres OK, 4 chiffres KO, lettres KO
- [ ] Required : vide/null/spaces -> erreur, texte -> OK
- [ ] UUID valide + invalide

### Unit tests debouncer (~3 tests)
- [ ] Appel unique apres delai
- [ ] Appels rapides -> seul le dernier execute
- [ ] Cancel annule l'execution

### Unit tests failures (~4 tests)
- [ ] Chaque type de Failure a un message
- [ ] Pattern matching exhaustif sur sealed class
- [ ] Egalite entre instances identiques

### Theme tests (~5 tests)
- [ ] ThemeData light a la bonne primary color
- [ ] ThemeData dark a la bonne primary color
- [ ] Terrain theme a minInteractiveDimension >= 64
- [ ] Theme provider change de mode
- [ ] Terrain mode toggle

**Total attendu : ~45 tests**

## Fichiers concernes

- `lib/core/config/env_config.dart`
- `lib/core/config/app_constants.dart`
- `lib/core/theme/app_colors.dart`
- `lib/core/theme/app_text_styles.dart`
- `lib/core/theme/app_theme.dart`
- `lib/core/theme/terrain_theme.dart`
- `lib/core/theme/theme_provider.dart`
- `lib/core/utils/date_utils.dart`
- `lib/core/utils/currency_utils.dart`
- `lib/core/utils/validators.dart`
- `lib/core/utils/debouncer.dart`
- `lib/core/utils/haptic_utils.dart`
- `lib/core/extensions/`
- `lib/core/errors/failures.dart`
