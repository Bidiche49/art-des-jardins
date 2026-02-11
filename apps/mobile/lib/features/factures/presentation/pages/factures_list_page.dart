import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/enums/facture_statut.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/factures_providers.dart';
import '../widgets/facture_card.dart';

class FacturesListPage extends ConsumerWidget {
  const FacturesListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(facturesListNotifierProvider);
    final notifier = ref.read(facturesListNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Factures'),
        actions: [
          IconButton(
            icon: Icon(
              Icons.warning_amber_rounded,
              color: notifier.showRetardOnly
                  ? Theme.of(context).colorScheme.error
                  : null,
            ),
            tooltip: 'Factures en retard',
            onPressed: () => notifier.toggleRetardOnly(),
          ),
          PopupMenuButton<FactureStatut?>(
            icon: const Icon(Icons.filter_list),
            onSelected: (statut) => notifier.setFilter(statut),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: null,
                child: Text('Toutes'),
              ),
              ...FactureStatut.values.map((s) => PopupMenuItem(
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
                child: const Text('Reessayer'),
              ),
            ],
          ),
        ),
        data: (factures) {
          if (factures.isEmpty) {
            return AejEmptyState(
              icon: Icons.receipt_long_outlined,
              title: 'Aucune facture',
              description: notifier.showRetardOnly
                  ? 'Aucune facture en retard'
                  : 'Aucune facture trouvee',
            );
          }
          return RefreshIndicator(
            onRefresh: () => notifier.load(),
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: factures.length,
              itemBuilder: (context, index) {
                final facture = factures[index];
                return FactureCard(facture: facture);
              },
            ),
          );
        },
      ),
    );
  }
}
