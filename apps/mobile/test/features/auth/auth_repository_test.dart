import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/token_storage.dart';
import 'package:art_et_jardin/features/auth/data/auth_repository_impl.dart';

class MockDio extends Mock implements Dio {}

class MockTokenStorage extends Mock implements TokenStorage {}

void main() {
  late MockDio mockPublicDio;
  late MockDio mockAuthDio;
  late MockTokenStorage mockStorage;
  late AuthRepositoryImpl repo;

  final userJson = {
    'id': '1',
    'email': 'test@artjardin.fr',
    'nom': 'Dupont',
    'prenom': 'Jean',
    'role': 'employe',
    'actif': true,
    'onboardingCompleted': false,
    'onboardingStep': 0,
    'createdAt': '2026-01-01T00:00:00.000',
    'updatedAt': '2026-01-01T00:00:00.000',
  };

  final authResponseJson = {
    'user': userJson,
    'accessToken': 'access_123',
    'refreshToken': 'refresh_456',
  };

  setUp(() {
    mockPublicDio = MockDio();
    mockAuthDio = MockDio();
    mockStorage = MockTokenStorage();
    repo = AuthRepositoryImpl(
      publicDio: mockPublicDio,
      authDio: mockAuthDio,
      tokenStorage: mockStorage,
    );
  });

  setUpAll(() {
    registerFallbackValue(RequestOptions(path: ''));
  });

  group('AuthRepositoryImpl', () {
    test('login calls POST /auth/login', () async {
      when(() => mockPublicDio.post(
            any(),
            data: any(named: 'data'),
          )).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/login'),
            data: authResponseJson,
            statusCode: 200,
          ));
      when(() => mockStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});

      final result = await repo.login(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      expect(result.user.email, 'test@artjardin.fr');
      verify(() => mockPublicDio.post('/auth/login', data: {
            'email': 'test@artjardin.fr',
            'password': 'secret',
          })).called(1);
    });

    test('login stores tokens in SecureStorage', () async {
      when(() => mockPublicDio.post(
            any(),
            data: any(named: 'data'),
          )).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/login'),
            data: authResponseJson,
            statusCode: 200,
          ));
      when(() => mockStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});

      await repo.login(email: 'test@artjardin.fr', password: 'secret');

      verify(() => mockStorage.saveTokens(
            accessToken: 'access_123',
            refreshToken: 'refresh_456',
          )).called(1);
    });

    test('refresh calls POST /auth/refresh', () async {
      when(() => mockStorage.getRefreshToken())
          .thenAnswer((_) async => 'old_refresh');
      when(() => mockPublicDio.post(
            any(),
            data: any(named: 'data'),
          )).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/refresh'),
            data: authResponseJson,
            statusCode: 200,
          ));
      when(() => mockStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});

      final result = await repo.refresh();

      expect(result.accessToken, 'access_123');
      verify(() => mockPublicDio.post('/auth/refresh', data: {
            'refreshToken': 'old_refresh',
          })).called(1);
    });

    test('refresh updates tokens in storage', () async {
      when(() => mockStorage.getRefreshToken())
          .thenAnswer((_) async => 'old_refresh');
      when(() => mockPublicDio.post(
            any(),
            data: any(named: 'data'),
          )).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/refresh'),
            data: authResponseJson,
            statusCode: 200,
          ));
      when(() => mockStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});

      await repo.refresh();

      verify(() => mockStorage.saveTokens(
            accessToken: 'access_123',
            refreshToken: 'refresh_456',
          )).called(1);
    });

    test('logout clears SecureStorage', () async {
      when(() => mockAuthDio.post(any()))
          .thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/logout'),
            statusCode: 200,
          ));
      when(() => mockStorage.clearTokens()).thenAnswer((_) async {});

      await repo.logout();

      verify(() => mockStorage.clearTokens()).called(1);
    });

    test('logout clears tokens even if API fails', () async {
      when(() => mockAuthDio.post(any())).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/auth/logout'),
        type: DioExceptionType.connectionError,
      ));
      when(() => mockStorage.clearTokens()).thenAnswer((_) async {});

      await repo.logout();

      verify(() => mockStorage.clearTokens()).called(1);
    });

    test('getCurrentUser returns user from /auth/me', () async {
      when(() => mockAuthDio.get(any())).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/auth/me'),
            data: userJson,
            statusCode: 200,
          ));

      final user = await repo.getCurrentUser();

      expect(user, isNotNull);
      expect(user!.email, 'test@artjardin.fr');
    });

    test('isAuthenticated checks token presence', () async {
      when(() => mockStorage.hasTokens()).thenAnswer((_) async => true);
      expect(await repo.isAuthenticated(), isTrue);

      when(() => mockStorage.hasTokens()).thenAnswer((_) async => false);
      expect(await repo.isAuthenticated(), isFalse);
    });

    test('getAccessToken returns current token', () async {
      when(() => mockStorage.getAccessToken())
          .thenAnswer((_) async => 'access_123');

      expect(await repo.getAccessToken(), 'access_123');
    });
  });
}
