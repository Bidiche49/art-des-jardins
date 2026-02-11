import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/onboarding_repository.dart';
import '../providers/onboarding_providers.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    final currentStep = ref.read(onboardingNotifierProvider).currentStep;
    _pageController = PageController(initialPage: currentStep);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _animateToPage(int page) {
    _pageController.animateToPage(
      page,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(onboardingNotifierProvider);
    final notifier = ref.read(onboardingNotifierProvider.notifier);

    ref.listen<OnboardingState>(onboardingNotifierProvider, (prev, next) {
      if (prev != null && prev.currentStep != next.currentStep && !next.isCompleted) {
        _animateToPage(next.currentStep);
      }
      if (next.isCompleted && mounted) {
        Navigator.of(context).pop();
      }
    });

    if (state.steps.isEmpty) return const SizedBox.shrink();

    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: TextButton(
                  onPressed: notifier.skip,
                  child: const Text('Passer'),
                ),
              ),
            ),

            // PageView with steps
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: state.totalSteps,
                itemBuilder: (context, index) {
                  return _StepContent(stepData: state.steps[index]);
                },
              ),
            ),

            // Progress
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  Text(
                    '${state.currentStep + 1} / ${state.totalSteps}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: (state.currentStep + 1) / state.totalSteps,
                    borderRadius: BorderRadius.circular(4),
                    minHeight: 4,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Navigation
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (state.currentStep > 0)
                    TextButton(
                      onPressed: notifier.previousStep,
                      child: const Text('Retour'),
                    )
                  else
                    const SizedBox(width: 80),
                  FilledButton(
                    onPressed: notifier.nextStep,
                    child:
                        Text(state.isLastStep ? 'Terminer' : 'Suivant'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

IconData _iconForStep(String iconName) {
  return switch (iconName) {
    'wave' => Icons.waving_hand,
    'dashboard' => Icons.dashboard,
    'people' => Icons.people,
    'construction' => Icons.construction,
    'description' => Icons.description,
    'calendar' => Icons.calendar_month,
    'chart' => Icons.bar_chart,
    'terrain' => Icons.terrain,
    'build' => Icons.build,
    'offline' => Icons.cloud_off,
    _ => Icons.info_outline,
  };
}

class _StepContent extends StatelessWidget {
  const _StepContent({required this.stepData});

  final OnboardingStepData stepData;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              shape: BoxShape.circle,
            ),
            child: Icon(
              _iconForStep(stepData.icon),
              size: 48,
              color: colorScheme.primary,
            ),
          ),
          const SizedBox(height: 32),
          Text(
            stepData.title,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            stepData.description,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
