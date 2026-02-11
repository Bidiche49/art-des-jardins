import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/enums/user_role.dart';
import '../../../../domain/models/absence.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../../../auth/domain/auth_state.dart';
import '../../../auth/presentation/auth_notifier.dart';
import '../providers/calendar_providers.dart';
import '../widgets/absence_card.dart';

class AbsencesPage extends ConsumerWidget {
  const AbsencesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final isPatron = authState is AuthAuthenticated &&
        authState.user.role == UserRole.patron;
    final absencesState = ref.watch(absencesNotifierProvider);

    return DefaultTabController(
      length: isPatron ? 3 : 1,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Absences'),
          bottom: TabBar(
            tabs: [
              const Tab(text: 'Mes absences'),
              if (isPatron) const Tab(text: 'En attente'),
              if (isPatron) const Tab(text: 'Toutes'),
            ],
          ),
        ),
        body: absencesState.isLoading
            ? const Center(child: AejSpinner())
            : TabBarView(
                children: [
                  _AbsencesList(
                    absences: absencesState.myAbsences,
                    emptyMessage: 'Aucune absence',
                    isPatron: isPatron,
                  ),
                  if (isPatron)
                    _AbsencesList(
                      absences: absencesState.pendingAbsences,
                      emptyMessage: 'Aucune absence en attente',
                      isPatron: isPatron,
                      showActions: true,
                    ),
                  if (isPatron)
                    _AbsencesList(
                      absences: absencesState.allAbsences,
                      emptyMessage: 'Aucune absence',
                      isPatron: isPatron,
                    ),
                ],
              ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => context.pushNamed(RouteNames.absenceCreate),
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}

class _AbsencesList extends ConsumerWidget {
  const _AbsencesList({
    required this.absences,
    required this.emptyMessage,
    required this.isPatron,
    this.showActions = false,
  });

  final List<Absence> absences;
  final String emptyMessage;
  final bool isPatron;
  final bool showActions;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (absences.isEmpty) {
      return AejEmptyState(
        icon: Icons.event_busy,
        title: emptyMessage,
        description: 'Les absences apparaitront ici.',
      );
    }

    return RefreshIndicator(
      onRefresh: () =>
          ref.read(absencesNotifierProvider.notifier).refresh(),
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: absences.length,
        itemBuilder: (context, index) {
          final absence = absences[index];
          return AbsenceCard(
            absence: absence,
            showActions: showActions && isPatron,
            onValidate: () {
              ref
                  .read(absencesNotifierProvider.notifier)
                  .validateAbsence(absence.id);
            },
            onRefuse: () {
              ref
                  .read(absencesNotifierProvider.notifier)
                  .refuseAbsence(absence.id);
            },
          );
        },
      ),
    );
  }
}
