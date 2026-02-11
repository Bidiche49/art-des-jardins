# FEAT-078: [Flutter] Phase 0 - Scaffolding projet

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** S
**Tags:** mobile, flutter, setup
**Date creation:** 2026-02-10
**Date resolution:** 2026-02-10

---

## Description

Creer le projet Flutter dans `apps/mobile/` avec toutes les dependances, la structure de dossiers, et verifier que le projet compile sur iOS et Android.

## Criteres d'acceptation

- [x] Projet Flutter cree avec `flutter create --org com.artetjardin`
- [x] `pubspec.yaml` avec 40+ dependances (Riverpod, GoRouter, Dio, Drift, freezed, etc.)
- [x] `analysis_options.yaml` strict mode avec exclusions fichiers generes
- [x] `lib/main.dart` avec ProviderScope + MaterialApp theme vert
- [x] `lib/bootstrap.dart` placeholder
- [x] Structure de dossiers complete (core, domain, data, services, features, shared)
- [x] iOS deployment target 16.0, permissions camera/localisation/biometrie
- [x] Android core library desugaring active
- [x] `flutter test` passe
- [x] `flutter analyze` propre
- [x] Build iOS device OK
- [x] Build Android APK OK

## Tests

- [x] Smoke test : app affiche "Art & Jardin"
- [x] Theme test : Material 3, couleur primary non-null

## Fichiers concernes

- `apps/mobile/pubspec.yaml`
- `apps/mobile/analysis_options.yaml`
- `apps/mobile/lib/main.dart`
- `apps/mobile/lib/bootstrap.dart`
- `apps/mobile/ios/Podfile`
- `apps/mobile/ios/Runner/Info.plist`
- `apps/mobile/android/app/build.gradle.kts`
- `apps/mobile/test/widget_test.dart`
