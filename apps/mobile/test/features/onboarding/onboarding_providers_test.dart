import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/features/onboarding/domain/onboarding_repository.dart';
import 'package:art_et_jardin/features/onboarding/presentation/providers/onboarding_providers.dart';

class MockOnboardingRepository extends Mock implements OnboardingRepository {}

void main() {
  late MockOnboardingRepository mockRepository;
  late OnboardingNotifier notifier;

  final patronSteps = List.generate(
    8,
    (i) => OnboardingStepData(
      title: 'Step $i',
      description: 'Description $i',
      icon: 'wave',
    ),
  );

  final employeSteps = List.generate(
    5,
    (i) => OnboardingStepData(
      title: 'Step $i',
      description: 'Description $i',
      icon: 'wave',
    ),
  );

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
    when(() => mockRepository.getStepsForRole(UserRole.employe))
        .thenReturn(employeSteps);

    notifier = OnboardingNotifier(repository: mockRepository);
  });

  group('OnboardingState', () {
    test('default state has correct values', () {
      const state = OnboardingState();
      expect(state.currentStep, 0);
      expect(state.totalSteps, 0);
      expect(state.isCompleted, false);
      expect(state.steps, isEmpty);
      expect(state.role, UserRole.employe);
      expect(state.currentStepData, isNull);
      expect(state.isLastStep, true); // 0 >= 0 - 1
    });

    test('copyWith preserves unchanged values', () {
      final state = OnboardingState(
        currentStep: 3,
        totalSteps: 8,
        isCompleted: false,
        steps: patronSteps,
        role: UserRole.patron,
      );

      final copied = state.copyWith(currentStep: 5);
      expect(copied.currentStep, 5);
      expect(copied.totalSteps, 8);
      expect(copied.isCompleted, false);
      expect(copied.steps, patronSteps);
      expect(copied.role, UserRole.patron);
    });

    test('currentStepData returns correct step', () {
      final state = OnboardingState(
        currentStep: 2,
        totalSteps: 5,
        steps: employeSteps,
      );
      expect(state.currentStepData, employeSteps[2]);
    });

    test('isLastStep true when on last step', () {
      final state = OnboardingState(
        currentStep: 4,
        totalSteps: 5,
        steps: employeSteps,
      );
      expect(state.isLastStep, true);
    });
  });

  group('OnboardingNotifier - initialize', () {
    test('patron gets 8 steps', () {
      notifier.initialize(UserRole.patron);
      expect(notifier.state.totalSteps, 8);
      expect(notifier.state.steps.length, 8);
      expect(notifier.state.role, UserRole.patron);
    });

    test('employe gets 5 steps', () {
      notifier.initialize(UserRole.employe);
      expect(notifier.state.totalSteps, 5);
      expect(notifier.state.steps.length, 5);
      expect(notifier.state.role, UserRole.employe);
    });

    test('initial step = 0 when not previously saved', () {
      when(() => mockRepository.getStep()).thenReturn(0);
      notifier.initialize(UserRole.patron);
      expect(notifier.state.currentStep, 0);
    });

    test('resumes from last saved step', () {
      when(() => mockRepository.getStep()).thenReturn(3);
      notifier.initialize(UserRole.patron);
      expect(notifier.state.currentStep, 3);
    });

    test('clamps step to max if saved step exceeds steps', () {
      when(() => mockRepository.getStep()).thenReturn(99);
      notifier.initialize(UserRole.employe);
      expect(notifier.state.currentStep, 4); // 5 steps, max index = 4
    });

    test('already completed -> isCompleted true, no steps loaded', () {
      when(() => mockRepository.isCompleted()).thenReturn(true);
      notifier.initialize(UserRole.patron);
      expect(notifier.state.isCompleted, true);
      expect(notifier.state.steps, isEmpty);
    });
  });

  group('OnboardingNotifier - navigation', () {
    test('nextStep increments correctly', () async {
      notifier.initialize(UserRole.patron);
      expect(notifier.state.currentStep, 0);

      await notifier.nextStep();
      expect(notifier.state.currentStep, 1);
    });

    test('nextStep saves step locally', () async {
      notifier.initialize(UserRole.patron);
      await notifier.nextStep();
      verify(() => mockRepository.setStep(1)).called(1);
    });

    test('nextStep calls API save', () async {
      notifier.initialize(UserRole.patron);
      await notifier.nextStep();
      verify(() => mockRepository.saveStepToApi(1)).called(1);
    });

    test('previousStep decrements correctly', () async {
      when(() => mockRepository.getStep()).thenReturn(3);
      notifier.initialize(UserRole.patron);
      expect(notifier.state.currentStep, 3);

      await notifier.previousStep();
      expect(notifier.state.currentStep, 2);
    });

    test('previousStep does nothing at step 0', () async {
      notifier.initialize(UserRole.patron);
      expect(notifier.state.currentStep, 0);

      await notifier.previousStep();
      expect(notifier.state.currentStep, 0);
      verifyNever(() => mockRepository.setStep(any()));
    });

    test('complete at last step calls API', () async {
      when(() => mockRepository.getStep()).thenReturn(7);
      notifier.initialize(UserRole.patron);
      expect(notifier.state.isLastStep, true);

      await notifier.nextStep(); // On last step, triggers complete
      expect(notifier.state.isCompleted, true);
      verify(() => mockRepository.setCompleted(true)).called(1);
      verify(() => mockRepository.completeOnApi()).called(1);
    });

    test('skip marks as completed', () async {
      notifier.initialize(UserRole.patron);
      await notifier.skip();
      expect(notifier.state.isCompleted, true);
      verify(() => mockRepository.setCompleted(true)).called(1);
      verify(() => mockRepository.completeOnApi()).called(1);
    });

    test('nextStep does nothing when already completed', () async {
      when(() => mockRepository.isCompleted()).thenReturn(true);
      notifier.initialize(UserRole.patron);
      await notifier.nextStep();
      verifyNever(() => mockRepository.setStep(any()));
    });

    test('saveStepToApi is called as fire-and-forget', () async {
      notifier.initialize(UserRole.patron);
      await notifier.nextStep();

      // saveStepToApi is called (not awaited) so navigation is not blocked
      verify(() => mockRepository.saveStepToApi(1)).called(1);
      expect(notifier.state.currentStep, 1);
    });
  });
}
