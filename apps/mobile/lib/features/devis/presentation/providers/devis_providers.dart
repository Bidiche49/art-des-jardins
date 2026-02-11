import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/enums/devis_statut.dart';
import '../../../../domain/models/devis.dart';
import '../../../../domain/models/ligne_devis.dart';
import '../../../../domain/models/prestation_template.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/devis_repository_impl.dart';
import '../../domain/devis_repository.dart';

// ============== Repository ==============

final devisRepositoryProvider = Provider<DevisRepository>((ref) {
  final db = ref.read(appDatabaseProvider);
  return DevisRepositoryImpl(
    devisDao: db.devisDao,
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
    syncService: ref.read(syncServiceProvider),
  );
});

// ============== List Notifier ==============

final devisListNotifierProvider =
    StateNotifierProvider<DevisListNotifier, AsyncValue<List<Devis>>>((ref) {
  final repo = ref.read(devisRepositoryProvider);
  return DevisListNotifier(repo);
});

class DevisListNotifier extends StateNotifier<AsyncValue<List<Devis>>> {
  DevisListNotifier(this._repo) : super(const AsyncValue.loading()) {
    load();
  }

  final DevisRepository _repo;
  DevisStatut? _filterStatut;
  String _searchQuery = '';

  DevisStatut? get filterStatut => _filterStatut;
  String get searchQuery => _searchQuery;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      List<Devis> devisList;
      if (_filterStatut != null) {
        devisList = await _repo.getByStatut(_filterStatut!);
      } else {
        devisList = await _repo.getAll();
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        devisList = devisList
            .where((d) =>
                d.numero.toLowerCase().contains(q) ||
                (d.notes?.toLowerCase().contains(q) ?? false))
            .toList();
      }
      // Sort by date descending
      devisList.sort((a, b) => b.dateEmission.compareTo(a.dateEmission));
      state = AsyncValue.data(devisList);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void setFilter(DevisStatut? statut) {
    _filterStatut = statut;
    load();
  }

  void search(String query) {
    _searchQuery = query;
    load();
  }

  Future<void> deleteDevis(String id) async {
    await _repo.delete(id);
    await load();
  }
}

// ============== Detail Notifier ==============

final devisDetailNotifierProvider = StateNotifierProvider.family<
    DevisDetailNotifier, AsyncValue<Devis>, String>((ref, id) {
  final repo = ref.read(devisRepositoryProvider);
  return DevisDetailNotifier(repo, id);
});

class DevisDetailNotifier extends StateNotifier<AsyncValue<Devis>> {
  DevisDetailNotifier(this._repo, this._id)
      : super(const AsyncValue.loading()) {
    load();
  }

