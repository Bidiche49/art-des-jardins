import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/interventions_providers.dart';
import '../widgets/intervention_card.dart';
import '../widgets/week_navigator.dart';

const _dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

class InterventionsListPage extends ConsumerWidget {
  const InterventionsListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(interventionsWeekNotifierProvider);
    final notifier = ref.read(interventionsWeekNotifierProvider.notifier);
    final today = DateTime.now();

    return Scaffold(
      body: Column(
        children: [
          WeekNavigator(
            weekStart: notifier.weekStart,
            onPrevious: notifier.previousWeek,
            onNext: notifier.nextWeek,
            onToday: notifier.goToCurrentWeek,
          ),
          Expanded(
            child: state.when(
              loading: () => const Center(child: AejSpinner()),
              error: (error, _) => Center(
                child: Text('Erreur: $error'),
              ),
              data: (interventions) {
                if (interventions.isEmpty) {
                  return const AejEmptyState(
                    icon: Icons.build_outlined,
                    title: 'Aucune intervention',
                    description:
                        'Aucune intervention cette semaine.',
                  );
                }
                return RefreshIndicator(
                  onRefresh: notifier.refresh,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: 7,
                    itemBuilder: (context, index) {
                      final day = notifier.weekStart
                          .add(Duration(days: index));
                      final dayInterventions =
                          notifier.interventionsForDay(day);
                      final isToday = day.year == today.year &&
                          day.month == today.month &&
                          day.day == today.day;

                      return _DaySection(
                        dayName: _dayNames[index],
                        date: day,
                        isToday: isToday,
                        interventions: dayInterventions,
                        onInterventionTap: (intervention) =>
                            context.goNamed(
                          RouteNames.interventionDetail,
                          pathParameters: {'id': intervention.id},
                        ),
                        onEmptyTap: () => context.goNamed(
                          RouteNames.interventionCreate,
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.goNamed(RouteNames.interventionCreate),
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _DaySection extends StatelessWidget {
  const _DaySection({
    required this.dayName,
    required this.date,
    required this.isToday,
    required this.interventions,
    required this.onInterventionTap,
    required this.onEmptyTap,
  });

  final String dayName;
  final DateTime date;
  final bool isToday;
  final List<Intervention> interventions;
  final void Function(Intervention) onInterventionTap;
  final VoidCallback onEmptyTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isToday
                      ? theme.colorScheme.primary
                      : theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '$dayName ${date.day.toString().padLeft(2, '0')}',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: isToday
                        ? theme.colorScheme.onPrimary
                        : theme.colorScheme.onSurfaceVariant,
                    fontWeight: isToday ? FontWeight.bold : null,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (interventions.isNotEmpty)
                Text(
                  '${interventions.length} intervention${interventions.length > 1 ? 's' : ''}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
            ],
          ),
        ),
        if (interventions.isEmpty)
          GestureDetector(
            onTap: onEmptyTap,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 4),
              decoration: BoxDecoration(
                border: Border.all(
                  color: theme.colorScheme.outlineVariant,
                  style: BorderStyle.solid,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Tap pour ajouter',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        for (final intervention in interventions)
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: InterventionCard(
              intervention: intervention,
              onTap: () => onInterventionTap(intervention),
            ),
          ),
        const Divider(height: 16),
      ],
    );
  }
}
