import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/enums/user_role.dart';
import '../../data/onboarding_repository_impl.dart';
import '../../domain/onboarding_repository.dart';

/// Onboarding state.
class OnboardingState {
  const OnboardingState({
    this.currentStep = 0,
    this.totalSteps = 0,
    this.isCompleted = false,
    this.steps = const [],
    this.role = UserRole.employe,
  });

  final int currentStep;
  final int totalSteps;
  final bool isCompleted;
  final List<OnboardingStepData> steps;
  final UserRole role;

  OnboardingState copyWith({
    int? currentStep,
    int? totalSteps,
    bool? isCompleted,
    List<OnboardingStepData>? steps,
    UserRole? role,
  }) {
    return OnboardingState(
      currentStep: currentStep ?? this.currentStep,
      totalSteps: totalSteps ?? this.totalSteps,
      isCompleted: isCompleted ?? this.isCompleted,
      steps: steps ?? this.steps,
      role: role ?? this.role,
    );
  }

  /// Current step data, or null if out of bounds.
  OnboardingStepData? get currentStepData {
    if (currentStep < 0 || currentStep >= steps.length) return null;
    return steps[currentStep];
  }

  /// Whether we're on the last step.
  bool get isLastStep => currentStep >= totalSteps - 1;
}

class OnboardingNotifier extends StateNotifier<OnboardingState> {
  OnboardingNotifier({
    required OnboardingRepository repository,
  })  : _repository = repository,
        super(const OnboardingState());

  final OnboardingRepository _repository;

  /// Initialize onboarding for the given role.
  void initialize(UserRole role) {
    final completed = _repository.isCompleted();
    if (completed) {
      state = OnboardingState(isCompleted: true, role: role);
      return;
    }

    final steps = _repository.getStepsForRole(role);
    final savedStep = _repository.getStep();
    final clampedStep = savedStep.clamp(0, steps.length - 1);

    state = OnboardingState(
      currentStep: clampedStep,
      totalSteps: steps.length,
      isCompleted: false,
      steps: steps,
      role: role,
    );
  }

  /// Advance to the next step. If on the last step, completes onboarding.
  Future<void> nextStep() async {
    if (state.isCompleted) return;

    if (state.isLastStep) {
      await complete();
      return;
    }

    final next = state.currentStep + 1;
    state = state.copyWith(currentStep: next);
    await _repository.setStep(next);
    _repository.saveStepToApi(next);
  }

  /// Go back to the previous step.
  Future<void> previousStep() async {
    if (state.isCompleted || state.currentStep <= 0) return;

    final prev = state.currentStep - 1;
    state = state.copyWith(currentStep: prev);
    await _repository.setStep(prev);
  }

  /// Skip the onboarding tour entirely.
  Future<void> skip() async {
    state = state.copyWith(isCompleted: true);
    await _repository.setCompleted(true);
    _repository.completeOnApi();
  }

  /// Complete the onboarding tour.
  Future<void> complete() async {
    state = state.copyWith(isCompleted: true);
    await _repository.setCompleted(true);
    _repository.completeOnApi();
  }
}

final onboardingNotifierProvider =
    StateNotifierProvider<OnboardingNotifier, OnboardingState>((ref) {
  return OnboardingNotifier(
    repository: ref.read(onboardingRepositoryProvider),
  );
});
