import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/env_config.dart';
import 'auth_interceptor.dart';
import 'token_storage.dart';

/// Provides the [TokenStorage] instance.
final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => TokenStorage(),
);

/// Callback notifier for session expiration.
final sessionExpiredProvider = StateProvider<bool>(
  (ref) => false,
);

/// Public Dio instance (no auth header).
final publicDioProvider = Provider<Dio>((ref) {
  return _createBaseDio();
});

/// Authenticated Dio instance (with JWT interceptor).
final authDioProvider = Provider<Dio>((ref) {
  final dio = _createBaseDio();
  final tokenStorage = ref.read(tokenStorageProvider);
  final refreshDio = _createBaseDio();

  final interceptor = AuthInterceptor(
    tokenStorage: tokenStorage,
    refreshDio: refreshDio,
    onSessionExpired: () {
      ref.read(sessionExpiredProvider.notifier).state = true;
    },
  );

  dio.interceptors.add(interceptor);
  return dio;
});

Dio _createBaseDio() {
  return Dio(
    BaseOptions(
      baseUrl: EnvConfig.apiUrl,
      connectTimeout: EnvConfig.apiTimeout,
      receiveTimeout: EnvConfig.apiTimeout,
      sendTimeout: EnvConfig.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );
}
