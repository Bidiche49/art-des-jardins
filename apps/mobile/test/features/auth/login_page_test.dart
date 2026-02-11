import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/auth/domain/auth_repository.dart';
import 'package:art_et_jardin/features/auth/presentation/auth_notifier.dart';
import 'package:art_et_jardin/features/auth/presentation/pages/login_page.dart';
import 'package:art_et_jardin/features/auth/presentation/widgets/session_expired_dialog.dart';
import 'package:art_et_jardin/services/biometric/biometric_service.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

class MockBiometricService extends Mock implements BiometricService {}

Widget _buildApp({
  required MockAuthRepository mockRepo,
  required MockBiometricService mockBio,
}) {
  return ProviderScope(
    overrides: [
      authNotifierProvider.overrideWith((ref) {
        final notifier = AuthNotifier(
          repository: mockRepo,
          biometricService: mockBio,
        );
        return notifier;
      }),
      biometricServiceProvider.overrideWithValue(mockBio),
    ],
    child: const MaterialApp(home: LoginPage()),
  );
}

void main() {
  late MockAuthRepository mockRepo;
  late MockBiometricService mockBio;

  setUp(() {
    mockRepo = MockAuthRepository();
    mockBio = MockBiometricService();

    when(() => mockBio.isAvailable()).thenAnswer((_) async => false);
    when(() => mockBio.isConfigured).thenReturn(false);
  });

  group('LoginPage', () {
    testWidgets('shows email and password fields', (tester) async {
      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Mot de passe'), findsOneWidget);
      expect(find.text('Se connecter'), findsOneWidget);
    });

    testWidgets('biometric button visible when biometrics available',
        (tester) async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => true);
      when(() => mockBio.isConfigured).thenReturn(true);

      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      expect(find.text('Biometrie'), findsOneWidget);
    });

    testWidgets('biometric button hidden when biometrics not available',
        (tester) async {
      when(() => mockBio.isAvailable()).thenAnswer((_) async => false);
      when(() => mockBio.isConfigured).thenReturn(false);

      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      expect(find.text('Biometrie'), findsNothing);
      expect(find.text('Empreinte'), findsNothing);
      expect(find.text('Face ID'), findsNothing);
    });

    testWidgets('email validation shows error on invalid', (tester) async {
      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      // Enter invalid email
      await tester.enterText(find.byType(TextFormField).first, 'notanemail');
      await tester.enterText(find.byType(TextFormField).last, 'password');
      await tester.tap(find.text('Se connecter'));
      await tester.pumpAndSettle();

      expect(find.text('Email invalide'), findsOneWidget);
    });

    testWidgets('password validation shows error when empty', (tester) async {
      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      await tester.enterText(
          find.byType(TextFormField).first, 'test@artjardin.fr');
      // Leave password empty
      await tester.tap(find.text('Se connecter'));
      await tester.pumpAndSettle();

      expect(
          find.text('Veuillez saisir votre mot de passe'), findsOneWidget);
    });

    testWidgets('shows Art & Jardin branding', (tester) async {
      await tester.pumpWidget(_buildApp(mockRepo: mockRepo, mockBio: mockBio));
      await tester.pumpAndSettle();

      expect(find.text('Art & Jardin'), findsOneWidget);
      expect(find.text('Espace employe'), findsOneWidget);
    });
  });

  group('SessionExpiredDialog', () {
    testWidgets('shows session expired message', (tester) async {
      bool reconnected = false;

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (context) => ElevatedButton(
            onPressed: () => SessionExpiredDialog.show(
              context,
              onReconnect: () => reconnected = true,
            ),
            child: const Text('Show'),
          ),
        ),
      ));

      await tester.tap(find.text('Show'));
      await tester.pumpAndSettle();

      expect(find.text('Session expiree'), findsOneWidget);
      expect(find.text('Se reconnecter'), findsOneWidget);

      await tester.tap(find.text('Se reconnecter'));
      await tester.pumpAndSettle();

      expect(reconnected, isTrue);
    });
  });
}
