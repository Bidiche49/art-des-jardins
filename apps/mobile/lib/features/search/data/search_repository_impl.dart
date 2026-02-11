import 'package:dio/dio.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/daos/chantiers_dao.dart';
import '../../../data/local/database/daos/clients_dao.dart';
import '../../../data/local/database/daos/devis_dao.dart';
import '../../../data/local/database/daos/factures_dao.dart';
import '../../../domain/models/search_result.dart';
import '../domain/search_repository.dart';

class SearchRepositoryImpl implements SearchRepository {
  SearchRepositoryImpl({
    required this.clientsDao,
    required this.chantiersDao,
    required this.devisDao,
    required this.facturesDao,
    required this.authDio,
    required this.connectivityService,
  });

  final ClientsDao clientsDao;
  final ChantiersDao chantiersDao;
  final DevisDao devisDao;
  final FacturesDao facturesDao;
  final Dio authDio;
  final ConnectivityService connectivityService;

  @override
  Future<List<SearchResult>> search(String query) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(
          ApiEndpoints.search,
          queryParameters: {'q': query},
        );
        return _parseResults(response.data);
      } catch (_) {
        return _searchFromCache(query);
      }
    }
    return _searchFromCache(query);
  }

  @override
  Future<List<SearchResult>> searchByEntity(
      String query, String entity) async {
    final all = await search(query);
    return all.where((r) => r.entity == entity).toList();
  }

  Future<List<SearchResult>> _searchFromCache(String query) async {
    final q = query.toLowerCase();
    final results = <SearchResult>[];

    // Search clients
    final clients = await clientsDao.getAll();
    for (final c in clients) {
      if (c.nom.toLowerCase().contains(q) ||
          c.email.toLowerCase().contains(q) ||
          (c.prenom?.toLowerCase().contains(q) ?? false)) {
        results.add(SearchResult(
          entity: 'client',
          entityId: c.id,
          title: c.prenom != null ? '${c.prenom} ${c.nom}' : c.nom,
          subtitle: c.email,
          matchField: _matchedField(q, {
            'nom': c.nom,
            'email': c.email,
            'prenom': c.prenom,
          }),
        ));
      }
    }

    // Search chantiers
    final chantiers = await chantiersDao.getAll();
    for (final ch in chantiers) {
      if (ch.adresse.toLowerCase().contains(q) ||
          ch.ville.toLowerCase().contains(q) ||
          ch.description.toLowerCase().contains(q)) {
        results.add(SearchResult(
          entity: 'chantier',
          entityId: ch.id,
          title: ch.adresse,
          subtitle: ch.ville,
          matchField: _matchedField(q, {
            'adresse': ch.adresse,
            'ville': ch.ville,
            'description': ch.description,
          }),
        ));
      }
    }

    // Search devis
    final devisList = await devisDao.getAll();
    for (final d in devisList) {
      if (d.numero.toLowerCase().contains(q) ||
          (d.notes?.toLowerCase().contains(q) ?? false)) {
        results.add(SearchResult(
          entity: 'devis',
          entityId: d.id,
          title: 'Devis ${d.numero}',
          subtitle: '${d.totalTTC.toStringAsFixed(2)} \u20ac TTC',
          matchField: _matchedField(q, {
            'numero': d.numero,
            'notes': d.notes,
          }),
        ));
      }
    }

    // Search factures
    final factures = await facturesDao.getAll();
    for (final f in factures) {
      if (f.numero.toLowerCase().contains(q) ||
          (f.notes?.toLowerCase().contains(q) ?? false)) {
        results.add(SearchResult(
          entity: 'facture',
          entityId: f.id,
          title: 'Facture ${f.numero}',
          subtitle: '${f.totalTTC.toStringAsFixed(2)} \u20ac TTC',
          matchField: _matchedField(q, {
            'numero': f.numero,
            'notes': f.notes,
          }),
        ));
      }
    }

    return results;
  }

  String? _matchedField(String query, Map<String, String?> fields) {
    for (final entry in fields.entries) {
      if (entry.value?.toLowerCase().contains(query) == true) {
        return entry.key;
      }
    }
    return null;
  }

  List<SearchResult> _parseResults(dynamic responseData) {
    List<dynamic> items;
    if (responseData is Map) {
      items = responseData['data'] as List? ?? [];
    } else if (responseData is List) {
      items = responseData;
    } else {
      return [];
    }
    return items
        .map((json) => SearchResult.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