  final DevisRepository _repo;
  final String _id;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final devis = await _repo.getById(_id);
      state = AsyncValue.data(devis);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateStatut(DevisStatut statut) async {
    try {
      final updated = await _repo.updateStatut(_id, statut);
      state = AsyncValue.data(updated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> deleteDevis() async {
    await _repo.delete(_id);
  }
}

// ============== Builder Notifier ==============

class DevisBuilderState {
  const DevisBuilderState({
    this.chantierId,
    this.lignes = const [],
    this.validiteJours = 30,
    this.conditionsParticulieres,
    this.notes,
    this.isSaving = false,
    this.error,
    this.editingDevisId,
  });

  final String? chantierId;
  final List<LigneDevis> lignes;
  final int validiteJours;
  final String? conditionsParticulieres;
  final String? notes;
  final bool isSaving;
  final String? error;
  final String? editingDevisId;

  double get totalHT {
    double sum = 0;
    for (final l in lignes) {
      sum += _round2(l.quantite * l.prixUnitaireHT);
    }
    return _round2(sum);
  }

  double get totalTVA {
    double sum = 0;
    for (final l in lignes) {
      final ht = _round2(l.quantite * l.prixUnitaireHT);
      final ttc = _round2(ht * (1 + l.tva / 100));
      sum += ttc - ht;
    }
    return _round2(sum);
  }

  double get totalTTC => _round2(totalHT + totalTVA);

  static double _round2(double v) => double.parse(v.toStringAsFixed(2));

  DevisBuilderState copyWith({
    String? chantierId,
    List<LigneDevis>? lignes,
    int? validiteJours,
    String? conditionsParticulieres,
    String? notes,
    bool? isSaving,
    String? error,
    String? editingDevisId,
  }) {
    return DevisBuilderState(
      chantierId: chantierId ?? this.chantierId,
      lignes: lignes ?? this.lignes,
      validiteJours: validiteJours ?? this.validiteJours,
      conditionsParticulieres:
          conditionsParticulieres ?? this.conditionsParticulieres,
      notes: notes ?? this.notes,
      isSaving: isSaving ?? this.isSaving,
      error: error,
      editingDevisId: editingDevisId ?? this.editingDevisId,
    );
  }
}

final devisBuilderNotifierProvider =
    StateNotifierProvider<DevisBuilderNotifier, DevisBuilderState>((ref) {
  final repo = ref.read(devisRepositoryProvider);
  return DevisBuilderNotifier(repo);
});

class DevisBuilderNotifier extends StateNotifier<DevisBuilderState> {
  DevisBuilderNotifier(this._repo) : super(const DevisBuilderState());

  final DevisRepository _repo;

  void setChantier(String chantierId) {
    state = state.copyWith(chantierId: chantierId);
  }

  void addLigne() {
    final newLigne = LigneDevis(
      id: 'ligne-${DateTime.now().millisecondsSinceEpoch}',
      devisId: state.editingDevisId ?? '',
      description: '',
      quantite: 1,
      unite: 'u',
      prixUnitaireHT: 0,
      tva: 20,
      montantHT: 0,
      montantTTC: 0,
      ordre: state.lignes.length,
    );
    state = state.copyWith(lignes: [...state.lignes, newLigne]);
  }

  void removeLigne(int index) {
    if (index < 0 || index >= state.lignes.length) return;
    final updated = [...state.lignes]..removeAt(index);
    // Reorder
    final reordered = updated.asMap().entries.map((e) {
      return e.value.copyWith(ordre: e.key);
    }).toList();
    state = state.copyWith(lignes: reordered);
  }

  void updateLigne(int index, LigneDevis ligne) {
    if (index < 0 || index >= state.lignes.length) return;
    final ht = DevisBuilderState._round2(ligne.quantite * ligne.prixUnitaireHT);
    final ttc = DevisBuilderState._round2(ht * (1 + ligne.tva / 100));
    final updated = ligne.copyWith(montantHT: ht, montantTTC: ttc);
    final lignes = [...state.lignes];
    lignes[index] = updated;
    state = state.copyWith(lignes: lignes);
  }

  void importTemplate(PrestationTemplate template) {
    final ligne = LigneDevis(
      id: 'ligne-${DateTime.now().millisecondsSinceEpoch}',
      devisId: state.editingDevisId ?? '',
      description: template.description ?? template.name,
      quantite: 1,
      unite: template.unit,
      prixUnitaireHT: template.unitPriceHT,
      tva: template.tvaRate,
      montantHT: template.unitPriceHT,
      montantTTC: DevisBuilderState._round2(
          template.unitPriceHT * (1 + template.tvaRate / 100)),
      ordre: state.lignes.length,
    );
    state = state.copyWith(lignes: [...state.lignes, ligne]);
  }

  void importTemplates(List<PrestationTemplate> templates) {
    for (final t in templates) {
      importTemplate(t);
    }
  }

  void setValiditeJours(int jours) {
    state = state.copyWith(validiteJours: jours);
  }

  void setConditions(String? conditions) {
    state = state.copyWith(conditionsParticulieres: conditions);
  }

  void setNotes(String? notes) {
    state = state.copyWith(notes: notes);
  }

  void loadExistingDevis(Devis devis, List<LigneDevis> lignes) {
    state = DevisBuilderState(
      chantierId: devis.chantierId,
      lignes: lignes,
      validiteJours:
          devis.dateValidite.difference(devis.dateEmission).inDays,
      conditionsParticulieres: devis.conditionsParticulieres,
      notes: devis.notes,
      editingDevisId: devis.id,
    );
  }

  void reset() {
    state = const DevisBuilderState();
  }

  Future<Devis?> saveBrouillon() async {
    if (state.chantierId == null) {
      state = state.copyWith(error: 'Sélectionnez un chantier');
      return null;
    }
    state = state.copyWith(isSaving: true, error: null);
    try {
      Devis devis;
      if (state.editingDevisId != null) {
        devis = await _repo.update(
          id: state.editingDevisId!,
          lignes: state.lignes,
          validiteJours: state.validiteJours,
          conditionsParticulieres: state.conditionsParticulieres,
          notes: state.notes,
        );
      } else {
        devis = await _repo.create(
          chantierId: state.chantierId!,
          lignes: state.lignes,
          validiteJours: state.validiteJours,
          conditionsParticulieres: state.conditionsParticulieres,
          notes: state.notes,
        );
      }
      state = state.copyWith(
          isSaving: false, editingDevisId: devis.id);
      return devis;
    } catch (e) {
      state = state.copyWith(isSaving: false, error: e.toString());
      return null;
    }
  }

  Future<Devis?> envoyerDevis() async {
    if (state.lignes.isEmpty) {
      state = state.copyWith(error: 'Ajoutez au moins une ligne');
      return null;
    }
    // Save first
    final saved = await saveBrouillon();
    if (saved == null) return null;

    state = state.copyWith(isSaving: true, error: null);
    try {
      final devis = await _repo.updateStatut(saved.id, DevisStatut.envoye);
      state = state.copyWith(isSaving: false);
      return devis;
    } catch (e) {
      state = state.copyWith(isSaving: false, error: e.toString());
      return null;
    }
  }
}

// ============== Templates Provider ==============

final templatesProvider =
    FutureProvider<List<PrestationTemplate>>((ref) async {
  final repo = ref.read(devisRepositoryProvider);
  return repo.getTemplates();
});

// ============== Lignes Provider ==============

final devisLignesProvider =
    FutureProvider.family<List<LigneDevis>, String>((ref, devisId) async {
  final repo = ref.read(devisRepositoryProvider);
  return repo.getLignes(devisId);
});
