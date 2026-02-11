import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/enums/chantier_statut.dart';
import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/rentabilite_data.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/chantiers_repository_impl.dart';
import '../../domain/chantiers_repository.dart';
import '../../domain/rentabilite_calculator.dart';

// ============== Repository ==============

final chantiersDaoProvider = Provider((ref) {
  return ref.read(appDatabaseProvider).chantiersDao;
});

final chantiersRepositoryProvider = Provider<ChantiersRepository>((ref) {
  return ChantiersRepositoryImpl(
    chantiersDao: ref.read(chantiersDaoProvider),
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
    syncService: ref.read(syncServiceProvider),
  );
});

// ============== List Notifier ==============

final chantiersListNotifierProvider =
    StateNotifierProvider<ChantiersListNotifier, AsyncValue<List<Chantier>>>(
        (ref) {
  return ChantiersListNotifier(
      repository: ref.read(chantiersRepositoryProvider));
});

class ChantiersListNotifier extends StateNotifier<AsyncValue<List<Chantier>>> {
  ChantiersListNotifier({required ChantiersRepository repository})
      : _repository = repository,
        super(const AsyncValue.loading()) {
    loadChantiers();
  }

  final ChantiersRepository _repository;
  List<Chantier> _allChantiers = [];
  ChantierStatut? _statutFilter;
  String _searchQuery = '';

  Future<void> loadChantiers() async {
    state = const AsyncValue.loading();
    try {
      _allChantiers = await _repository.getAll();
      _applyFilters();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void filterByStatut(ChantierStatut? statut) {
    _statutFilter = statut;
    _applyFilters();
  }

  void search(String query) {
    _searchQuery = query;
    _applyFilters();
  }

  void _applyFilters() {
    var filtered = List<Chantier>.from(_allChantiers);

    if (_statutFilter != null) {
      filtered = filtered.where((c) => c.statut == _statutFilter).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      filtered = filtered
          .where((c) =>
              c.description.toLowerCase().contains(q) ||
              c.adresse.toLowerCase().contains(q) ||
              c.ville.toLowerCase().contains(q))
          .toList();
    }

    state = AsyncValue.data(filtered);
  }

  Future<void> refresh() => loadChantiers();

  Future<void> addChantier(Chantier chantier) async {
    await _repository.create(chantier);
    await loadChantiers();
  }

  Future<void> removeChantier(String id) async {
    await _repository.delete(id);
    await loadChantiers();
  }
}

// ============== Detail Notifier ==============

final chantierDetailNotifierProvider = StateNotifierProvider.family<
    ChantierDetailNotifier, AsyncValue<Chantier>, String>((ref, chantierId) {
  return ChantierDetailNotifier(
    repository: ref.read(chantiersRepositoryProvider),
    chantierId: chantierId,
  );
});

class ChantierDetailNotifier extends StateNotifier<AsyncValue<Chantier>> {
  ChantierDetailNotifier({
    required ChantiersRepository repository,
    required String chantierId,
  })  : _repository = repository,
        _chantierId = chantierId,
        super(const AsyncValue.loading()) {
    load();
  }

  final ChantiersRepository _repository;
  final String _chantierId;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final chantier = await _repository.getById(_chantierId);
      state = AsyncValue.data(chantier);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateChantier(Chantier chantier) async {
    final updated = await _repository.update(chantier);
    state = AsyncValue.data(updated);
  }

  Future<void> deleteChantier() async {
    await _repository.delete(_chantierId);
  }

  Future<void> refresh() => load();
}

// ============== Rentabilite ==============

final rentabiliteProvider =
    FutureProvider.family<RentabiliteData, String>((ref, chantierId) async {
  final db = ref.read(appDatabaseProvider);
  final devisData = await db.devisDao.getByChantier(chantierId);
  final interventionsData =
      await db.interventionsDao.getByChantier(chantierId);

  final devisAcceptesTTC = devisData
      .where((d) => d.statut == 'accepte' || d.statut == 'signe')
      .map((d) => d.totalTTC)
      .toList();

  final totalMinutes = interventionsData.fold<int>(
      0, (sum, i) => sum + (i.dureeMinutes ?? 0));

  return RentabiliteCalculator.computeAll(
    chantierId: chantierId,
    devisAcceptesTTC: devisAcceptesTTC,
    totalMinutes: totalMinutes,
  );
});
