import 'package:dio/dio.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/chantiers_dao.dart';
import '../../../data/local/database/daos/clients_dao.dart';
import '../../../data/local/database/daos/devis_dao.dart';
import '../../../data/local/database/daos/factures_dao.dart';
import '../../../data/local/database/daos/interventions_dao.dart';
import '../../../domain/enums/facture_statut.dart';
import '../../../domain/enums/mode_paiement.dart';
import '../../../domain/models/dashboard_stats.dart';
import '../../../domain/models/facture.dart';
import '../../../domain/models/intervention.dart';
import '../domain/dashboard_repository.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  DashboardRepositoryImpl({
    required this.clientsDao,
    required this.chantiersDao,
    required this.devisDao,
    required this.facturesDao,
    required this.interventionsDao,
    required this.authDio,
    required this.connectivityService,
  });

  final ClientsDao clientsDao;
  final ChantiersDao chantiersDao;
  final DevisDao devisDao;
  final FacturesDao facturesDao;
  final InterventionsDao interventionsDao;
  final Dio authDio;
  final ConnectivityService connectivityService;

  @override
  Future<DashboardStats> getStats() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.stats);
        final data = response.data is Map ? response.data as Map<String, dynamic> : <String, dynamic>{};
        final statsData = data.containsKey('data') ? data['data'] as Map<String, dynamic> : data;
        return DashboardStats.fromJson(statsData);
      } catch (_) {
        return _getStatsFromCache();
      }
    }
    return _getStatsFromCache();
  }

  @override
  Future<List<Intervention>> getUpcomingInterventions({int days = 7}) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.interventions,
          queryParameters: {'upcoming': days},
        );
        return _parseInterventionsList(response.data);
      } catch (_) {
        return _getUpcomingFromCache(days);
      }
    }
    return _getUpcomingFromCache(days);
  }

  @override
  Future<List<Facture>> getFacturesImpayees() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.factures,
          queryParameters: {'retard': true},
        );
        return _parseFacturesList(response.data);
      } catch (_) {
        return _getImpayeesFromCache();
      }
    }
    return _getImpayeesFromCache();
  }

  @override
  Future<List<double>> getRevenueByMonth(int year) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.stats,
          queryParameters: {'year': year, 'type': 'revenue'},
        );
        final data = response.data;
        if (data is Map && data.containsKey('data')) {
          final revenue = data['data'] as List?;
          if (revenue != null) {
            return revenue.map((v) => (v as num).toDouble()).toList();
          }
        }
      } catch (_) {}
    }
    return _getRevenueFromCache(year);
  }

  @override
  Future<Map<String, double>> getRevenueByClient(int year) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.stats,
          queryParameters: {'year': year, 'type': 'by_client'},
        );
        final data = response.data;
        if (data is Map && data.containsKey('data')) {
          final map = data['data'] as Map<String, dynamic>?;
          if (map != null) {
            return map.map((k, v) => MapEntry(k, (v as num).toDouble()));
          }
        }
      } catch (_) {}
    }
    return _getRevenueByClientFromCache(year);
  }

  // ============== Cache Helpers ==============

  Future<DashboardStats> _getStatsFromCache() async {
    final clients = await clientsDao.getAll();
    final chantiers = await chantiersDao.getAll();
    final devisRows = await devisDao.getAll();
    final factures = await facturesDao.getAll();

    final chantiersEnCours = chantiers.where((c) => c.statut == 'en_cours').length;
    final devisEnAttente = devisRows.where((d) => d.statut == 'envoye').length;
    final impayees = factures.where((f) =>
        f.statut != 'payee' && f.statut != 'annulee' &&
        f.dateEcheance.isBefore(DateTime.now())).length;

    final now = DateTime.now();
    final firstOfMonth = DateTime(now.year, now.month, 1);
    final caMois = factures
        .where((f) =>
            f.statut == 'payee' &&
            f.datePaiement != null &&
            !f.datePaiement!.isBefore(firstOfMonth))
        .fold(0.0, (sum, f) => sum + f.totalTTC);

    final firstOfYear = DateTime(now.year, 1, 1);
    final caAnnee = factures
        .where((f) =>
            f.statut == 'payee' &&
            f.datePaiement != null &&
            !f.datePaiement!.isBefore(firstOfYear))
        .fold(0.0, (sum, f) => sum + f.totalTTC);

    return DashboardStats(
      clientsTotal: clients.length,
      chantiersEnCours: chantiersEnCours,
      devisEnAttente: devisEnAttente,
      facturesImpayees: impayees,
      caMois: caMois,
      caAnnee: caAnnee,
    );
  }

  Future<List<Intervention>> _getUpcomingFromCache(int days) async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final endDate = today.add(Duration(days: days));
    final allInterventions = await interventionsDao.getAll();
    return allInterventions
        .where((i) {
          final date = DateTime(i.date.year, i.date.month, i.date.day);
          return !date.isBefore(today) && date.isBefore(endDate);
        })
        .map(_interventionFromRow)
        .toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  Future<List<Facture>> _getImpayeesFromCache() async {
    final rows = await facturesDao.getEnRetard();
    return rows.map(_factureFromRow).toList()
      ..sort((a, b) => b.totalTTC.compareTo(a.totalTTC));
  }

  Future<List<double>> _getRevenueFromCache(int year) async {
    final allFactures = await facturesDao.getAll();
    final revenue = List.filled(12, 0.0);
    for (final f in allFactures) {
      if (f.statut == 'payee' &&
          f.datePaiement != null &&
          f.datePaiement!.year == year) {
        revenue[f.datePaiement!.month - 1] += f.totalTTC;
      }
    }
    return revenue;
  }

  Future<Map<String, double>> _getRevenueByClientFromCache(int year) async {
    final allFactures = await facturesDao.getAll();
    final allClients = await clientsDao.getAll();
    final clientNames = <String, String>{};
    for (final c in allClients) {
      clientNames[c.id] = c.nom;
    }

    final allDevis = await devisDao.getAll();
    final devisClientMap = <String, String>{};
    for (final d in allDevis) {
      // Map devis to its chantier's client
      final chantier = (await chantiersDao.getById(d.chantierId));
      if (chantier != null) {
        devisClientMap[d.id] = chantier.clientId;
      }
    }

    final revenueByClient = <String, double>{};
    for (final f in allFactures) {
      if (f.statut == 'payee' &&
          f.datePaiement != null &&
          f.datePaiement!.year == year) {
        final clientId = devisClientMap[f.devisId];
        if (clientId != null) {
          final name = clientNames[clientId] ?? 'Inconnu';
          revenueByClient[name] = (revenueByClient[name] ?? 0) + f.totalTTC;
        }
      }
    }
    return revenueByClient;
  }

  // ============== Parsers ==============

  List<dynamic> _extractList(dynamic data) {
    if (data is Map) return data['data'] as List? ?? [];
    if (data is List) return data;
    return [];
  }

  List<Intervention> _parseInterventionsList(dynamic responseData) {
    final items = _extractList(responseData);
    return items
        .map((json) => Intervention.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  List<Facture> _parseFacturesList(dynamic responseData) {
    final items = _extractList(responseData);
    return items
        .map((json) => Facture.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Intervention _interventionFromRow(InterventionsTableData row) {
    return Intervention(
      id: row.id,
      chantierId: row.chantierId,
      employeId: row.employeId,
      date: row.date,
      heureDebut: row.heureDebut,
      heureFin: row.heureFin,
      dureeMinutes: row.dureeMinutes,
      description: row.description,
      notes: row.notes,
      valide: row.valide,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    );
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
}
