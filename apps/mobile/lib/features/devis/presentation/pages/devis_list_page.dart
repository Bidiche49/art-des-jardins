import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/enums/devis_statut.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/devis_providers.dart';
import '../widgets/devis_card.dart';

class DevisListPage extends ConsumerWidget {
  const DevisListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(devisListNotifierProvider);
    final notifier = ref.read(devisListNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Devis'),
        actions: [
          PopupMenuButton<DevisStatut?>(
            icon: const Icon(Icons.filter_list),
            onSelected: (statut) => notifier.setFilter(statut),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: null,
                child: Text('Tous'),
              ),
              ...DevisStatut.values.map((s) => PopupMenuItem(
                    value: s,
                    child: Text(s.label),
                  )),
            ],
          ),
        ],
      ),
      body: state.when(
        loading: () => const Center(child: AejSpinner()),
        error: (e, _) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Erreur: $e'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => notifier.load(),
                child: const Text('Réessayer'),
              ),
            ],
          ),
        ),
        data: (devisList) {
          if (devisList.isEmpty) {
            return AejEmptyState(
              icon: Icons.description_outlined,
              title: 'Aucun devis',
              description: 'Créez votre premier devis',
              actionLabel: 'Nouveau devis',
              onAction: () => context.pushNamed(RouteNames.devisCreate),
            );
          }
          return RefreshIndicator(
            onRefresh: () => notifier.load(),
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: devisList.length,
              itemBuilder: (context, index) {
                final devis = devisList[index];
                return DevisCard(
                  devis: devis,
                  onTap: () => context.pushNamed(
                    RouteNames.devisDetail,
                    pathParameters: {'id': devis.id},
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.pushNamed(RouteNames.devisCreate),
        child: const Icon(Icons.add),
      ),
    );
  }
}
