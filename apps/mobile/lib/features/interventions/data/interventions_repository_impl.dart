import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/interventions_dao.dart';
import '../../../domain/models/intervention.dart';
import '../../../services/sync/sync_service.dart';
import '../domain/interventions_repository.dart';

class InterventionsRepositoryImpl implements InterventionsRepository {
  InterventionsRepositoryImpl({
    required InterventionsDao interventionsDao,
    required Dio authDio,
    required ConnectivityService connectivityService,
    required SyncService syncService,
  })  : _interventionsDao = interventionsDao,
        _authDio = authDio,
        _connectivity = connectivityService,
        _syncService = syncService;

  final InterventionsDao _interventionsDao;
  final Dio _authDio;
  final ConnectivityService _connectivity;
  final SyncService _syncService;

  @override
  Future<List<Intervention>> getAll() async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.interventions);
        final interventions = _parseInterventionsList(response.data);
        await _cacheAll(interventions);
        return interventions;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<Intervention> getById(String id) async {
    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.get(ApiEndpoints.intervention(id));
        final intervention = _parseIntervention(response.data);
        await _cacheIntervention(intervention);
        return intervention;
      } catch (_) {
        return _getByIdFromCache(id);
      }
    }
    return _getByIdFromCache(id);
  }

  @override
  Future<Intervention> create(Intervention intervention) async {
    final now = DateTime.now();
    final newIntervention = intervention.copyWith(
      id: intervention.id.isEmpty
          ? 'temp-${now.millisecondsSinceEpoch}'
          : intervention.id,
      createdAt: now,
      updatedAt: now,
    );

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.post(
          ApiEndpoints.interventions,
          data: newIntervention.toJson()..remove('id'),
        );
        final created = _parseIntervention(response.data);
        await _cacheIntervention(created);
        return created;
      } catch (_) {
        return _createOffline(newIntervention);
      }
    }
    return _createOffline(newIntervention);
  }

  @override
  Future<Intervention> update(Intervention intervention) async {
    final updated = intervention.copyWith(updatedAt: DateTime.now());

    if (await _connectivity.isOnline) {
      try {
        final response = await _authDio.put(
          ApiEndpoints.intervention(intervention.id),
          data: updated.toJson(),
        );
        final result = _parseIntervention(response.data);
        await _cacheIntervention(result);
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
        await _authDio.delete(ApiEndpoints.intervention(id));
        await _interventionsDao.deleteById(id);
        return;
      } catch (_) {
        await _deleteOffline(id);
        return;
      }
    }
    await _deleteOffline(id);
  }

  @override
  Future<List<Intervention>> getByChantier(String chantierId) async {
    final cached = await _interventionsDao.getByChantier(chantierId);
    return cached.map(_fromData).toList();
  }

  @override
  Future<List<Intervention>> getByDate(DateTime date) async {
    final cached = await _interventionsDao.getByDate(date);
    return cached.map(_fromData).toList();
  }

  @override
  Future<List<Intervention>> getByDateRange(
      DateTime start, DateTime end) async {
    final all = await getAll();
    final startDay = DateTime(start.year, start.month, start.day);
    final endDay = DateTime(end.year, end.month, end.day)
        .add(const Duration(days: 1));
    return all
        .where((i) =>
            !i.date.isBefore(startDay) && i.date.isBefore(endDay))
        .toList();
  }

  // ============== Private helpers ==============

  Future<List<Intervention>> _getAllFromCache() async {
    final cached = await _interventionsDao.getAll();
    return cached.map(_fromData).toList();
  }

  Future<Intervention> _getByIdFromCache(String id) async {
    final data = await _interventionsDao.getById(id);
    if (data == null) throw Exception('Intervention $id not found in cache');
    return _fromData(data);
  }

  Future<void> _cacheAll(List<Intervention> interventions) async {
    for (final intervention in interventions) {
      await _cacheIntervention(intervention);
    }
  }

  Future<void> _cacheIntervention(Intervention intervention) async {
    final companion =
        _toCompanion(intervention, syncedAt: DateTime.now());
    final existing = await _interventionsDao.getById(intervention.id);
    if (existing != null) {
      await _interventionsDao.updateOne(companion);
    } else {
      await _interventionsDao.insertOne(companion);
    }
  }

  Future<Intervention> _createOffline(Intervention intervention) async {
    await _interventionsDao.insertOne(_toCompanion(intervention));
    await _syncService.addToQueue(
      operation: 'create',
      entity: 'intervention',
      data: intervention.toJson(),
      entityId: intervention.id,
    );
    return intervention;
  }

  Future<Intervention> _updateOffline(Intervention intervention) async {
    await _interventionsDao.updateOne(_toCompanion(intervention));
    await _syncService.addToQueue(
      operation: 'update',
      entity: 'intervention',
      data: intervention.toJson(),
      entityId: intervention.id,
    );
    return intervention;
  }

  Future<void> _deleteOffline(String id) async {
    await _interventionsDao.deleteById(id);
    await _syncService.addToQueue(
      operation: 'delete',
      entity: 'intervention',
      data: {},
      entityId: id,
    );
  }

  // ============== Mappers ==============

  List<Intervention> _parseInterventionsList(dynamic responseData) {
    List<dynamic> items;
    if (responseData is Map) {
      items = responseData['data'] as List? ?? [];
    } else if (responseData is List) {
      items = responseData;
    } else {
      return [];
    }
    return items
        .map((json) => Intervention.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Intervention _parseIntervention(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      if (responseData.containsKey('data')) {
        return Intervention.fromJson(
            responseData['data'] as Map<String, dynamic>);
      }
      return Intervention.fromJson(responseData);
    }
    throw Exception('Invalid intervention response');
  }

  Intervention _fromData(InterventionsTableData data) {
    return Intervention(
      id: data.id,
      chantierId: data.chantierId,
      employeId: data.employeId,
      date: data.date,
      heureDebut: data.heureDebut,
      heureFin: data.heureFin,
      dureeMinutes: data.dureeMinutes,
      description: data.description,
      notes: data.notes,
      valide: data.valide,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    );
  }

  InterventionsTableCompanion _toCompanion(Intervention intervention,
      {DateTime? syncedAt}) {
    return InterventionsTableCompanion(
      id: Value(intervention.id),
      chantierId: Value(intervention.chantierId),
      employeId: Value(intervention.employeId),
      date: Value(intervention.date),
      heureDebut: Value(intervention.heureDebut),
      heureFin: Value(intervention.heureFin),
      dureeMinutes: Value(intervention.dureeMinutes),
      description: Value(intervention.description),
      notes: Value(intervention.notes),
      valide: Value(intervention.valide),
      createdAt: Value(intervention.createdAt),
      updatedAt: Value(intervention.updatedAt),
      syncedAt: Value(syncedAt),
    );
  }
}
