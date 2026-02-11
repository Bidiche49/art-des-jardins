import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/enums/chantier_statut.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_search_input.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/chantiers_providers.dart';
import '../widgets/chantier_card.dart';
import '../widgets/chantier_filters.dart';

class ChantiersListPage extends ConsumerStatefulWidget {
  const ChantiersListPage({super.key});

  @override
  ConsumerState<ChantiersListPage> createState() => _ChantiersListPageState();
}

class _ChantiersListPageState extends ConsumerState<ChantiersListPage> {
  ChantierStatut? _selectedStatut;

  @override
  Widget build(BuildContext context) {
    final chantiersState = ref.watch(chantiersListNotifierProvider);

    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: AejSearchInput(
              hint: 'Rechercher un chantier...',
              onChanged: (query) {
                ref
                    .read(chantiersListNotifierProvider.notifier)
                    .search(query);
              },
            ),
          ),
          const SizedBox(height: 8),
          ChantierFilters(
            selectedStatut: _selectedStatut,
            onStatutChanged: (statut) {
              setState(() => _selectedStatut = statut);
              ref
                  .read(chantiersListNotifierProvider.notifier)
                  .filterByStatut(statut);
            },
          ),
          const SizedBox(height: 8),
          Expanded(
            child: chantiersState.when(
              loading: () => const Center(child: AejSpinner()),
              error: (error, _) => Center(
                child: Text('Erreur: $error'),
              ),
              data: (chantiers) {
                if (chantiers.isEmpty) {
                  return const AejEmptyState(
                    icon: Icons.construction_outlined,
                    title: 'Aucun chantier',
                    description: 'Ajoutez votre premier chantier.',
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => ref
                      .read(chantiersListNotifierProvider.notifier)
                      .refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: chantiers.length,
                    itemBuilder: (context, index) {
                      final chantier = chantiers[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ChantierCard(
                          chantier: chantier,
                          onTap: () => context.goNamed(
                            RouteNames.chantierDetail,
                            pathParameters: {'id': chantier.id},
                          ),
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
        onPressed: () => context.goNamed(RouteNames.chantierCreate),
        child: const Icon(Icons.add),
      ),
    );
  }
}
