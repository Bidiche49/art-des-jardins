import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/features/onboarding/data/onboarding_repository_impl.dart';
import 'package:art_et_jardin/features/onboarding/domain/onboarding_repository.dart';
import 'package:art_et_jardin/features/onboarding/presentation/providers/onboarding_providers.dart';
import 'package:art_et_jardin/features/onboarding/presentation/widgets/onboarding_overlay.dart';

class MockOnboardingRepository extends Mock implements OnboardingRepository {}

void main() {
  late MockOnboardingRepository mockRepository;

  final patronSteps = [
    const OnboardingStepData(
      title: 'Bienvenue',
      description: 'Decouvrez Art & Jardin.',
      icon: 'wave',
      targetRoute: '/',
    ),
    const OnboardingStepData(
      title: 'Dashboard',
      description: 'Visualisez vos KPI.',
      icon: 'dashboard',
      targetRoute: '/',
    ),
    const OnboardingStepData(
      title: 'Clients',
      description: 'Gerez vos clients.',
      icon: 'people',
      targetRoute: '/clients',
    ),
  ];

  setUp(() {
    mockRepository = MockOnboardingRepository();
    when(() => mockRepository.isCompleted()).thenReturn(false);
    when(() => mockRepository.getStep()).thenReturn(0);
    when(() => mockRepository.setStep(any())).thenAnswer((_) async {});
    when(() => mockRepository.setCompleted(any())).thenAnswer((_) async {});
    when(() => mockRepository.saveStepToApi(any())).thenAnswer((_) async {});
    when(() => mockRepository.completeOnApi()).thenAnswer((_) async {});
    when(() => mockRepository.getStepsForRole(UserRole.patron))
        .thenReturn(patronSteps);
  });

  Widget buildTestWidget({int initialStep = 0}) {
    when(() => mockRepository.getStep()).thenReturn(initialStep);
    return ProviderScope(
      overrides: [
        onboardingRepositoryProvider.overrideWithValue(mockRepository),
      ],
      child: MaterialApp(
        home: Builder(
          builder: (context) {
            return const Stack(
              children: [
                Scaffold(body: Center(child: Text('App Content'))),
                OnboardingOverlay(),
              ],
            );
          },
        ),
      ),
    );
  }

  /// Builds and initializes onboarding.
  Future<ProviderContainer> pumpAndInitialize(
    WidgetTester tester, {
    int initialStep = 0,
  }) async {
    when(() => mockRepository.getStep()).thenReturn(initialStep);
    final container = ProviderContainer(
      overrides: [
        onboardingRepositoryProvider.overrideWithValue(mockRepository),
      ],
    );
    container
        .read(onboardingNotifierProvider.notifier)
        .initialize(UserRole.patron);

    await tester.pumpWidget(
      UncontrolledProviderScope(
        container: container,
        child: const MaterialApp(
          home: Stack(
            children: [
              Scaffold(body: Center(child: Text('App Content'))),
              OnboardingOverlay(),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    return container;
  }

  group('OnboardingOverlay', () {
    testWidgets('shows nothing when not initialized', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      // Overlay should not be visible (empty state, no steps)
      expect(find.text('Bienvenue'), findsNothing);
    });

    testWidgets('overlay mask is visible when initialized', (tester) async {
      await pumpAndInitialize(tester);

      // Dark overlay container should exist
      expect(find.byType(OnboardingOverlay), findsOneWidget);
      // First step title visible
      expect(find.text('Bienvenue'), findsOneWidget);
    });

    testWidgets('tooltip shows title and description', (tester) async {
      await pumpAndInitialize(tester);

      expect(find.text('Bienvenue'), findsOneWidget);
      expect(find.text('Decouvrez Art & Jardin.'), findsOneWidget);
    });

    testWidgets('progress bar shows X/N', (tester) async {
      await pumpAndInitialize(tester);

      expect(find.text('1 / 3'), findsOneWidget);
      expect(find.byType(LinearProgressIndicator), findsOneWidget);
    });

    testWidgets('Suivant button is visible', (tester) async {
      await pumpAndInitialize(tester);

      expect(find.text('Suivant'), findsOneWidget);
    });

    testWidgets('Passer button is visible', (tester) async {
      await pumpAndInitialize(tester);

      expect(find.text('Passer'), findsOneWidget);
    });

    testWidgets('Retour button NOT visible at step 0', (tester) async {
      await pumpAndInitialize(tester);

      expect(find.text('Retour'), findsNothing);
    });

    testWidgets('Retour button visible at step > 0', (tester) async {
      await pumpAndInitialize(tester, initialStep: 1);

      expect(find.text('Retour'), findsOneWidget);
    });
  });

  group('OnboardingOverlay - navigation', () {
    testWidgets('tap Suivant goes to next step', (tester) async {
      final container = await pumpAndInitialize(tester);

      await tester.tap(find.text('Suivant'));
      await tester.pumpAndSettle();

      expect(
        container.read(onboardingNotifierProvider).currentStep,
        1,
      );
      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('tap Retour goes to previous step', (tester) async {
      final container = await pumpAndInitialize(tester, initialStep: 1);

      expect(find.text('Dashboard'), findsOneWidget);

      await tester.tap(find.text('Retour'));
      await tester.pumpAndSettle();

      expect(
        container.read(onboardingNotifierProvider).currentStep,
        0,
      );
      expect(find.text('Bienvenue'), findsOneWidget);
    });

    testWidgets('tap Passer closes onboarding', (tester) async {
      final container = await pumpAndInitialize(tester);

      await tester.tap(find.text('Passer'));
      await tester.pumpAndSettle();

      expect(
        container.read(onboardingNotifierProvider).isCompleted,
        true,
      );
      // Overlay should be gone
      expect(find.text('Bienvenue'), findsNothing);
    });

    testWidgets('last step shows Terminer button', (tester) async {
      await pumpAndInitialize(tester, initialStep: 2);

      expect(find.text('Terminer'), findsOneWidget);
      expect(find.text('Suivant'), findsNothing);
    });

    testWidgets('tap Terminer completes and calls API', (tester) async {
      final container = await pumpAndInitialize(tester, initialStep: 2);

      await tester.tap(find.text('Terminer'));
      await tester.pumpAndSettle();

      expect(
        container.read(onboardingNotifierProvider).isCompleted,
        true,
      );
      verify(() => mockRepository.completeOnApi()).called(1);
    });

    testWidgets('overlay disappears after completion', (tester) async {
      await pumpAndInitialize(tester, initialStep: 2);
      expect(find.text('Clients'), findsOneWidget);

      await tester.tap(find.text('Terminer'));
      await tester.pumpAndSettle();

      // Overlay content gone
      expect(find.text('Clients'), findsNothing);
      // SizedBox.shrink returned
      expect(find.text('App Content'), findsOneWidget);
    });
  });
}
