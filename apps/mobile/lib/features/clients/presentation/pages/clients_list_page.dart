import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/enums/client_type.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_search_input.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/clients_providers.dart';
import '../widgets/client_card.dart';
import '../widgets/client_filters.dart';

class ClientsListPage extends ConsumerStatefulWidget {
  const ClientsListPage({super.key});

  @override
  ConsumerState<ClientsListPage> createState() => _ClientsListPageState();
}

class _ClientsListPageState extends ConsumerState<ClientsListPage> {
  ClientType? _selectedType;

  @override
  Widget build(BuildContext context) {
    final clientsState = ref.watch(clientsListNotifierProvider);

    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: AejSearchInput(
              hint: 'Rechercher un client...',
              onChanged: (query) {
                ref
                    .read(clientsListNotifierProvider.notifier)
                    .search(query);
              },
            ),
          ),
          const SizedBox(height: 8),
          ClientFilters(
            selectedType: _selectedType,
            onTypeChanged: (type) {
              setState(() => _selectedType = type);
              ref
                  .read(clientsListNotifierProvider.notifier)
                  .filterByType(type);
            },
          ),
          const SizedBox(height: 8),
          Expanded(
            child: clientsState.when(
              loading: () => const Center(child: AejSpinner()),
              error: (error, _) => Center(
                child: Text('Erreur: $error'),
              ),
              data: (clients) {
                if (clients.isEmpty) {
                  return const AejEmptyState(
                    icon: Icons.people_outline,
                    title: 'Aucun client',
                    description: 'Ajoutez votre premier client.',
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => ref
                      .read(clientsListNotifierProvider.notifier)
                      .refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: clients.length,
                    itemBuilder: (context, index) {
                      final client = clients[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ClientCard(
                          client: client,
                          onTap: () => context.goNamed(
                            RouteNames.clientDetail,
                            pathParameters: {'id': client.id},
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
        onPressed: () => context.goNamed(RouteNames.clientCreate),
        child: const Icon(Icons.add),
      ),
    );
  }
}
