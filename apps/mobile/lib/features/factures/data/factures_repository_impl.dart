import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/daos/factures_dao.dart';
import '../../../data/local/database/app_database.dart';
import '../../../domain/enums/facture_statut.dart';
import '../../../domain/enums/mode_paiement.dart';
import '../../../domain/models/facture.dart';
import '../domain/factures_repository.dart';

class FacturesRepositoryImpl implements FacturesRepository {
  FacturesRepositoryImpl({
    required this.facturesDao,
    required this.authDio,
    required this.connectivityService,
  });

  final FacturesDao facturesDao;
  final Dio authDio;
  final ConnectivityService connectivityService;

  @override
  Future<List<Facture>> getAll() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.factures);
        final items = _extractList(response.data);
        final factures = items.map(_factureFromJson).toList();
        for (final f in factures) {
          await _upsertLocal(f);
        }
        return factures;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<Facture> getById(String id) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.facture(id));
        final facture = _factureFromJson(response.data);
        await _upsertLocal(facture);
        return facture;
      } catch (_) {
        return _getByIdFromCache(id);
      }
    }
    return _getByIdFromCache(id);
  }

  @override
  Future<List<Facture>> getByStatut(FactureStatut statut) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.factures,
          queryParameters: {'statut': statut.value},
        );
        final items = _extractList(response.data);
        return items.map(_factureFromJson).toList();
      } catch (_) {}
    }
    final rows = await facturesDao.getAll();
    return rows
        .where((r) => r.statut == statut.value)
        .map(_factureFromRow)
        .toList();
  }

  @override
  Future<List<Facture>> getEnRetard() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.factures,
          queryParameters: {'retard': true},
        );
        final items = _extractList(response.data);
        return items.map(_factureFromJson).toList();
      } catch (_) {}
    }
    final rows = await facturesDao.getEnRetard();
    return rows.map(_factureFromRow).toList();
  }

  @override
  Future<String> getPdfUrl(String id) async {
    return '${authDio.options.baseUrl}${ApiEndpoints.facturePdf(id)}';
  }

  // ============== Helpers ==============

  List<dynamic> _extractList(dynamic data) {
    if (data is Map) return data['data'] as List? ?? [];
    if (data is List) return data;
    return [];
  }

  Facture _factureFromJson(dynamic json) {
    final map = json is Map<String, dynamic> ? json : <String, dynamic>{};
    return Facture.fromJson(map);
  }

  Facture _factureFromRow(FacturesTableData row) {
    return Facture(
      id: row.id,
      devisId: row.devisId,
      numero: row.numero,
      dateEmission: row.dateEmission,
      dateEcheance: row.dateEcheance,
      datePaiement: row.datePaiement,
      totalHT: row.totalHT,
      totalTVA: row.totalTVA,
      totalTTC: row.totalTTC,
      statut: FactureStatut.values.firstWhere(
        (s) => s.value == row.statut,
        orElse: () => FactureStatut.brouillon,
      ),
      modePaiement: row.modePaiement != null
          ? ModePaiement.values.firstWhere(
              (m) => m.value == row.modePaiement,
              orElse: () => ModePaiement.virement,
            )
          : null,
      pdfUrl: row.pdfUrl,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    );
  }

  Future<void> _upsertLocal(Facture f) async {
    final companion = FacturesTableCompanion(
      id: Value(f.id),
      devisId: Value(f.devisId),
      numero: Value(f.numero),
      dateEmission: Value(f.dateEmission),
      dateEcheance: Value(f.dateEcheance),
      datePaiement: Value(f.datePaiement),
      totalHT: Value(f.totalHT),
      totalTVA: Value(f.totalTVA),
      totalTTC: Value(f.totalTTC),
      statut: Value(f.statut.value),
      modePaiement: Value(f.modePaiement?.value),
      pdfUrl: Value(f.pdfUrl),
      notes: Value(f.notes),
      createdAt: Value(f.createdAt),
      updatedAt: Value(f.updatedAt),
      syncedAt: Value(DateTime.now()),
    );
    final existing = await facturesDao.getById(f.id);
    if (existing != null) {
      await facturesDao.updateOne(companion);
    } else {
      await facturesDao.insertOne(companion);
    }
  }

  Future<List<Facture>> _getAllFromCache() async {
    final rows = await facturesDao.getAll();
    return rows.map(_factureFromRow).toList();
  }

  Future<Facture> _getByIdFromCache(String id) async {
    final row = await facturesDao.getById(id);
    if (row == null) throw Exception('Facture $id non trouvee en cache');
    return _factureFromRow(row);
  }
}
