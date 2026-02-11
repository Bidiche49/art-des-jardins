import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/network/token_storage.dart';
import '../../../domain/models/auth_response.dart';
import '../../../domain/models/user.dart';
import '../domain/auth_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    publicDio: ref.read(publicDioProvider),
    authDio: ref.read(authDioProvider),
    tokenStorage: ref.read(tokenStorageProvider),
  );
});

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({
    required Dio publicDio,
    required Dio authDio,
    required TokenStorage tokenStorage,
  })  : _publicDio = publicDio,
        _authDio = authDio,
        _tokenStorage = tokenStorage;

  final Dio _publicDio;
  final Dio _authDio;
  final TokenStorage _tokenStorage;

  @override
  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final response = await _publicDio.post(
      ApiEndpoints.login,
      data: {'email': email, 'password': password},
    );

    final authResponse =
        AuthResponse.fromJson(response.data as Map<String, dynamic>);

    await _tokenStorage.saveTokens(
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    );

    return authResponse;
  }

  @override
  Future<AuthResponse> refresh() async {
    final refreshToken = await _tokenStorage.getRefreshToken();
    if (refreshToken == null) {
      throw DioException(
        requestOptions: RequestOptions(path: ApiEndpoints.refreshToken),
        type: DioExceptionType.unknown,
        error: 'No refresh token available',
      );
    }

    final response = await _publicDio.post(
      ApiEndpoints.refreshToken,
      data: {'refreshToken': refreshToken},
    );

    final authResponse =
        AuthResponse.fromJson(response.data as Map<String, dynamic>);

    await _tokenStorage.saveTokens(
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    );

    return authResponse;
  }

  @override
  Future<void> logout() async {
    try {
      await _authDio.post(ApiEndpoints.logout);
    } catch (_) {
      // Best-effort server logout; always clear local state.
    }
    await _tokenStorage.clearTokens();
  }

  @override
  Future<User?> getCurrentUser() async {
    try {
      final response = await _authDio.get(ApiEndpoints.me);
      return User.fromJson(response.data as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<bool> isAuthenticated() => _tokenStorage.hasTokens();

  @override
  Future<String?> getAccessToken() => _tokenStorage.getAccessToken();
}
