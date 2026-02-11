import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/router/auth_guard.dart';
import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:art_et_jardin/features/auth/domain/auth_state.dart';

class MockGoRouterState extends Mock implements GoRouterState {}

User _testUser() => User(
      id: '1',
      email: 'test@artjardin.fr',
      nom: 'Dupont',
      prenom: 'Jean',
      role: UserRole.employe,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockGoRouterState mockState;

  setUp(() {
    mockState = MockGoRouterState();
  });

  group('authGuard', () {
    test('unauthenticated + protected route -> redirect /login', () {
      when(() => mockState.matchedLocation).thenReturn('/clients');

      final result = authGuard(mockState, const AuthUnauthenticated());

      expect(result, '/login');
    });

    test('authenticated + protected route -> access allowed', () {
      when(() => mockState.matchedLocation).thenReturn('/clients');

      final result = authGuard(mockState, AuthAuthenticated(_testUser()));

      expect(result, isNull);
    });

    test('unauthenticated + /login -> stays on /login', () {
      when(() => mockState.matchedLocation).thenReturn('/login');

      final result = authGuard(mockState, const AuthUnauthenticated());

      expect(result, isNull);
    });

    test('authenticated + /login -> redirect to /', () {
      when(() => mockState.matchedLocation).thenReturn('/login');

      final result = authGuard(mockState, AuthAuthenticated(_testUser()));

      expect(result, '/');
    });

    test('unauthenticated + /signer/:token -> access allowed (public)', () {
      when(() => mockState.matchedLocation).thenReturn('/signer/abc-123');

      final result = authGuard(mockState, const AuthUnauthenticated());

      expect(result, isNull);
    });

    test('unauthenticated + dashboard -> redirect /login', () {
      when(() => mockState.matchedLocation).thenReturn('/');

      final result = authGuard(mockState, const AuthUnauthenticated());

      expect(result, '/login');
    });

    test('authenticated + deep link /clients/uuid -> allowed', () {
      when(() => mockState.matchedLocation)
          .thenReturn('/clients/550e8400-e29b-41d4-a716-446655440000');

      final result = authGuard(mockState, AuthAuthenticated(_testUser()));

      expect(result, isNull);
    });

    test('authenticated + deep link /devis/uuid -> allowed', () {
      when(() => mockState.matchedLocation)
          .thenReturn('/devis/550e8400-e29b-41d4-a716-446655440000');

      final result = authGuard(mockState, AuthAuthenticated(_testUser()));

      expect(result, isNull);
    });

    test('initial state + protected route -> redirect /login', () {
      when(() => mockState.matchedLocation).thenReturn('/chantiers');

      final result = authGuard(mockState, const AuthInitial());

      expect(result, '/login');
    });

    test('error state + protected route -> redirect /login', () {
      when(() => mockState.matchedLocation).thenReturn('/analytics');

      final result = authGuard(mockState, const AuthError('Session expiree'));

      expect(result, '/login');
    });
  });
}
