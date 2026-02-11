import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/auth_response.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/features/auth/domain/auth_repository.dart';
import 'package:art_et_jardin/features/auth/domain/auth_state.dart';
import 'package:art_et_jardin/features/auth/presentation/auth_notifier.dart';
import 'package:art_et_jardin/services/biometric/biometric_service.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

class MockBiometricService extends Mock implements BiometricService {}

User _testUser({String id = '1'}) => User(
      id: id,
      email: 'test@artjardin.fr',
      nom: 'Dupont',
      prenom: 'Jean',
      role: UserRole.employe,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

AuthResponse _testAuthResponse() => AuthResponse(
      user: _testUser(),
      accessToken: 'access_123',
      refreshToken: 'refresh_456',
    );

void main() {
  late MockAuthRepository mockRepo;
  late MockBiometricService mockBio;
  late AuthNotifier notifier;

  setUp(() {
    mockRepo = MockAuthRepository();
    mockBio = MockBiometricService();
    notifier = AuthNotifier(
      repository: mockRepo,
      biometricService: mockBio,
    );
  });

  tearDown(() {
    notifier.dispose();
  });

  group('AuthNotifier', () {
    test('initial state is AuthInitial', () {
      expect(notifier.state, isA<AuthInitial>());
    });

    test('checkAuth -> unauthenticated when no token', () async {
      when(() => mockRepo.isAuthenticated()).thenAnswer((_) async => false);

      await notifier.checkAuth();

      expect(notifier.state, isA<AuthUnauthenticated>());
    });

    test('checkAuth -> authenticated when token valid', () async {
      when(() => mockRepo.isAuthenticated()).thenAnswer((_) async => true);
      when(() => mockRepo.getCurrentUser())
          .thenAnswer((_) async => _testUser());

      await notifier.checkAuth();

      expect(notifier.state, isA<AuthAuthenticated>());
      expect((notifier.state as AuthAuthenticated).user.email,
          'test@artjardin.fr');
    });

    test('checkAuth -> unauthenticated when getCurrentUser returns null',
        () async {
      when(() => mockRepo.isAuthenticated()).thenAnswer((_) async => true);
      when(() => mockRepo.getCurrentUser()).thenAnswer((_) async => null);

      await notifier.checkAuth();

      expect(notifier.state, isA<AuthUnauthenticated>());
    });

    test('loginWithPassword OK -> authenticated', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenAnswer((_) async => _testAuthResponse());

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      expect(notifier.state, isA<AuthAuthenticated>());
      final authenticated = notifier.state as AuthAuthenticated;
      expect(authenticated.user.nom, 'Dupont');
    });

    test('loginWithPassword 401 -> error identifiants incorrects', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/login'),
          statusCode: 401,
        ),
      ));

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'wrong',
      );

      expect(notifier.state, isA<AuthError>());
      expect(
        (notifier.state as AuthError).message,
        'Identifiants incorrects',
      );
    });

    test('loginWithPassword network error -> error reseau', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        type: DioExceptionType.connectionError,
      ));

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      expect(notifier.state, isA<AuthError>());
      expect((notifier.state as AuthError).message, 'Erreur reseau');
    });

    test('loginWithPassword timeout -> error timeout', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/auth/login'),
        type: DioExceptionType.connectionTimeout,
      ));

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      expect(notifier.state, isA<AuthError>());
      expect((notifier.state as AuthError).message, 'Timeout de connexion');
    });

    test('loginWithBiometric OK -> authenticated', () async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => true);
      when(() => mockBio.authenticate()).thenAnswer((_) async => true);
      when(() => mockRepo.refresh()).thenAnswer((_) async => _testAuthResponse());

      await notifier.loginWithBiometric();

      expect(notifier.state, isA<AuthAuthenticated>());
    });

    test('loginWithBiometric user cancel -> stays on current state', () async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => true);
      when(() => mockBio.authenticate()).thenAnswer((_) async => false);

      await notifier.loginWithBiometric();

      // Should not change from initial state (user cancelled)
      expect(notifier.state, isA<AuthInitial>());
    });

    test('loginWithBiometric not available -> error', () async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => false);

      await notifier.loginWithBiometric();

      expect(notifier.state, isA<AuthError>());
      expect(
        (notifier.state as AuthError).message,
        contains('non disponible'),
      );
    });

    test('loginWithBiometric refresh 401 -> session expired error', () async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => true);
      when(() => mockBio.authenticate()).thenAnswer((_) async => true);
      when(() => mockRepo.refresh()).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/auth/refresh'),
        response: Response(
          requestOptions: RequestOptions(path: '/auth/refresh'),
          statusCode: 401,
        ),
      ));

      await notifier.loginWithBiometric();

      expect(notifier.state, isA<AuthError>());
      expect((notifier.state as AuthError).message, contains('reconnecter'));
    });

    test('logout -> unauthenticated', () async {
      // First, login
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenAnswer((_) async => _testAuthResponse());
      await notifier.loginWithPassword(
          email: 'test@artjardin.fr', password: 'secret');
      expect(notifier.state, isA<AuthAuthenticated>());

      // Then logout
      when(() => mockRepo.logout()).thenAnswer((_) async {});
      await notifier.logout();

      expect(notifier.state, isA<AuthUnauthenticated>());
      verify(() => mockRepo.logout()).called(1);
    });

    test('double login -> only one API call', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenAnswer((_) async {
        await Future<void>.delayed(const Duration(milliseconds: 50));
        return _testAuthResponse();
      });

      // Fire two concurrent logins
      final f1 = notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );
      final f2 = notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );
      await Future.wait([f1, f2]);

      verify(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).called(1);
    });

    test('handleSessionExpired -> error state with message', () {
      notifier.handleSessionExpired();

      expect(notifier.state, isA<AuthError>());
      expect((notifier.state as AuthError).message, contains('expire'));
    });

    test('user accessible after login', () async {
      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenAnswer((_) async => _testAuthResponse());

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      final authenticated = notifier.state as AuthAuthenticated;
      expect(authenticated.user.nom, 'Dupont');
      expect(authenticated.user.prenom, 'Jean');
      expect(authenticated.user.email, 'test@artjardin.fr');
      expect(authenticated.user.role, UserRole.employe);
    });

    test('login after session-expired works normally', () async {
      notifier.handleSessionExpired();
      expect(notifier.state, isA<AuthError>());

      when(() => mockRepo.login(
            email: any(named: 'email'),
            password: any(named: 'password'),
          )).thenAnswer((_) async => _testAuthResponse());

      await notifier.loginWithPassword(
        email: 'test@artjardin.fr',
        password: 'secret',
      );

      expect(notifier.state, isA<AuthAuthenticated>());
    });
  });
}
