import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/enums/client_type.dart';
import '../../../../domain/models/client.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/clients_repository_impl.dart';
import '../../domain/clients_repository.dart';

// ============== Repository ==============

final clientsDaoProvider = Provider((ref) {
  return ref.read(appDatabaseProvider).clientsDao;
});

final clientsRepositoryProvider = Provider<ClientsRepository>((ref) {
  return ClientsRepositoryImpl(
    clientsDao: ref.read(clientsDaoProvider),
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
    syncService: ref.read(syncServiceProvider),
  );
});

// ============== List Notifier ==============

final clientsListNotifierProvider =
    StateNotifierProvider<ClientsListNotifier, AsyncValue<List<Client>>>((ref) {
  return ClientsListNotifier(repository: ref.read(clientsRepositoryProvider));
});

class ClientsListNotifier extends StateNotifier<AsyncValue<List<Client>>> {
  ClientsListNotifier({required ClientsRepository repository})
      : _repository = repository,
        super(const AsyncValue.loading()) {
    loadClients();
  }

  final ClientsRepository _repository;
  List<Client> _allClients = [];
  ClientType? _typeFilter;
  String _searchQuery = '';

  Future<void> loadClients() async {
    state = const AsyncValue.loading();
    try {
      _allClients = await _repository.getAll();
      _applyFilters();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void filterByType(ClientType? type) {
    _typeFilter = type;
    _applyFilters();
  }

  void search(String query) {
    _searchQuery = query;
    _applyFilters();
  }

  void _applyFilters() {
    var filtered = List<Client>.from(_allClients);

    if (_typeFilter != null) {
      filtered = filtered.where((c) => c.type == _typeFilter).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      filtered = filtered
          .where((c) =>
              c.nom.toLowerCase().contains(q) ||
              c.email.toLowerCase().contains(q) ||
              (c.prenom?.toLowerCase().contains(q) ?? false) ||
              (c.raisonSociale?.toLowerCase().contains(q) ?? false))
          .toList();
    }

    state = AsyncValue.data(filtered);
  }

  Future<void> refresh() => loadClients();

  Future<void> addClient(Client client) async {
    await _repository.create(client);
    await loadClients();
  }

  Future<void> removeClient(String id) async {
    await _repository.delete(id);
    await loadClients();
  }
}

// ============== Detail Notifier ==============

final clientDetailNotifierProvider = StateNotifierProvider.family<
    ClientDetailNotifier, AsyncValue<Client>, String>((ref, clientId) {
  return ClientDetailNotifier(
    repository: ref.read(clientsRepositoryProvider),
    clientId: clientId,
  );
});

class ClientDetailNotifier extends StateNotifier<AsyncValue<Client>> {
  ClientDetailNotifier({
    required ClientsRepository repository,
    required String clientId,
  })  : _repository = repository,
        _clientId = clientId,
        super(const AsyncValue.loading()) {
    load();
  }

  final ClientsRepository _repository;
  final String _clientId;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final client = await _repository.getById(_clientId);
      state = AsyncValue.data(client);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateClient(Client client) async {
    final updated = await _repository.update(client);
    state = AsyncValue.data(updated);
  }

  Future<void> deleteClient() async {
    await _repository.delete(_clientId);
  }

  Future<void> refresh() => load();
}
