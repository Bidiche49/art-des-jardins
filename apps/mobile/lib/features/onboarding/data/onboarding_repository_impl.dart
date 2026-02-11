import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/dio_client.dart';
import '../../../data/local/preferences/app_preferences.dart';
import '../../../domain/enums/user_role.dart';
import '../domain/onboarding_repository.dart';

final onboardingRepositoryProvider = Provider<OnboardingRepository>((ref) {
  return OnboardingRepositoryImpl(
    preferences: ref.read(appPreferencesProvider),
    dio: ref.read(authDioProvider),
  );
});

class OnboardingRepositoryImpl implements OnboardingRepository {
  OnboardingRepositoryImpl({
    required AppPreferences preferences,
    required Dio dio,
  })  : _preferences = preferences,
        _dio = dio;

  final AppPreferences _preferences;
  final Dio _dio;

  @override
  bool isCompleted() => _preferences.onboardingCompleted;

  @override
  Future<void> setCompleted(bool value) async {
    await _preferences.setOnboardingCompleted(value);
  }

  @override
  int getStep() => _preferences.onboardingStep;

  @override
  Future<void> setStep(int step) async {
    await _preferences.setOnboardingStep(step);
  }

  @override
  Future<void> saveStepToApi(int step) async {
    try {
      await _dio.patch('/auth/onboarding/step', data: {'step': step});
    } catch (_) {
      // Silently fail - onboarding step save is non-blocking
    }
  }

  @override
  Future<void> completeOnApi() async {
    try {
      await _dio.patch('/auth/onboarding/complete');
    } catch (_) {
      // Silently fail - onboarding complete save is non-blocking
    }
  }

  @override
  List<OnboardingStepData> getStepsForRole(UserRole role) {
    return role == UserRole.patron ? _patronSteps : _employeSteps;
  }

  static const _patronSteps = [
    OnboardingStepData(
      title: 'Bienvenue',
      description: 'Decouvrez Art & Jardin, votre outil de gestion complet.',
      icon: 'wave',
      targetRoute: '/',
    ),
    OnboardingStepData(
      title: 'Dashboard',
      description:
          'Visualisez vos KPI, chiffre d\'affaires et interventions a venir.',
      icon: 'dashboard',
      targetRoute: '/',
    ),
    OnboardingStepData(
      title: 'Clients',
      description: 'Gerez votre base clients : particuliers, pros, syndics.',
      icon: 'people',
      targetRoute: '/clients',
    ),
    OnboardingStepData(
      title: 'Chantiers',
      description:
          'Suivez vos chantiers de A a Z avec suivi de rentabilite.',
      icon: 'construction',
      targetRoute: '/chantiers',
    ),
    OnboardingStepData(
      title: 'Devis',
      description:
          'Creez des devis pro avec templates, envoi et signature en ligne.',
      icon: 'description',
      targetRoute: '/devis',
    ),
    OnboardingStepData(
      title: 'Calendrier',
      description:
          'Planifiez interventions et absences, consultez la meteo.',
      icon: 'calendar',
      targetRoute: '/calendar',
    ),
    OnboardingStepData(
      title: 'Analytics',
      description:
          'Analysez votre CA, marges et finances en detail.',
      icon: 'chart',
      targetRoute: '/analytics',
    ),
    OnboardingStepData(
      title: 'Mode terrain',
      description:
          'Activez le mode terrain pour des boutons plus gros sur le chantier.',
      icon: 'terrain',
      targetRoute: '/settings',
    ),
  ];

  static const _employeSteps = [
    OnboardingStepData(
      title: 'Bienvenue',
      description: 'Decouvrez Art & Jardin, votre outil terrain.',
      icon: 'wave',
      targetRoute: '/',
    ),
    OnboardingStepData(
      title: 'Interventions',
      description:
          'Consultez vos interventions, ajoutez des photos avant/apres.',
      icon: 'build',
      targetRoute: '/interventions',
    ),
    OnboardingStepData(
      title: 'Calendrier',
      description: 'Voyez votre planning et posez vos absences.',
      icon: 'calendar',
      targetRoute: '/calendar',
    ),
    OnboardingStepData(
      title: 'Mode terrain',
      description:
          'Activez le mode terrain pour des cibles tactiles plus grandes.',
      icon: 'terrain',
      targetRoute: '/settings',
    ),
    OnboardingStepData(
      title: 'Mode hors-ligne',
      description:
          'L\'app fonctionne sans reseau. Vos donnees se synchronisent automatiquement.',
      icon: 'offline',
      targetRoute: null,
    ),
  ];
}
