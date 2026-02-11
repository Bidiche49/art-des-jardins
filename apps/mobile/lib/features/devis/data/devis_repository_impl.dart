import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/devis_dao.dart';
import '../../../domain/enums/devis_statut.dart';
import '../../../domain/models/devis.dart';
import '../../../domain/models/ligne_devis.dart';
import '../../../domain/models/prestation_template.dart';
import '../../../services/sync/sync_service.dart';
import '../domain/devis_repository.dart';

class DevisRepositoryImpl implements DevisRepository {
  DevisRepositoryImpl({
    required this.devisDao,
    required this.authDio,
    required this.connectivityService,
    required this.syncService,
  });

  final DevisDao devisDao;
  final Dio authDio;
  final ConnectivityService connectivityService;
  final SyncService syncService;

  @override
  Future<List<Devis>> getAll() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.devis);
        final items = _extractList(response.data);
        final devisList = items.map(_devisFromJson).toList();
        // Cache locally
        for (final d in devisList) {
          await _upsertLocal(d);
        }
        return devisList;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<Devis> getById(String id) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.devisById(id));
        final devis = _devisFromJson(response.data);
        await _upsertLocal(devis);
        return devis;
      } catch (_) {
        return _getByIdFromCache(id);
      }
    }
    return _getByIdFromCache(id);
  }

  @override
  Future<List<LigneDevis>> getLignes(String devisId) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.devisById(devisId));
        final responseData = response.data;
        final data = responseData is Map<String, dynamic> ? responseData : <String, dynamic>{};
        final lignesJson = data['lignes'] as List? ?? [];
        return lignesJson
            .map((j) => LigneDevis.fromJson(j as Map<String, dynamic>))
            .toList();
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  @override
  Future<Devis> create({
    required String chantierId,
    required List<LigneDevis> lignes,
    int validiteJours = 30,
    String? conditionsParticulieres,
    String? notes,
  }) async {
    final body = {
      'chantierId': chantierId,
      'validiteJours': validiteJours,
      // ignore: use_null_aware_elements
      if (conditionsParticulieres != null)
        'conditionsParticulieres': conditionsParticulieres,
      // ignore: use_null_aware_elements
      if (notes != null) 'notes': notes,
      'lignes': lignes
          .map((l) => {
                'description': l.description,
                'quantite': l.quantite,
                'unite': l.unite,
                'prixUnitaireHT': l.prixUnitaireHT,
                'tva': l.tva,
                'ordre': l.ordre,
              })
          .toList(),
    };

    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.post(ApiEndpoints.devis, data: body);
        final devis = _devisFromJson(response.data);
        await _upsertLocal(devis);
        return devis;
      } catch (e) {
        return _createOffline(chantierId, lignes, validiteJours,
            conditionsParticulieres, notes, body);
      }
    }
    return _createOffline(chantierId, lignes, validiteJours,
        conditionsParticulieres, notes, body);
  }

  Future<Devis> _createOffline(
    String chantierId,
    List<LigneDevis> lignes,
    int validiteJours,
    String? conditionsParticulieres,
    String? notes,
    Map<String, dynamic> body,
  ) async {
    final tempId = 'temp-${DateTime.now().millisecondsSinceEpoch}';
    final now = DateTime.now();

    // Calculate totals
    double totalHT = 0;
    double totalTVA = 0;
    for (final l in lignes) {
      final ht = _round2(l.quantite * l.prixUnitaireHT);
      final ttc = _round2(ht * (1 + l.tva / 100));
      totalHT += ht;
      totalTVA += ttc - ht;
    }
    final totalTTC = _round2(totalHT + totalTVA);
    totalHT = _round2(totalHT);
    totalTVA = _round2(totalTVA);

    final devis = Devis(
      id: tempId,
      chantierId: chantierId,
      numero: 'BROUILLON',
      dateEmission: now,
      dateValidite: now.add(Duration(days: validiteJours)),
      totalHT: totalHT,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      statut: DevisStatut.brouillon,
      conditionsParticulieres: conditionsParticulieres,
      notes: notes,
      createdAt: now,
      updatedAt: now,
    );

    await _upsertLocal(devis);
    await syncService.addToQueue(
      entity: 'devis',
      entityId: tempId,
      operation: 'create',
      data: body,
    );

    return devis;
  }

  @override
  Future<Devis> update({
    required String id,
    required List<LigneDevis> lignes,
    int? validiteJours,
    String? conditionsParticulieres,
    String? notes,
  }) async {
    final body = {
      // ignore: use_null_aware_elements
      if (validiteJours != null) 'validiteJours': validiteJours,
      // ignore: use_null_aware_elements
      if (conditionsParticulieres != null)
        'conditionsParticulieres': conditionsParticulieres,
      // ignore: use_null_aware_elements
      if (notes != null) 'notes': notes,
      'lignes': lignes
          .map((l) => {
                'description': l.description,
                'quantite': l.quantite,
                'unite': l.unite,
                'prixUnitaireHT': l.prixUnitaireHT,
                'tva': l.tva,
                'ordre': l.ordre,
              })
          .toList(),
    };

    if (await connectivityService.isOnline) {
      try {
        final response =
            await authDio.put(ApiEndpoints.devisById(id), data: body);
        final devis = _devisFromJson(response.data);
        await _upsertLocal(devis);
        return devis;
      } catch (e) {
        return _updateOffline(id, lignes, body);
      }
    }
    return _updateOffline(id, lignes, body);
  }

  Future<Devis> _updateOffline(
      String id, List<LigneDevis> lignes, Map<String, dynamic> body) async {
    final existing = await _getByIdFromCache(id);
    double totalHT = 0;
    double totalTVA = 0;
    for (final l in lignes) {
      final ht = _round2(l.quantite * l.prixUnitaireHT);
      final ttc = _round2(ht * (1 + l.tva / 100));
      totalHT += ht;
      totalTVA += ttc - ht;
    }
    final updated = existing.copyWith(
      totalHT: _round2(totalHT),
      totalTVA: _round2(totalTVA),
      totalTTC: _round2(totalHT + totalTVA),
      updatedAt: DateTime.now(),
    );
    await _upsertLocal(updated);
    await syncService.addToQueue(
      entity: 'devis',
      entityId: id,
      operation: 'update',
      data: body,
    );
    return updated;
  }

  @override
  Future<void> delete(String id) async {
    if (await connectivityService.isOnline) {
      try {
        await authDio.delete(ApiEndpoints.devisById(id));
        await devisDao.deleteById(id);
        return;
      } catch (_) {}
    }
    await devisDao.deleteById(id);
    await syncService.addToQueue(
      entity: 'devis',
      entityId: id,
      operation: 'delete',
      data: {},
    );
  }

  @override
  Future<List<Devis>> getByChantier(String chantierId) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio
            .get(ApiEndpoints.devis, queryParameters: {'chantierId': chantierId});
        final items = _extractList(response.data);
        return items.map(_devisFromJson).toList();
      } catch (_) {}
    }
    final rows = await devisDao.getByChantier(chantierId);
    return rows.map(_devisFromRow).toList();
  }

  @override
  Future<List<Devis>> getByStatut(DevisStatut statut) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio
            .get(ApiEndpoints.devis, queryParameters: {'statut': statut.value});
        final items = _extractList(response.data);
        return items.map(_devisFromJson).toList();
      } catch (_) {}
    }
    final rows = await devisDao.getByStatut(statut.value);
    return rows.map(_devisFromRow).toList();
  }

  @override
  Future<Devis> updateStatut(String id, DevisStatut statut) async {
    if (await connectivityService.isOnline) {
      final response = await authDio.patch(
        '${ApiEndpoints.devisById(id)}/statut',
        data: {'statut': statut.value},
      );
      final devis = _devisFromJson(response.data);
      await _upsertLocal(devis);
      return devis;
    }
    throw Exception('Changement de statut nécessite une connexion');
  }

  @override
  Future<String> getPdfUrl(String id) async {
    return '${authDio.options.baseUrl}${ApiEndpoints.devisPdf(id)}';
  }

  @override
  Future<List<PrestationTemplate>> getTemplates() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.templates);
        final items = _extractList(response.data);
        return items
            .map((j) =>
                PrestationTemplate.fromJson(j as Map<String, dynamic>))
            .toList();
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  // ============== Helpers ==============

  double _round2(double v) => double.parse(v.toStringAsFixed(2));

  List<dynamic> _extractList(dynamic data) {
    if (data is Map) return data['data'] as List? ?? [];
    if (data is List) return data;
    return [];
  }

  Devis _devisFromJson(dynamic json) {
    final map = json is Map<String, dynamic> ? json : <String, dynamic>{};
    return Devis.fromJson(map);
  }

  Devis _devisFromRow(DevisTableData row) {
    return Devis(
      id: row.id,
      chantierId: row.chantierId,
      numero: row.numero,
      dateEmission: row.dateEmission,
      dateValidite: row.dateValidite,
      totalHT: row.totalHT,
      totalTVA: row.totalTVA,
      totalTTC: row.totalTTC,
      statut: DevisStatut.values.firstWhere(
        (s) => s.value == row.statut,
        orElse: () => DevisStatut.brouillon,
      ),
      pdfUrl: row.pdfUrl,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    );
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
    final existing = await devisDao.getById(d.id);
    if (existing != null) {
      await devisDao.updateOne(companion);
    } else {
      await devisDao.insertOne(companion);
    }
  }

  Future<List<Devis>> _getAllFromCache() async {
    final rows = await devisDao.getAll();
    return rows.map(_devisFromRow).toList();
  }

  Future<Devis> _getByIdFromCache(String id) async {
    final row = await devisDao.getById(id);
    if (row == null) throw Exception('Devis $id non trouvé en cache');
    return _devisFromRow(row);
  }
}
