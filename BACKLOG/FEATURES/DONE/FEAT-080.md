# FEAT-080: [Flutter] Phase 1B - Networking + Secure Storage

**Type:** Feature
**Statut:** Fait
**Priorite:** Critique
**Complexite:** M
**Tags:** mobile, flutter, network, auth, security
**Date creation:** 2026-02-10

---

## Description

Client HTTP Dio avec intercepteur JWT (refresh token + queue de requetes), service de connectivite, secure storage, DTOs generiques.

## User Story

**En tant que** app mobile
**Je veux** un client HTTP avec refresh token automatique et detection online/offline
**Afin de** communiquer avec l'API de maniere fiable et securisee

## Criteres d'acceptation

- [ ] `api_endpoints.dart` : constantes pour TOUS les endpoints
- [ ] `dio_client.dart` : 2 instances (authDio + publicDio), timeout 30s
- [ ] `auth_interceptor.dart` : JWT inject, refresh, queue, session-expired
- [ ] `connectivity_service.dart` : stream d'etat online/offline
- [ ] `app_preferences.dart` : SharedPrefs wrapper
- [ ] `PaginatedResponse<T>` et `ApiResponse<T>` DTOs
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests AuthInterceptor (~18 tests)
- [ ] onRequest ajoute header Authorization Bearer si token present
- [ ] onRequest sans token -> pas de header
- [ ] onError 401 -> lance refresh token
- [ ] Refresh reussi -> rejoue la requete originale
- [ ] Refresh reussi -> rejoue TOUTES les requetes en queue
- [ ] Refresh echoue (401) -> clear tokens + evenement session-expired
- [ ] Refresh echoue (network) -> erreur propagee
- [ ] 2 requetes 401 simultanees -> UNE seule tentative de refresh
- [ ] 3 requetes en queue -> toutes rejouees apres refresh OK
- [ ] Erreur non-401 -> propagee sans refresh
- [ ] Timeout pendant refresh -> erreur propagee
- [ ] Token expire entre 2 requetes -> refresh transparent
- [ ] Flag isRefreshing reset apres succes
- [ ] Flag isRefreshing reset apres echec
- [ ] SecureStorage vide -> pas de refresh, session-expired direct
- [ ] Header Content-Type JSON par defaut
- [ ] BaseUrl correcte selon env_config
- [ ] Timeout global 30s

### Unit tests ConnectivityService (~6 tests)
- [ ] Etat initial detecte correctement
- [ ] Transition online -> offline emise
- [ ] Transition offline -> online emise
- [ ] Stream emet sur changement
- [ ] Wifi vs mobile detecte
- [ ] Dispose ferme le stream

### Unit tests DTOs (~6 tests)
- [ ] PaginatedResponse parse JSON avec items
- [ ] PaginatedResponse parse page/total/hasNext
- [ ] PaginatedResponse avec liste vide
- [ ] ApiResponse parse data + message
- [ ] ApiResponse parse erreur
- [ ] Generic type T fonctionne avec differents modeles

**Total attendu : ~30 tests**

## Fichiers concernes

- `lib/core/network/api_endpoints.dart`
- `lib/core/network/dio_client.dart`
- `lib/core/network/auth_interceptor.dart`
- `lib/core/network/connectivity_service.dart`
- `lib/data/local/preferences/app_preferences.dart`
- `lib/data/remote/dtos/paginated_response_dto.dart`
- `lib/data/remote/dtos/api_response_dto.dart`
