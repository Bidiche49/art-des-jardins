import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../../core/network/api_endpoints.dart';
import '../../../core/network/connectivity_service.dart';
import '../../../data/local/database/app_database.dart';
import '../../../data/local/database/daos/absences_dao.dart';
import '../../../domain/enums/absence_type.dart';
import '../../../domain/models/absence.dart';
import '../../../services/sync/sync_service.dart';
import '../domain/absences_repository.dart';

class AbsencesRepositoryImpl implements AbsencesRepository {
  AbsencesRepositoryImpl({
    required this.absencesDao,
    required this.authDio,
    required this.connectivityService,
    required this.syncService,
  });

  final AbsencesDao absencesDao;
  final Dio authDio;
  final ConnectivityService connectivityService;
  final SyncService syncService;

  @override
  Future<List<Absence>> getAll() async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.get(ApiEndpoints.absences);
        final absences = _parseAbsencesList(response.data);
        await _cacheAll(absences);
        return absences;
      } catch (_) {
        return _getAllFromCache();
      }
    }
    return _getAllFromCache();
  }

  @override
  Future<List<Absence>> getMyAbsences(String userId) async {
    final all = await getAll();
    return all.where((a) => a.userId == userId).toList();
  }

  @override
  Future<List<Absence>> getPendingAbsences() async {
    final all = await getAll();
    return all.where((a) => !a.validee).toList();
  }

  @override
  Future<Absence> create(Absence absence) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.post(
          ApiEndpoints.absences,
          data: absence.toJson(),
        );
        final created = _parseAbsence(response.data);
        await _cacheAbsence(created);
        return created;
      } catch (_) {
        return _createOffline(absence);
      }
    }
    return _createOffline(absence);
  }

  @override
  Future<Absence> validate(String id) async {
    if (await connectivityService.isOnline) {
      try {
        final response = await authDio.patch(
          '${ApiEndpoints.absences}/$id',
          data: {'validee': true},
        );
        final updated = _parseAbsence(response.data);
        await _cacheAbsence(updated);
        return updated;
      } catch (_) {
        return _validateOffline(id);
      }
    }
    return _validateOffline(id);
  }

  @override
  Future<Absence> refuse(String id) async {
    if (await connectivityService.isOnline) {
      try {
        await authDio.delete('${ApiEndpoints.absences}/$id');
        await absencesDao.deleteById(id);
        // Return a placeholder - caller should refresh
        throw Exception('Deleted');
      } catch (e) {
        if (e.toString().contains('Deleted')) rethrow;
        await _deleteOffline(id);
        rethrow;
      }
    }
    await _deleteOffline(id);
    throw Exception('Deleted offline');
  }

  @override
  Future<void> delete(String id) async {
    if (await connectivityService.isOnline) {
      try {
        await authDio.delete('${ApiEndpoints.absences}/$id');
        await absencesDao.deleteById(id);
        return;
      } catch (_) {
        await _deleteOffline(id);
        return;
      }
    }
    await _deleteOffline(id);
  }

  // ============== Private helpers ==============

  Future<List<Absence>> _getAllFromCache() async {
    final cached = await absencesDao.getAll();
    return cached.map(_fromData).toList();
  }

  Future<void> _cacheAll(List<Absence> absences) async {
    for (final absence in absences) {
      await _cacheAbsence(absence);
    }
  }

  Future<void> _cacheAbsence(Absence absence) async {
    final companion = _toCompanion(absence, syncedAt: DateTime.now());
    final existing = await absencesDao.getById(absence.id);
    if (existing != null) {
      await absencesDao.updateOne(companion);
    } else {
      await absencesDao.insertOne(companion);
    }
  }

  Future<Absence> _createOffline(Absence absence) async {
    await absencesDao.insertOne(_toCompanion(absence));
    await syncService.addToQueue(
      operation: 'create',
      entity: 'absence',
      data: absence.toJson(),
      entityId: absence.id,
    );
    return absence;
  }

  Future<Absence> _validateOffline(String id) async {
    final data = await absencesDao.getById(id);
    if (data == null) throw Exception('Absence $id not found');
    final absence = _fromData(data).copyWith(validee: true);
    await absencesDao.updateOne(_toCompanion(absence));
    await syncService.addToQueue(
      operation: 'update',
      entity: 'absence',
      data: absence.toJson(),
      entityId: id,
    );
    return absence;
  }

  Future<void> _deleteOffline(String id) async {
    await absencesDao.deleteById(id);
    await syncService.addToQueue(
      operation: 'delete',
      entity: 'absence',
      data: {},
      entityId: id,
    );
  }

  // ============== Mappers ==============

  List<Absence> _parseAbsencesList(dynamic responseData) {
    List<dynamic> items;
    if (responseData is Map) {
      items = responseData['data'] as List? ?? [];
    } else if (responseData is List) {
      items = responseData;
    } else {
      return [];
    }
    return items
        .map((json) => Absence.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Absence _parseAbsence(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      if (responseData.containsKey('data')) {
        return Absence.fromJson(
            responseData['data'] as Map<String, dynamic>);
      }
      return Absence.fromJson(responseData);
    }
    throw Exception('Invalid absence response');
  }

  Absence _fromData(AbsencesTableData data) {
    return Absence(
      id: data.id,
      userId: data.userId,
      dateDebut: data.dateDebut,
      dateFin: data.dateFin,
      type: AbsenceType.values.firstWhere(
        (t) => t.value == data.type,
        orElse: () => AbsenceType.autre,
      ),
      motif: data.motif,
      validee: data.validee,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    );
  }

  AbsencesTableCompanion _toCompanion(Absence absence,
      {DateTime? syncedAt}) {
    return AbsencesTableCompanion(
      id: Value(absence.id),
      userId: Value(absence.userId),
      dateDebut: Value(absence.dateDebut),
      dateFin: Value(absence.dateFin),
      type: Value(absence.type.value),
      motif: Value(absence.motif),
      validee: Value(absence.validee),
      createdAt: Value(absence.createdAt),
      updatedAt: Value(absence.updatedAt),
      syncedAt: Value(syncedAt),
    );
  }
}
