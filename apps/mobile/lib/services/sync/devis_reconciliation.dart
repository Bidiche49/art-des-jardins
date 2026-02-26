import 'package:drift/drift.dart';

import '../../data/local/database/app_database.dart';
import '../../data/local/database/daos/devis_dao.dart';
import '../../data/local/database/daos/lignes_devis_dao.dart';
import '../../domain/models/devis.dart';
import '../../domain/models/ligne_devis.dart';
import 'sync_event.dart';

/// Handles reconciliation of devis after successful sync operations.
///
/// When a devis created offline (with a temp ID) is synced to the API,
/// this class replaces the local temp record with the real record from
/// the API response.
class DevisReconciliation {
  DevisReconciliation({
    required DevisDao devisDao,
    required LignesDevisDao lignesDevisDao,
  })  : _devisDao = devisDao,
        _lignesDevisDao = lignesDevisDao;

  final DevisDao _devisDao;
  final LignesDevisDao _lignesDevisDao;

  /// Reconciles a devis after a successful sync event.
  Future<void> reconcile(SyncEvent event) async {
    switch (event.operation) {
      case 'create':
        await _reconcileCreate(event);
        break;
      case 'update':
        await _reconcileUpdate(event);
        break;
    }
  }

  /// Reconciles a create operation: replaces the temp-ID record with
  /// the real record returned by the API.
  Future<void> _reconcileCreate(SyncEvent event) async {
    final responseData = event.responseData;
    if (responseData == null) return;

    final tempId = event.tempEntityId;
    if (tempId == null) return;

    final realDevis = _devisFromJson(responseData);

    // Check if API response contains lignes
    final lignesJson = responseData['lignes'] as List?;
    final hasApiLignes = lignesJson != null && lignesJson.isNotEmpty;

    // Fetch existing temp lignes before deleting (for migration if API has none)
    List<LignesDevisTableData> tempLignes = [];
    if (!hasApiLignes) {
      tempLignes = await _lignesDevisDao.getByDevisId(tempId);
    }

    // Delete the old record with temp ID (and its lignes)
    await _lignesDevisDao.deleteByDevisId(tempId);
    await _devisDao.deleteById(tempId);

    // Insert the real record
    await _upsertLocal(realDevis);

    // Persist lignes from API response with the real devisId
    if (hasApiLignes) {
      final lignes = lignesJson
          .map((j) => LigneDevis.fromJson(j as Map<String, dynamic>))
          .toList();
      await _upsertLignesLocal(realDevis.id, lignes);
    } else if (tempLignes.isNotEmpty) {
      // Migrate existing lignes from temp ID to real ID
      final companions = tempLignes.map((row) {
        return LignesDevisTableCompanion(
          id: Value(row.id),
          devisId: Value(realDevis.id),
          description: Value(row.description),
          quantite: Value(row.quantite),
          unite: Value(row.unite),
          prixUnitaireHT: Value(row.prixUnitaireHT),
          tva: Value(row.tva),
          montantHT: Value(row.montantHT),
          montantTTC: Value(row.montantTTC),
          ordre: Value(row.ordre),
          syncedAt: Value(DateTime.now()),
        );
      }).toList();
      await _lignesDevisDao.insertAll(companions);
    }
  }

  /// Reconciles an update operation: updates the local record with
  /// the response from the API.
  Future<void> _reconcileUpdate(SyncEvent event) async {
    final responseData = event.responseData;
    if (responseData == null) return;

    final realDevis = _devisFromJson(responseData);
    await _upsertLocal(realDevis);

    // Update lignes from API response
    final lignesJson = responseData['lignes'] as List?;
    if (lignesJson != null && lignesJson.isNotEmpty) {
      final lignes = lignesJson
          .map((j) => LigneDevis.fromJson(j as Map<String, dynamic>))
          .toList();
      await _upsertLignesLocal(realDevis.id, lignes);
    }
  }

  Devis _devisFromJson(Map<String, dynamic> json) {
    return Devis.fromJson(json);
  }

  Future<void> _upsertLocal(Devis d) async {
    final companion = DevisTableCompanion(
      id: Value(d.id),
      chantierId: Value(d.chantierId),
      numero: Value(d.numero),
      dateEmission: Value(d.dateEmission),
      dateValidite: Value(d.dateValidite),
      totalHT: Value(d.totalHT),
      totalTVA: Value(d.totalTVA),
      totalTTC: Value(d.totalTTC),
      statut: Value(d.statut.value),
      pdfUrl: Value(d.pdfUrl),
      notes: Value(d.notes),
      createdAt: Value(d.createdAt),
      updatedAt: Value(d.updatedAt),
      syncedAt: Value(DateTime.now()),
    );
    final existing = await _devisDao.getById(d.id);
    if (existing != null) {
      await _devisDao.updateOne(companion);
    } else {
      await _devisDao.insertOne(companion);
    }
  }

  Future<void> _upsertLignesLocal(
      String devisId, List<LigneDevis> lignes) async {
    await _lignesDevisDao.deleteByDevisId(devisId);
    if (lignes.isEmpty) return;
    final companions = lignes.map((l) {
      return LignesDevisTableCompanion(
        id: Value(l.id),
        devisId: Value(l.devisId.isEmpty ? devisId : l.devisId),
        description: Value(l.description),
        quantite: Value(l.quantite),
        unite: Value(l.unite),
        prixUnitaireHT: Value(l.prixUnitaireHT),
        tva: Value(l.tva),
        montantHT: Value(l.montantHT),
        montantTTC: Value(l.montantTTC),
        ordre: Value(l.ordre),
        syncedAt: Value(DateTime.now()),
      );
    }).toList();
    await _lignesDevisDao.insertAll(companions);
  }
}
