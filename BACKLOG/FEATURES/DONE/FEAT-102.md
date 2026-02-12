# FEAT-102: [Flutter] Phase 19 - Performance + Production Readiness

**Type:** Feature
**Statut:** Fait
**Date resolution:** 2026-02-12
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, performance, ci, production
**Date creation:** 2026-02-10

---

## Description

Optimisation performance (listes, images, reseau, startup, memoire) + preparation production (crash reporting, analytics, CI/CD, environnements, app store).

**S'execute apres Phase 18 (UX Polish) et AVANT Phase 17 (tests integration finaux).**

## User Story

**En tant que** equipe dev
**Je veux** une app performante, monitoree et prete pour le store
**Afin de** livrer une v1 fiable en production

## Criteres d'acceptation

### Performance Listes
- [ ] `ListView.builder` (ou SliverList) sur TOUTES les listes (jamais Column+map)
- [ ] Pagination API sur listes longues (clients, chantiers, interventions)
- [ ] `const` constructors partout ou possible
- [ ] `RepaintBoundary` sur les items de liste complexes
- [ ] Pas de rebuild inutile (select/watch Riverpod cibles)

### Performance Images
- [ ] `CachedNetworkImage` avec taille max (pas d'images 4K en miniature)
- [ ] `memCacheWidth`/`memCacheHeight` sur les thumbnails
- [ ] Cache taille max configuree (100MB)
- [ ] Placeholder pendant chargement
- [ ] Error widget si image introuvable
- [ ] Compression photo upload : max 1920px, qualite 80%

### Performance Reseau
- [ ] Requetes API avec `cancelToken` Dio (annuler si on quitte l'ecran)
- [ ] Cache HTTP headers respectes (ETag, Last-Modified)
- [ ] Pas de requetes dupliquees (debounce + dedup)
- [ ] Timeout par type : 10s listing, 30s upload, 60s PDF

### Performance Startup
- [ ] Splash screen natif (pas de blanc au launch)
- [ ] `deferred` imports pour les features non-critiques (analytics, scanner, onboarding)
- [ ] Bootstrap parallelise (Drift + Dio + SecureStorage en parallele)
- [ ] Mesure temps startup < 2s sur device moyen

### Performance Memoire
- [ ] `dispose()` sur TOUS les controllers (TextEditingController, ScrollController, AnimationController)
- [ ] `autoDispose` sur les providers Riverpod ephemeres
- [ ] Pas de leak sur les streams (cancel subscriptions)
- [ ] Photos : liberer memoire apres compression (via isolate)

### Crash Reporting
- [ ] Firebase Crashlytics configure (iOS + Android)
- [ ] Erreurs non-catchees reportees automatiquement
- [ ] FlutterError.onError -> Crashlytics
- [ ] PlatformDispatcher.onError -> Crashlytics
- [ ] Breadcrumbs : navigation, actions utilisateur
- [ ] User ID attache aux reports (apres login)

### Analytics Tracking
- [ ] Firebase Analytics configure
- [ ] Screen views trackes automatiquement (GoRouter observer)
- [ ] Actions cles trackees : login, create_client, create_devis, sign_devis, sync_complete
- [ ] Pas de donnees personnelles dans les events

### CI/CD
- [ ] GitHub Actions : `flutter test` + `flutter analyze` sur chaque PR
- [ ] Build APK/IPA automatique sur merge main
- [ ] Versioning automatique (build number = commit count)

### Environnements
- [ ] 3 configs : dev, staging, prod
- [ ] API_URL par env via `--dart-define`
- [ ] Firebase project par env (ou meme projet, apps differentes)
- [ ] Build flavors Android + schemes iOS

### App Store Preparation
- [ ] Icone app (logo Art & Jardin) toutes tailles
- [ ] Splash screen avec logo
- [ ] Bundle ID final : com.artetjardin.mobile
- [ ] Metadata : nom, description, categorie
- [ ] Screenshots automatises (integration test + capture)
- [ ] Privacy policy URL

## Tests obligatoires (~30 tests)

### Tests performance listes (~6 tests)
- [ ] ClientsList utilise ListView.builder (pas Column)
- [ ] Pagination : page 1 chargee, scroll -> page 2
- [ ] Liste 100 items : pas de jank (frame time < 16ms, si mesurable)
- [ ] CancelToken : quitter ecran annule la requete
- [ ] RepaintBoundary sur items complexes
- [ ] Pas de setState inutile (provider invalidation ciblee)

### Tests performance images (~4 tests)
- [ ] CachedNetworkImage avec placeholder
- [ ] CachedNetworkImage avec error widget
- [ ] Thumbnail utilise memCacheWidth
- [ ] Compression photo < 500KB apres traitement

### Tests crash reporting (~4 tests)
- [ ] Crashlytics initialise au bootstrap
- [ ] Erreur non-catchee -> log Crashlytics (mock)
- [ ] User ID set apres login
- [ ] User ID clear apres logout

### Tests CI/CD (~4 tests)
- [ ] `flutter analyze` passe (0 issues)
- [ ] `flutter test` passe (all green)
- [ ] Build APK release passe
- [ ] Build IPA release passe (no-codesign)

### Tests environnements (~4 tests)
- [ ] Dev config : API_URL = localhost
- [ ] Staging config : API_URL = staging.artetjardin.fr
- [ ] Prod config : API_URL = api.artetjardin.fr
- [ ] Mauvais env -> erreur explicite

### Tests startup (~4 tests)
- [ ] Bootstrap complete sans erreur
- [ ] Splash screen affiche (native, pas Flutter)
- [ ] Deferred import : scanner pas charge au startup
- [ ] App fonctionnelle meme si Firebase echoue (graceful degradation)

### Tests store readiness (~4 tests)
- [ ] Icone app presente (toutes tailles)
- [ ] Bundle ID correct
- [ ] Version et build number corrects
- [ ] Pas de debug banner en release

**Total attendu : ~30 tests**

## Fichiers concernes

- `lib/bootstrap.dart` (init parallelise, Crashlytics)
- `lib/core/config/env_config.dart` (3 envs)
- `lib/core/network/dio_client.dart` (cancelToken, timeouts)
- `.github/workflows/flutter.yml` (CI/CD)
- `android/app/build.gradle.kts` (flavors)
- `ios/Runner.xcodeproj/` (schemes)
- Transversal : toutes les listes et images
