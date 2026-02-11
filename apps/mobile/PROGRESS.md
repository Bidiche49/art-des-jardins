# Migration Flutter - Suivi d'avancement

> Fichier de suivi pour la migration Flutter de l'app employe terrain.
> Chaque phase a un ticket BACKLOG associe (FEAT-078 a FEAT-095).

---

## Vue d'ensemble

| # | Phase | Ticket | Statut | Tests | Date |
|---|-------|--------|--------|-------|------|
| 0 | Scaffolding projet | FEAT-078 | FAIT | 2/2 | 2026-02-10 |
| 1A | Theme + Config + Utils | FEAT-079 | FAIT | 66/66 | 2026-02-11 |
| 1B | Networking + Secure Storage | FEAT-080 | FAIT | 93/93 | 2026-02-11 |
| 2 | Domain Models + Enums | FEAT-081 | FAIT | 106/106 | 2026-02-11 |
| 3 | Database Drift | FEAT-082 | A faire | - | - |
| 4A | Auth employe | FEAT-083 | A faire | - | - |
| 4B | Router + App Shell | FEAT-084 | A faire | - | - |
| 5 | Design System Widgets | FEAT-085 | A faire | - | - |
| 6A | Sync Engine Queue + Retry | FEAT-086 | A faire | - | - |
| 6B | Conflits Detection + UI | FEAT-087 | A faire | - | - |
| 7 | Clients CRUD complet | FEAT-088 | A faire | - | - |
| 8A | Chantiers + Rentabilite | FEAT-089 | A faire | - | - |
| 8B | Interventions + Photos | FEAT-090 | A faire | - | - |
| 9A | Devis Builder | FEAT-091 | A faire | - | - |
| 9B | Factures + Signature | FEAT-092 | A faire | - | - |
| 10 | Calendrier + Meteo + Absences | FEAT-093 | A faire | - | - |
| 11 | Dashboard + Analytics | FEAT-094 | A faire | - | - |
| 12 | Recherche + QR Scanner | FEAT-095 | A faire | - | - |
| 13 | WebSocket temps reel | FEAT-096 | A faire | - | - |
| 14 | Settings + Terrain + Idle | FEAT-097 | A faire | - | - |
| 15 | Onboarding tour | FEAT-098 | A faire | - | - |
| 16 | Push Notifications FCM | FEAT-099 | A faire | - | - |
| 18 | UX Polish Pass | FEAT-101 | A faire | - | - |
| 19 | Performance + Production | FEAT-102 | A faire | - | - |
| 17 | Tests integration (DERNIER) | FEAT-100 | A faire | - | - |

---

## Compteurs

- **Phases terminees** : 4/20
- **Tests totaux** : 199
- **Tests prevus** : ~1009 (939 features + 40 UX + 30 perf)
- **Couverture** : Phase 0 + Phase 1A + Phase 1B + Phase 2

---

## Notes de session

### 2026-02-10 - Phase 0

- Projet Flutter cree dans `apps/mobile/`
- 40+ dependances configurees (Riverpod, GoRouter, Dio, Drift, freezed, etc.)
- iOS deployment target 16.0, Android desugaring active
- `flutter test` 2/2, `flutter analyze` clean
- Build iOS device OK, Build Android APK OK
- Structure de dossiers complete (core, domain, data, services, features, shared)

### 2026-02-11 - Phase 1A

- `env_config.dart` : API_URL via `--dart-define`, timeout 30s
- `app_constants.dart` : max retries, debounce, idle timeout, sync config
- `app_colors.dart` : palette verte #16A34A, nuances 50-900, semantique, surfaces
- `app_text_styles.dart` : styles typographiques complets
- `app_theme.dart` : ThemeData light + dark, Material 3
- `terrain_theme.dart` : touch targets 64px, fontSize +4px, spacing x2
- `theme_provider.dart` : Riverpod themeModeProvider + terrainModeProvider
- `date_utils.dart` : formatDate, formatDateTime, formatRelative (FR)
- `currency_utils.dart` : formatEUR via intl fr_FR
- `validators.dart` : email, phone FR, code postal, required, UUID
- `debouncer.dart` : timer-based, configurable, cancel/dispose
- `haptic_utils.dart` : wrappers HapticFeedback
- `failures.dart` : sealed class (Server, Cache, Network, Auth, Validation)
- Extensions : BuildContext, String, DateTime
- `main.dart` mis a jour : ConsumerWidget avec theme light/dark + terrain mode
- 66 tests passent, `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 1B

- `api_endpoints.dart` : constantes pour tous les endpoints REST
- `token_storage.dart` : wrapper FlutterSecureStorage (access + refresh token)
- `auth_interceptor.dart` : JWT inject, refresh auto avec queue, session-expired
- `dio_client.dart` : 2 instances Dio (public + auth) via Riverpod providers
- `connectivity_service.dart` : stream online/offline, detection wifi/mobile
- `app_preferences.dart` : wrapper SharedPreferences type (theme, onboarding, sync)
- `api_response_dto.dart` : ApiResponse<T> generique (data + message + success)
- `paginated_response_dto.dart` : PaginatedResponse<T> (items + page + total + hasNext)
- 93 tests passent (27 nouveaux), `flutter analyze` clean

### 2026-02-11 - Phase 2

- 14 enums avec `value` (JSON) et `label` (FR) : ClientType, UserRole, ChantierStatut (9 val), TypePrestation (7 val), DevisStatut (6 val), FactureStatut, ModePaiement, AbsenceType, PhotoType, SenderType, NotificationType, SyncStatus, DocumentType, CalendarProvider
- 20 modeles freezed : User, Client, Chantier, Devis, LigneDevis, Facture, Intervention, Photo, Absence, Conversation, Message, InAppNotification, PrestationTemplate, DashboardStats, DailyWeather, AuthResponse, SyncQueueItem, SyncConflict, SearchResult, RentabiliteData
- `build.yaml` avec `explicit_to_json: true` pour serialisation nested models
- Barrel exports : `enums/enums.dart` et `models/models.dart`
- 199 tests passent (106 nouveaux), `flutter analyze` clean (0 issues)
