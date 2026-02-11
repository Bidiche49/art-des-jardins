# FEAT-083: [Flutter] Phase 4A - Auth employe

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** mobile, flutter, auth, biometric, security
**Date creation:** 2026-02-10

---

## Description

Login employe (email+mdp), stockage JWT en SecureStorage, refresh automatique, login biometrique via local_auth.

## User Story

**En tant que** employe terrain
**Je veux** me connecter rapidement (biometrie) ou classiquement (email/mdp)
**Afin de** acceder a mes donnees de maniere securisee

## Criteres d'acceptation

- [ ] Login email/mdp -> POST /auth/login -> stockage tokens
- [ ] Login biometrique -> local_auth.authenticate() -> refresh token
- [ ] AuthNotifier avec etats : initial, loading, authenticated, unauthenticated, error
- [ ] Proposition config biometrie apres premier login password
- [ ] Session expired dialog quand refresh echoue
- [ ] Logout : clear tokens + state reset
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests AuthNotifier - machine d'etats (~18 tests)
- [ ] Etat initial = unauthenticated (pas de token)
- [ ] Etat initial = loading puis authenticated (token valide en storage)
- [ ] Login password OK -> loading -> authenticated
- [ ] Login password KO (401) -> error "Identifiants incorrects"
- [ ] Login password KO (network) -> error "Erreur reseau"
- [ ] Login password KO (timeout) -> error "Timeout"
- [ ] Login biometrique OK -> loading -> authenticated
- [ ] Login biometrique KO (user cancel) -> reste unauthenticated
- [ ] Login biometrique KO (lockout) -> error + message
- [ ] Login biometrique KO (pas disponible) -> cache bouton biometrie
- [ ] Refresh token OK -> authenticated (tokens mis a jour)
- [ ] Refresh token KO -> unauthenticated + session-expired
- [ ] Logout -> unauthenticated + tokens cleared
- [ ] Double login simultane -> un seul appel API
- [ ] Login apres session-expired -> fonctionne normalement
- [ ] Etat user accessible apres login (nom, role, etc.)
- [ ] Token stocke en SecureStorage apres login OK
- [ ] Token supprime de SecureStorage apres logout

### Unit tests BiometricService (~8 tests)
- [ ] `isAvailable()` retourne true si device supporte
- [ ] `isAvailable()` retourne false si pas de biometrie
- [ ] `authenticate()` succes -> true
- [ ] `authenticate()` echec user cancel -> false
- [ ] `authenticate()` echec lockout -> throw
- [ ] `getBiometricType()` retourne fingerprint/face/iris
- [ ] `isConfigured()` verifie si biometrie est configuree dans l'app
- [ ] `setConfigured(true/false)` persiste le choix

### Unit tests AuthRepository (~8 tests)
- [ ] `login(email, password)` appelle POST /auth/login
- [ ] `login` stocke tokens en SecureStorage
- [ ] `refresh()` appelle POST /auth/refresh
- [ ] `refresh` met a jour les tokens
- [ ] `logout()` clear SecureStorage + appelle POST /auth/logout
- [ ] `getCurrentUser()` retourne le user decode du token
- [ ] `isAuthenticated()` verifie presence token
- [ ] `getAccessToken()` retourne le token courant

### Widget tests LoginPage (~8 tests)
- [ ] Affiche formulaire email + password
- [ ] Bouton biometrique visible si biometrie disponible
- [ ] Bouton biometrique cache si biometrie non disponible
- [ ] Validation email : erreur si invalide
- [ ] Validation password : erreur si vide
- [ ] Loading spinner pendant login
- [ ] Message erreur affiche si login echoue
- [ ] Navigation vers dashboard si login OK

**Total attendu : ~42 tests**

## Fichiers concernes

- `lib/features/auth/domain/auth_repository.dart`
- `lib/features/auth/data/auth_remote_datasource.dart`
- `lib/features/auth/data/auth_repository_impl.dart`
- `lib/features/auth/presentation/auth_notifier.dart`
- `lib/features/auth/presentation/pages/login_page.dart`
- `lib/features/auth/presentation/widgets/login_form.dart`
- `lib/features/auth/presentation/widgets/biometric_login_button.dart`
- `lib/features/auth/presentation/widgets/session_expired_dialog.dart`
- `lib/services/biometric/biometric_service.dart`
