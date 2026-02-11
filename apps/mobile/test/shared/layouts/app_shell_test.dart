import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:art_et_jardin/features/auth/domain/auth_state.dart';
import 'package:art_et_jardin/features/auth/presentation/auth_notifier.dart';
import 'package:art_et_jardin/features/auth/domain/auth_repository.dart';
import 'package:art_et_jardin/services/biometric/biometric_service.dart';
import 'package:art_et_jardin/shared/layouts/app_shell.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

class MockBiometricService extends Mock implements BiometricService {}

User _testUser() => User(
      id: '1',
      email: 'test@artjardin.fr',
      nom: 'Dupont',
      prenom: 'Jean',
      role: UserRole.employe,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Widget _buildAppWithShell({
  required String initialLocation,
  required List<Override> overrides,
}) {
  final router = GoRouter(
    initialLocation: initialLocation,
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/',
            name: 'dashboard',
            builder: (context, state) =>
                const Center(child: Text('Dashboard Content')),
          ),
          GoRoute(
            path: '/clients',
            name: 'clients',
            builder: (context, state) =>
                const Center(child: Text('Clients Content')),
          ),
          GoRoute(
            path: '/chantiers',
            name: 'chantiers',
            builder: (context, state) =>
                const Center(child: Text('Chantiers Content')),
          ),
          GoRoute(
            path: '/devis',
            name: 'devis',
            builder: (context, state) =>
                const Center(child: Text('Devis Content')),
          ),
          GoRoute(
            path: '/calendar',
            name: 'calendar',
            builder: (context, state) =>
                const Center(child: Text('Calendrier Content')),
          ),
          GoRoute(
            path: '/analytics',
            name: 'analytics',
            builder: (context, state) =>
                const Center(child: Text('Analytics Content')),
          ),
          GoRoute(
            path: '/settings',
            name: 'settings',
            builder: (context, state) =>
                const Center(child: Text('Settings Content')),
          ),
          GoRoute(
            path: '/notifications',
            name: 'notifications',
            builder: (context, state) =>
                const Center(child: Text('Notifications Content')),
          ),
          GoRoute(
            path: '/search',
            name: 'search',
            builder: (context, state) =>
                const Center(child: Text('Search Content')),
          ),
        ],
      ),
    ],
  );

  return ProviderScope(
    overrides: overrides,
    child: MaterialApp.router(routerConfig: router),
  );
}

void main() {
  late MockAuthRepository mockRepo;
  late MockBiometricService mockBio;
  late List<Override> overrides;

  setUp(() {
    mockRepo = MockAuthRepository();
    mockBio = MockBiometricService();

    overrides = [
      authNotifierProvider.overrideWith((ref) {
        return AuthNotifier(
          repository: mockRepo,
          biometricService: mockBio,
        )..state = AuthAuthenticated(_testUser());
      }),
    ];
  });

  group('AppShell', () {
    testWidgets('shows 6 navigation items', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsWidgets);
      expect(find.text('Clients'), findsWidgets);
      expect(find.text('Chantiers'), findsWidgets);
      expect(find.text('Devis'), findsWidgets);
      expect(find.text('Calendrier'), findsWidgets);
      expect(find.text('Analytics'), findsWidgets);
    });

    testWidgets('tap Clients navigates to /clients', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      // Find the Clients text in NavigationBar (not in AppBar)
      final clientsNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Clients'),
      );
      await tester.tap(clientsNav.first);
      await tester.pumpAndSettle();

      expect(find.text('Clients Content'), findsOneWidget);
    });

    testWidgets('tap Chantiers navigates to /chantiers', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      final chantiersNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Chantiers'),
      );
      await tester.tap(chantiersNav.first);
      await tester.pumpAndSettle();

      expect(find.text('Chantiers Content'), findsOneWidget);
    });

    testWidgets('tap Devis navigates to /devis', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      final devisNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Devis'),
      );
      await tester.tap(devisNav.first);
      await tester.pumpAndSettle();

      expect(find.text('Devis Content'), findsOneWidget);
    });

    testWidgets('tap Calendrier navigates to /calendar', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      final calendarNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Calendrier'),
      );
      await tester.tap(calendarNav.first);
      await tester.pumpAndSettle();

      expect(find.text('Calendrier Content'), findsOneWidget);
    });

    testWidgets('tap Analytics navigates to /analytics', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      final analyticsNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Analytics'),
      );
      await tester.tap(analyticsNav.first);
      await tester.pumpAndSettle();

      expect(find.text('Analytics Content'), findsOneWidget);
    });

    testWidgets('AppBar shows page title', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      // Dashboard title in AppBar
      final appBar = find.byType(AppBar);
      expect(appBar, findsOneWidget);

      // Navigate to Clients and verify title changes
      final clientsNav = find.descendant(
        of: find.byType(NavigationBar),
        matching: find.text('Clients'),
      );
      await tester.tap(clientsNav.first);
      await tester.pumpAndSettle();

      // AppBar should show "Clients"
      expect(
        find.descendant(of: appBar, matching: find.text('Clients')),
        findsOneWidget,
      );
    });

    testWidgets('SafeArea is present', (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      expect(find.byType(SafeArea), findsWidgets);
    });

    testWidgets('AppBar has settings and notifications actions',
        (tester) async {
      await tester.pumpWidget(_buildAppWithShell(
        initialLocation: '/',
        overrides: overrides,
      ));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.settings_outlined), findsOneWidget);
      expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);
      expect(find.byIcon(Icons.search), findsOneWidget);
    });
  });
}
