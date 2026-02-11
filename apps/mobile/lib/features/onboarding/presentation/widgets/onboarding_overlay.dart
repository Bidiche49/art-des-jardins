import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/onboarding_repository.dart';
import '../providers/onboarding_providers.dart';

class OnboardingOverlay extends ConsumerWidget {
  const OnboardingOverlay({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(onboardingNotifierProvider);

    if (state.isCompleted || state.steps.isEmpty) {
      return const SizedBox.shrink();
    }

    final stepData = state.currentStepData;
    if (stepData == null) return const SizedBox.shrink();

    return Stack(
      children: [
        // Dark overlay
        Positioned.fill(
          child: GestureDetector(
            onTap: () {}, // Block taps through overlay
            child: Container(
              color: Colors.black54,
            ),
          ),
        ),
        // Tooltip card
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: _OnboardingTooltip(
              stepData: stepData,
              currentStep: state.currentStep,
              totalSteps: state.totalSteps,
              isLastStep: state.isLastStep,
              onNext: () =>
                  ref.read(onboardingNotifierProvider.notifier).nextStep(),
              onPrevious: state.currentStep > 0
                  ? () => ref
                      .read(onboardingNotifierProvider.notifier)
                      .previousStep()
                  : null,
              onSkip: () =>
                  ref.read(onboardingNotifierProvider.notifier).skip(),
            ),
          ),
        ),
      ],
    );
  }
}

class _OnboardingTooltip extends StatelessWidget {
  const _OnboardingTooltip({
    required this.stepData,
    required this.currentStep,
    required this.totalSteps,
    required this.isLastStep,
    required this.onNext,
    required this.onSkip,
    this.onPrevious,
  });

  final OnboardingStepData stepData;
  final int currentStep;
  final int totalSteps;
  final bool isLastStep;
  final VoidCallback onNext;
  final VoidCallback onSkip;
  final VoidCallback? onPrevious;

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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                _iconForStep(stepData.icon),
                size: 32,
                color: colorScheme.primary,
              ),
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              stepData.title,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),

            // Description
            Text(
              stepData.description,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            // Progress bar
            _ProgressIndicator(
              currentStep: currentStep,
              totalSteps: totalSteps,
            ),
            const SizedBox(height: 16),

            // Navigation buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Skip button
                TextButton(
                  onPressed: onSkip,
                  child: const Text('Passer'),
                ),

                // Back + Next
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (onPrevious != null)
                      TextButton(
                        onPressed: onPrevious,
                        child: const Text('Retour'),
                      ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: onNext,
                      child: Text(isLastStep ? 'Terminer' : 'Suivant'),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProgressIndicator extends StatelessWidget {
  const _ProgressIndicator({
    required this.currentStep,
    required this.totalSteps,
  });

  final int currentStep;
  final int totalSteps;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        Text(
          '${currentStep + 1} / $totalSteps',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: (currentStep + 1) / totalSteps,
          borderRadius: BorderRadius.circular(4),
          minHeight: 4,
        ),
      ],
    );
  }
}
