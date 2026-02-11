import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:local_auth/error_codes.dart' as auth_error;

import '../../../services/biometric/biometric_service.dart';
import '../data/auth_repository_impl.dart';
import '../domain/auth_repository.dart';
import '../domain/auth_state.dart';

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    repository: ref.read(authRepositoryProvider),
    biometricService: ref.read(biometricServiceProvider),
  );
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier({
    required AuthRepository repository,
    required BiometricService biometricService,
  })  : _repository = repository,
        _biometricService = biometricService,
        super(const AuthInitial());

  final AuthRepository _repository;
  final BiometricService _biometricService;
  bool _isLoginInProgress = false;

  Future<void> checkAuth() async {
    state = const AuthLoading();
    try {
      final isAuth = await _repository.isAuthenticated();
      if (!isAuth) {
        state = const AuthUnauthenticated();
        return;
      }
      final user = await _repository.getCurrentUser();
      if (user != null) {
        state = AuthAuthenticated(user);
      } else {
        state = const AuthUnauthenticated();
      }
    } catch (_) {
      state = const AuthUnauthenticated();
    }
  }

  Future<void> loginWithPassword({
    required String email,
    required String password,
  }) async {
    if (_isLoginInProgress) return;
    _isLoginInProgress = true;

    state = const AuthLoading();
    try {
      final authResponse = await _repository.login(
        email: email,
        password: password,
      );
      state = AuthAuthenticated(authResponse.user);
    } on DioException catch (e) {
      state = AuthError(_mapDioError(e));
    } catch (e) {
      state = AuthError(e.toString());
    } finally {
      _isLoginInProgress = false;
    }
  }

  Future<void> loginWithBiometric() async {
    if (_isLoginInProgress) return;
    _isLoginInProgress = true;

    try {
      final isAvailable = await _biometricService.isAvailable();
      if (!isAvailable) {
        state = const AuthError('Biometrie non disponible sur cet appareil');
        return;
      }

      final authenticated = await _biometricService.authenticate();
      if (!authenticated) {
        // User cancelled: stay on current state
        return;
      }

      state = const AuthLoading();
      final authResponse = await _repository.refresh();
      state = AuthAuthenticated(authResponse.user);
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        state = const AuthError(
          'Session expiree. Veuillez vous reconnecter avec vos identifiants.',
        );
      } else {
        state = AuthError(_mapDioError(e));
      }
    } catch (e) {
      final message = e.toString();
      if (message.contains(auth_error.lockedOut) ||
          message.contains(auth_error.permanentlyLockedOut)) {
        state = const AuthError(
          'Biometrie bloquee. Trop de tentatives echouees.',
        );
      } else {
        // PlatformException user cancel or other: stay on current state
      }
    } finally {
      _isLoginInProgress = false;
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AuthUnauthenticated();
  }

  void handleSessionExpired() {
    state = const AuthError(
      'Votre session a expire. Veuillez vous reconnecter.',
    );
  }

  String _mapDioError(DioException e) {
    if (e.response?.statusCode == 401) {
      return 'Identifiants incorrects';
    }
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.sendTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return 'Timeout de connexion';
    }
    if (e.type == DioExceptionType.connectionError) {
      return 'Erreur reseau';
    }
    return 'Erreur serveur';
  }
}
