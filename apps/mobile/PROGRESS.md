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
| 3 | Database Drift | FEAT-082 | FAIT | 71/71 | 2026-02-11 |
| 4A | Auth employe | FEAT-083 | FAIT | 43/43 | 2026-02-11 |
| 4B | Router + App Shell | FEAT-084 | FAIT | 24/24 | 2026-02-11 |
| 5 | Design System Widgets | FEAT-085 | FAIT | 54/54 | 2026-02-11 |
| 6A | Sync Engine Queue + Retry | FEAT-086 | FAIT | 30/30 | 2026-02-11 |
| 6B | Conflits Detection + UI | FEAT-087 | FAIT | 29/29 | 2026-02-11 |
| 7 | Clients CRUD complet | FEAT-088 | FAIT | 51/51 | 2026-02-11 |
| 8A | Chantiers + Rentabilite | FEAT-089 | FAIT | 55/55 | 2026-02-11 |
| 8B | Interventions + Photos | FEAT-090 | FAIT | 64/64 | 2026-02-11 |
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

- **Phases terminees** : 13/20
- **Tests totaux** : 620
- **Tests prevus** : ~1009 (939 features + 40 UX + 30 perf)
- **Couverture** : Phase 0 a Phase 8B

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

### 2026-02-11 - Phase 3

