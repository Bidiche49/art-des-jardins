import '../../../domain/enums/user_role.dart';

/// Onboarding step definition.
class OnboardingStepData {
  const OnboardingStepData({
    required this.title,
    required this.description,
    required this.icon,
    this.targetRoute,
  });

  final String title;
  final String description;
  final String icon;
  final String? targetRoute;
}

/// Abstract repository for onboarding tour state.
abstract class OnboardingRepository {
  /// Whether onboarding has been completed.
  bool isCompleted();

  /// Marks onboarding as completed locally.
  Future<void> setCompleted(bool value);

  /// Gets the last saved step index.
  int getStep();

  /// Saves the current step index locally.
  Future<void> setStep(int step);

  /// Persists the current step to the API.
  Future<void> saveStepToApi(int step);

  /// Marks onboarding as complete on the API.
  Future<void> completeOnApi();

  /// Returns the onboarding steps for the given role.
  List<OnboardingStepData> getStepsForRole(UserRole role);
}
