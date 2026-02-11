import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/enums/facture_statut.dart';
import '../../../../domain/models/facture.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/factures_repository_impl.dart';
import '../../domain/factures_repository.dart';

// ============== Repository ==============

final facturesRepositoryProvider = Provider<FacturesRepository>((ref) {
  final db = ref.read(appDatabaseProvider);
  return FacturesRepositoryImpl(
    facturesDao: db.facturesDao,
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
  );
});

// ============== List Notifier ==============

final facturesListNotifierProvider = StateNotifierProvider<
    FacturesListNotifier, AsyncValue<List<Facture>>>((ref) {
  final repo = ref.read(facturesRepositoryProvider);
  return FacturesListNotifier(repo);
});

class FacturesListNotifier extends StateNotifier<AsyncValue<List<Facture>>> {
  FacturesListNotifier(this._repo) : super(const AsyncValue.loading()) {
    load();
  }

  final FacturesRepository _repo;
  FactureStatut? _filterStatut;
  String _searchQuery = '';
  bool _showRetardOnly = false;

  FactureStatut? get filterStatut => _filterStatut;
  String get searchQuery => _searchQuery;
  bool get showRetardOnly => _showRetardOnly;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      List<Facture> factures;
      if (_showRetardOnly) {
        factures = await _repo.getEnRetard();
      } else if (_filterStatut != null) {
        factures = await _repo.getByStatut(_filterStatut!);
      } else {
        factures = await _repo.getAll();
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        factures = factures
            .where((f) =>
                f.numero.toLowerCase().contains(q) ||
                (f.notes?.toLowerCase().contains(q) ?? false))
            .toList();
      }
      // Sort by date descending
      factures.sort((a, b) => b.dateEmission.compareTo(a.dateEmission));
      state = AsyncValue.data(factures);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void setFilter(FactureStatut? statut) {
    _filterStatut = statut;
    _showRetardOnly = false;
    load();
  }

  void toggleRetardOnly() {
    _showRetardOnly = !_showRetardOnly;
    if (_showRetardOnly) _filterStatut = null;
    load();
  }

  void search(String query) {
    _searchQuery = query;
    load();
  }
}

// ============== Retard Count ==============

final facturesEnRetardCountProvider = FutureProvider<int>((ref) async {
  final repo = ref.read(facturesRepositoryProvider);
  final enRetard = await repo.getEnRetard();
  return enRetard.length;
});
