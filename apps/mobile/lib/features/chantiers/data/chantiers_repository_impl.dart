import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/chantiers_dao.dart';
import '../../../domain/enums/chantier_statut.dart';
import '../../../domain/enums/type_prestation.dart';
import '../../../domain/models/chantier.dart';
import '../../../services/sync/sync_service.dart';
import '../domain/chantiers_repository.dart';

class ChantiersRepositoryImpl implements ChantiersRepository {
  ChantiersRepositoryImpl({
    required ChantiersDao chantiersDao,
    required Dio authDio,
    required ConnectivityService connectivityService,
    required SyncService syncService,
  })  : _chantiersDao = chantiersDao,
        _authDio = authDio,
        _connectivity = connectivityService,
        _syncService = syncService;

  final ChantiersDao _chantiersDao;
  final Dio _authDio;
  final ConnectivityService _connectivity;
  final SyncService _syncService;

  @override
  Future<List<Chantier>> getAll() async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.chantiers);
        final chantiers = _parseChantiersList(response.data);
        await _cacheAll(chantiers);
        return chantiers;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<Chantier> getById(String id) async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.chantier(id));
        final chantier = _parseChantier(response.data);
        await _cacheChantier(chantier);
        return chantier;
      } catch (_) {
        return _getByIdFromCache(id);
      }
    }
    return _getByIdFromCache(id);
  }

  @override
  Future<Chantier> create(Chantier chantier) async {
    final now = DateTime.now();
    final newChantier = chantier.copyWith(
      id: chantier.id.isEmpty
          ? 'temp-${now.millisecondsSinceEpoch}'
          : chantier.id,
      createdAt: now,
      updatedAt: now,
    );

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.post(
          ApiEndpoints.chantiers,
          data: newChantier.toJson()..remove('id'),
        );
        final created = _parseChantier(response.data);
        await _cacheChantier(created);
        return created;
      } catch (_) {
        return _createOffline(newChantier);
      }
    }
    return _createOffline(newChantier);
  }

  @override
  Future<Chantier> update(Chantier chantier) async {
    final updated = chantier.copyWith(updatedAt: DateTime.now());

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.put(
          ApiEndpoints.chantier(chantier.id),
          data: updated.toJson(),
        );
        final result = _parseChantier(response.data);
        await _cacheChantier(result);
        return result;
      } catch (_) {
        return _updateOffline(updated);
      }
    }
    return _updateOffline(updated);
  }

  @override
  Future<void> delete(String id) async {
    if (await _connectivity.isOnline) {
      try {
        await _authDio.delete(ApiEndpoints.chantier(id));
        await _chantiersDao.deleteById(id);
        return;
      } catch (_) {
        await _deleteOffline(id);
        return;
      }
    }
    await _deleteOffline(id);
  }

  @override
  Future<List<Chantier>> searchByAddress(String query) async {
    final all = await getAll();
    final q = query.toLowerCase();
    return all
        .where((c) =>
            c.adresse.toLowerCase().contains(q) ||
            c.ville.toLowerCase().contains(q) ||
            c.description.toLowerCase().contains(q))
        .toList();
  }

  @override
  Future<List<Chantier>> getByStatut(ChantierStatut statut) async {
    final cached = await _chantiersDao.getByStatut(statut.value);
    return cached.map(_fromData).toList();
  }

  @override
  Future<List<Chantier>> getByClient(String clientId) async {
    final cached = await _chantiersDao.getByClient(clientId);
    return cached.map(_fromData).toList();
  }

  // ============== Private helpers ==============

  Future<List<Chantier>> _getAllFromCache() async {
    final cached = await _chantiersDao.getAll();
    return cached.map(_fromData).toList();
  }

  Future<Chantier> _getByIdFromCache(String id) async {
    final data = await _chantiersDao.getById(id);
    if (data == null) throw Exception('Chantier $id not found in cache');
    return _fromData(data);
  }

  Future<void> _cacheAll(List<Chantier> chantiers) async {
    for (final chantier in chantiers) {
      await _cacheChantier(chantier);
    }
  }

  Future<void> _cacheChantier(Chantier chantier) async {
    final companion = _toCompanion(chantier, syncedAt: DateTime.now());
    final existing = await _chantiersDao.getById(chantier.id);
    if (existing != null) {
      await _chantiersDao.updateOne(companion);
    } else {
      await _chantiersDao.insertOne(companion);
    }
  }

  Future<Chantier> _createOffline(Chantier chantier) async {
    await _chantiersDao.insertOne(_toCompanion(chantier));
    await _syncService.addToQueue(
      operation: 'create',
      entity: 'chantier',
      data: chantier.toJson(),
      entityId: chantier.id,
    );
    return chantier;
  }

  Future<Chantier> _updateOffline(Chantier chantier) async {
    await _chantiersDao.updateOne(_toCompanion(chantier));
    await _syncService.addToQueue(
      operation: 'update',
      entity: 'chantier',
      data: chantier.toJson(),
      entityId: chantier.id,
    );
    return chantier;
  }

  Future<void> _deleteOffline(String id) async {
    await _chantiersDao.deleteById(id);
    await _syncService.addToQueue(
      operation: 'delete',
      entity: 'chantier',
      data: {},
      entityId: id,
    );
  }

  // ============== Mappers ==============

  List<Chantier> _parseChantiersList(dynamic responseData) {
    List<dynamic> items;
    if (responseData is Map) {
      items = responseData['data'] as List? ?? [];
    } else if (responseData is List) {
      items = responseData;
    } else {
      return [];
    }
    return items
        .map((json) => Chantier.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Chantier _parseChantier(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      if (responseData.containsKey('data')) {
        return Chantier.fromJson(responseData['data'] as Map<String, dynamic>);
      }
      return Chantier.fromJson(responseData);
    }
    throw Exception('Invalid chantier response');
  }

  Chantier _fromData(ChantiersTableData data) {
    return Chantier(
      id: data.id,
      clientId: data.clientId,
      adresse: data.adresse,
      codePostal: data.codePostal,
      ville: data.ville,
      latitude: data.latitude,
      longitude: data.longitude,
      typePrestation: _parseTypePrestation(data.typePrestation),
      description: data.description,
      surface: data.surface,
      statut: ChantierStatut.values.firstWhere(
        (s) => s.value == data.statut,
        orElse: () => ChantierStatut.lead,
      ),
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      responsableId: data.responsableId,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    );
  }

  List<TypePrestation> _parseTypePrestation(String json) {
    try {
      final list = (jsonDecode(json) as List).cast<String>();
      return list
          .map((v) => TypePrestation.values.firstWhere(
                (t) => t.value == v,
                orElse: () => TypePrestation.autre,
              ))
          .toList();
    } catch (_) {
      return [];
    }
  }

  ChantiersTableCompanion _toCompanion(Chantier chantier,
      {DateTime? syncedAt}) {
    return ChantiersTableCompanion(
      id: Value(chantier.id),
      clientId: Value(chantier.clientId),
      adresse: Value(chantier.adresse),
      codePostal: Value(chantier.codePostal),
      ville: Value(chantier.ville),
      latitude: Value(chantier.latitude),
      longitude: Value(chantier.longitude),
      typePrestation: Value(
          jsonEncode(chantier.typePrestation.map((t) => t.value).toList())),
      description: Value(chantier.description),
      surface: Value(chantier.surface),
      statut: Value(chantier.statut.value),
      dateDebut: Value(chantier.dateDebut),
      dateFin: Value(chantier.dateFin),
      responsableId: Value(chantier.responsableId),
      notes: Value(chantier.notes),
      createdAt: Value(chantier.createdAt),
      updatedAt: Value(chantier.updatedAt),
      syncedAt: Value(syncedAt),
    );
  }
}