- 8 tables Drift : clients, chantiers, interventions, devis, factures, sync_queue, sync_meta, photo_queue
- 8 DAOs avec CRUD complet + queries specifiques (getByClient, getByStatut, getPending, etc.)
- `app_database.dart` avec configuration Drift, migrations, providers Riverpod
- SQLite sans FK constraints (offline-first, pas de cascade)
- `NativeDatabase.memory()` pour tests rapides
- `customStatement` pour incrementRetryCount dans SyncQueueDao
- 270 tests passent (71 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 4A

- `BiometricService` : wrapper local_auth (isAvailable, authenticate, getBiometricType, isConfigured)
- `AuthRepository` (abstract) + `AuthRepositoryImpl` : login, refresh, logout, getCurrentUser
- `AuthNotifier` (StateNotifier) : machine d'etats (Initial, Loading, Authenticated, Unauthenticated, Error)
- Login password : email/mdp -> POST /auth/login -> stockage tokens
- Login biometrique : local_auth -> refresh token -> authenticated
- Protection double login simultane (_isLoginInProgress)
- `LoginPage` : formulaire, validation, biometrie conditionnelle, branding
- `SessionExpiredDialog` : dialog modale non-dismissible
- `BiometricLoginButton` : bouton adaptatif (Face ID, Empreinte, Iris)
- `biometricConfigured` ajoute a AppPreferences
- 313 tests passent (43 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 4B

- `RouteNames` + `RoutePaths` : constantes pour 22 routes (login, signer, dashboard, clients, chantiers, devis, calendar, analytics, detail, create, settings, search, scanner, notifications)
- `authGuard` : redirect /login si non authentifie, redirect / si authentifie sur /login, routes publiques (/login, /signer/:token)
- `GoRouter` avec ShellRoute (AppShell), 20+ routes, deep links, error page
- `AppShell` : AppBar dynamique (titre selon route), NavigationBar 6 items (Dashboard, Clients, Chantiers, Devis, Calendrier, Analytics), actions (Search, Notifications, Settings), SafeArea
- Placeholder pages pour toutes les routes non implementees
- 337 tests passent (24 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 5

- 14 widgets design system crees dans `lib/shared/widgets/`
- `AejButton` : 5 variants (primary, secondary, outline, ghost, danger), 3 tailles, loading, scale(0.98), icones left/right, full-width
- `AejCard` : child, header, footer, onTap, padding (sm/md/lg), elevation
- `AejModal` : BottomSheet mobile (< 600px) / Dialog desktop, 4 tailles, close button, scrollable, actions footer
- `AejInput` : label, hint, error, prefix/suffix icon, validation, focus
- `AejSearchInput` : debounce 300ms, icone search, bouton clear
- `AejSelect` : dropdown via DropdownButtonFormField, generique T
- `AejTextarea` : multi-ligne, 3 rows par defaut, maxLines 6
- `AejBadge` : 6 variants couleur, 2 tailles (sm/md)
- `AejTable` : headers + rows, rows clickables, flex columns
- `AejPagination` : prev/next + page numbers
- `AejSpinner` : 3 tailles (sm/md/lg), `AejLoadingOverlay`
- `AejEmptyState` : icone, titre, description, CTA
- `AejOfflineBanner` : banner conditionnel offline/online
- `AejConnectionIndicator` : dot vert/rouge/jaune (online/offline/syncing)
- 391 tests passent (54 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 6A

- `SyncService` : moteur de synchronisation offline-first
- `addToQueue()` : insere operations (create/update/delete) dans sync_queue Drift avec timestamp
- `syncAll()` : traite les items pending sequentiellement, verrouillage anti-doublon (_isSyncing)
- Backoff exponentiel : 1s, 2s, 4s (max 3 retries), statut 'failed' apres max
- HTTP 409 -> detection conflit, item reste 'pending' avec lastError='conflict'
- `retryFailed()` : reset failed->pending, retryCount=0, relance syncAll
- `AutoSyncController` : auto-sync au retour online (debounce 1s), sync initial si online
- `syncServiceProvider` + `pendingSyncCountProvider` (stream reactif)
- `appDatabaseProvider` + `syncQueueDaoProvider` pour injection
- 421 tests passent (30 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 6B

- `ConflictService` : detection et resolution de conflits sync
- `hasConflict(local, server)` : compare version + updatedAt
- `detectConflictingFields(local, server)` : diff champ par champ, exclut id/version/timestamps
- 3 strategies de resolution : local (garder ma version), server (garder serveur), merge (fusion)
- `mergeData(local, server, overrides)` : base serveur + overrides utilisateur
- `ConflictNotifier` (StateNotifier) : gestion etat liste conflits, add/resolve
- `ConflictResolutionPage` : page complete avec comparaison side-by-side (Table)
- Champs en conflit surlignes en ambre, 3 boutons d'action par conflit
- Editeur merge : BottomSheet avec RadioGroup par champ, validation avant save
- `ConflictQueueBanner` : banner non-dismissible, visible quand conflits > 0, tap -> navigation
- Route `/conflicts` ajoutee au GoRouter (dans ShellRoute)
- Providers : conflictServiceProvider, conflictNotifierProvider, conflictCountProvider
- 450 tests passent (29 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 7

- `ClientsRepository` : interface abstraite (7 methodes CRUD + search + getByType)
- `ClientsRepositoryImpl` : offline-first (API + cache Drift, fallback cache si erreur)
- IDs temporaires `temp-{timestamp}` en mode offline, addToQueue pour sync
- `ClientsListNotifier` (StateNotifier) : loadClients, filterByType, search, _applyFilters
- `ClientDetailNotifier` (StateNotifier.family) : load, updateClient, deleteClient
- `ClientsListPage` : AejSearchInput (debounce), ClientFilters (FilterChip), ListView + RefreshIndicator, FAB
- `ClientDetailPage` : header avec avatar/badge, sections Contact/Adresse/Notes, mode edition inline, confirmation suppression
- `ClientCard` : avatar, nom, badge type, chevron, tap -> detail
- `ClientForm` : 3 ChoiceChip type, champs conditionnels (prenom/raisonSociale), validation (email, phoneFR, postalCode)
- `ClientFilters` : FilterChip horizontal scrollable, "Tous" + 3 types
- Routes branchees dans `app_router.dart` : /clients (liste), /clients/new (form), /clients/:id (detail)
- 501 tests passent (51 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 8A

- `ChantiersRepository` : interface abstraite (8 methodes CRUD + search + getByStatut + getByClient)
- `ChantiersRepositoryImpl` : offline-first (API + cache Drift, fallback cache si erreur)
- IDs temporaires `temp-{timestamp}` en mode offline, addToQueue pour sync
- `ChantiersListNotifier` (StateNotifier) : loadChantiers, filterByStatut, search, _applyFilters
- `ChantierDetailNotifier` (StateNotifier.family) : load, updateChantier, deleteChantier
- `ChantiersListPage` : AejSearchInput (debounce), ChantierFilters (9 statuts), ListView + RefreshIndicator, FAB
- `ChantierDetailPage` : header avec icone/badge, sections Adresse/Infos/Dates/Notes, changement statut inline (ChoiceChip), mode edition, confirmation suppression, bouton rentabilite
- `RentabilitePage` : taux de marge, 4 metric cards (CA/Couts/Marge/Heures), PieChart repartition, BarChart CA vs Couts (fl_chart)
- `RentabiliteCalculator` : computeCA, computeCouts, computeMarge, computeMargePercent, arrondi 2 decimales
- `ChantierCard` : icone construction, description, badge statut couleur, adresse/ville, chevron
- `ChantierForm` : dropdown client, multi-select TypePrestation (FilterChip), DatePicker debut/fin (validation fin >= debut), dropdown statut (edit only), surface m², validation (adresse, postalCode)
- `ChantierFilters` : FilterChip horizontal scrollable, "Tous" + 9 statuts
- Routes branchees dans `app_router.dart` : /chantiers (liste), /chantiers/new (form), /chantiers/:id (detail), /chantiers/:id/rentabilite
- `rentabiliteProvider` : FutureProvider.family, query DevisDao + InterventionsDao par chantierId
- 556 tests passent (55 nouveaux), `flutter analyze` clean (0 issues)

### 2026-02-11 - Phase 8B

- `InterventionsRepository` : interface abstraite (8 methodes CRUD + getByChantier + getByDate + getByDateRange)
- `InterventionsRepositoryImpl` : offline-first (API + cache Drift, fallback cache si erreur)
- IDs temporaires `temp-{timestamp}` en mode offline, addToQueue pour sync
- `InterventionsWeekNotifier` (StateNotifier) : vue semaine lundi-dimanche, nextWeek/previousWeek/goToCurrentWeek, interventionsForDay
- `InterventionDetailNotifier` (StateNotifier.family) : load, updateIntervention, deleteIntervention
- `InterventionsListPage` : WeekNavigator (navigation semaine), 7 DaySection (lundi-dimanche), jour courant surligné, tap jour vide -> creation, RefreshIndicator, FAB
- `InterventionDetailPage` : header avec icone/badge, sections Informations/Description/Notes/Photos, mode edition inline, confirmation suppression
- `InterventionCard` : icone build, description, badge valide/en cours, plage horaire, badge nombre photos, chevron
- `InterventionForm` : dropdown chantier, DatePicker, TimePicker debut/fin, duree minutes, description, notes, validation
- `WeekNavigator` : navigation prev/next semaine, affichage plage dates, tap centre -> semaine courante
- `PhotoCapture` : 3 boutons type (Avant bleu, Pendant orange, Apres vert) avec icone camera
- `PhotoGallery` : GridView CachedNetworkImage, FilterChip par type (Toutes/Avant/Pendant/Apres), empty state
- `PhotoCompare` : side-by-side avant/apres avec labels couleur
- `PhotoService` : capturePhoto (ImagePicker), getGpsCoordinates (Geolocator), compressPhoto (Isolate), uploadPhoto (multipart online / queue offline)
- `PhotoQueueService` : processQueue, backoff max 3 retries, suppression fichier local apres upload, retryFailed
- Routes branchees dans `app_router.dart` : /interventions (liste semaine), /interventions/new (form), /interventions/:id (detail)
- 620 tests passent (64 nouveaux), `flutter analyze` clean (0 issues)
