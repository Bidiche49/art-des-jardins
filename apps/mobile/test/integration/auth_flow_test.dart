import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/domain/models/auth_response.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:art_et_jardin/features/auth/domain/auth_repository.dart';
import 'package:art_et_jardin/features/auth/domain/auth_state.dart';
import 'package:art_et_jardin/features/auth/presentation/auth_notifier.dart';
import 'package:art_et_jardin/services/biometric/biometric_service.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

class MockBiometricService extends Mock implements BiometricService {}

User _testUser({String id = 'u1', UserRole role = UserRole.employe}) => User(
      id: id,
      email: 'test@artetjardin.fr',
      nom: 'Dupont',
      prenom: 'Jean',
      role: role,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

AuthResponse _testAuthResponse({UserRole role = UserRole.employe}) =>
    AuthResponse(
      user: _testUser(role: role),
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    );

void main() {
  late MockAuthRepository mockRepo;
  late MockBiometricService mockBiometric;
  late AuthNotifier notifier;

  setUp(() {
    mockRepo = MockAuthRepository();
    mockBiometric = MockBiometricService();
  });

  tearDown(() {
    notifier.dispose();
  });

  group('Auth Flow Integration', () {
    test('login email/password -> authenticated state', () async {
      when(() => mockRepo.login(email: 'test@test.fr', password: 'pass'))
          .thenAnswer((_) async => _testAuthResponse());

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.loginWithPassword(email: 'test@test.fr', password: 'pass');

      expect(notifier.state, isA<AuthAuthenticated>());
      final auth = notifier.state as AuthAuthenticated;
      expect(auth.user.email, 'test@artetjardin.fr');
      expect(auth.user.nom, 'Dupont');
    });

    test('login with bad credentials -> error state', () async {
      when(() => mockRepo.login(email: any(named: 'email'), password: any(named: 'password')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(),
        response: Response(
          requestOptions: RequestOptions(),
          statusCode: 401,
        ),
      ));

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.loginWithPassword(email: 'bad@test.fr', password: 'wrong');

      expect(notifier.state, isA<AuthError>());
      final error = notifier.state as AuthError;
      expect(error.message, 'Identifiants incorrects');
    });

    test('logout -> unauthenticated state', () async {
      when(() => mockRepo.login(email: any(named: 'email'), password: any(named: 'password')))
          .thenAnswer((_) async => _testAuthResponse());
      when(() => mockRepo.logout()).thenAnswer((_) async {});

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );

      await notifier.loginWithPassword(email: 'test@test.fr', password: 'pass');
      expect(notifier.state, isA<AuthAuthenticated>());

      await notifier.logout();
      expect(notifier.state, isA<AuthUnauthenticated>());
    });

    test('biometric login -> authenticated state', () async {
      when(() => mockBiometric.isAvailable()).thenAnswer((_) async => true);
      when(() => mockBiometric.authenticate()).thenAnswer((_) async => true);
      when(() => mockRepo.refresh())
          .thenAnswer((_) async => _testAuthResponse());

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.loginWithBiometric();

      expect(notifier.state, isA<AuthAuthenticated>());
    });

    test('session expired -> error state with message', () async {
      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      notifier.handleSessionExpired();

      expect(notifier.state, isA<AuthError>());
      final error = notifier.state as AuthError;
      expect(error.message, contains('expire'));
    });

    test('checkAuth when authenticated -> authenticated state', () async {
      when(() => mockRepo.isAuthenticated()).thenAnswer((_) async => true);
      when(() => mockRepo.getCurrentUser())
          .thenAnswer((_) async => _testUser());

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.checkAuth();

      expect(notifier.state, isA<AuthAuthenticated>());
    });

    test('checkAuth when not authenticated -> unauthenticated', () async {
      when(() => mockRepo.isAuthenticated()).thenAnswer((_) async => false);

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.checkAuth();

      expect(notifier.state, isA<AuthUnauthenticated>());
    });

    test('network error during login -> meaningful error message', () async {
      when(() => mockRepo.login(email: any(named: 'email'), password: any(named: 'password')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(),
        type: DioExceptionType.connectionError,
      ));

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );
      await notifier.loginWithPassword(email: 'test@test.fr', password: 'pass');

      expect(notifier.state, isA<AuthError>());
      final error = notifier.state as AuthError;
      expect(error.message, 'Erreur reseau');
    });

    test('double login attempt is prevented', () async {
      var callCount = 0;
      when(() => mockRepo.login(email: any(named: 'email'), password: any(named: 'password')))
          .thenAnswer((_) async {
        callCount++;
        await Future<void>.delayed(const Duration(milliseconds: 100));
        return _testAuthResponse();
      });

      notifier = AuthNotifier(
        repository: mockRepo,
        biometricService: mockBiometric,
      );

      // Start two logins simultaneously
      final f1 = notifier.loginWithPassword(email: 'a@b.fr', password: 'p');
      final f2 = notifier.loginWithPassword(email: 'a@b.fr', password: 'p');
      await Future.wait([f1, f2]);

      // Only one login should have been executed
      expect(callCount, 1);
    });
  });
}
