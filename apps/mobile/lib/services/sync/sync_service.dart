import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:drift/drift.dart';

import '../../core/config/app_constants.dart';
import '../../core/network/api_endpoints.dart';
import '../../data/local/database/app_database.dart';
import '../../data/local/database/daos/sync_queue_dao.dart';

class SyncService {
  SyncService({
    required SyncQueueDao syncQueueDao,
    required Dio authDio,
  })  : _syncQueueDao = syncQueueDao,
        _authDio = authDio;

  final SyncQueueDao _syncQueueDao;
  final Dio _authDio;

  bool _isSyncing = false;
  bool get isSyncing => _isSyncing;

  static const int _maxRetries = AppConstants.maxRetries;
  static const Duration _baseDelay = Duration(seconds: 1);

  Future<void> addToQueue({
    required String operation,
    required String entity,
    required Map<String, dynamic> data,
    String? entityId,
  }) async {
    await _syncQueueDao.insertOne(SyncQueueTableCompanion.insert(
      operation: operation,
      entity: entity,
      entityId: Value(entityId),
      data: jsonEncode(data),
      timestamp: DateTime.now().millisecondsSinceEpoch,
    ));
  }

  Future<SyncResult> syncAll() async {
    if (_isSyncing) return const SyncResult(synced: 0, failed: 0, conflicts: 0);
    _isSyncing = true;

    var synced = 0;
    var failed = 0;
    var conflicts = 0;

    try {
      final pending = await _syncQueueDao.getPending();
      if (pending.isEmpty) {
        return const SyncResult(synced: 0, failed: 0, conflicts: 0);
      }

      for (final item in pending) {
        // Mark as syncing
        await _syncQueueDao.updateOne(item.copyWith(status: 'syncing'));

        try {
          await _syncItem(item);
          await _syncQueueDao.deleteById(item.id);
          synced++;
        } on DioException catch (e) {
          if (e.response?.statusCode == 409) {
            // Conflict
            conflicts++;
            await _syncQueueDao.updateOne(
              item.copyWith(status: 'pending', lastError: const Value('conflict')),
            );
          } else {
            await _handleSyncFailure(item, e.message ?? 'Unknown error');
            if (item.retryCount + 1 >= _maxRetries) {
              failed++;
            }
          }
        } catch (e) {
          await _handleSyncFailure(item, e.toString());
          if (item.retryCount + 1 >= _maxRetries) {
            failed++;
          }
        }
      }
    } finally {
      _isSyncing = false;
    }

    return SyncResult(synced: synced, failed: failed, conflicts: conflicts);
  }

  Future<void> _syncItem(SyncQueueTableData item) async {
    final data = jsonDecode(item.data) as Map<String, dynamic>;

    switch (item.operation) {
      case 'create':
        await _authDio.post(
          _entityEndpoint(item.entity),
          data: data,
        );
        break;
      case 'update':
        if (item.entityId == null) throw Exception('entityId required for update');
        await _authDio.put(
          '${_entityEndpoint(item.entity)}/${item.entityId}',
          data: data,
        );
        break;
      case 'delete':
        if (item.entityId == null) throw Exception('entityId required for delete');
        await _authDio.delete(
          '${_entityEndpoint(item.entity)}/${item.entityId}',
        );
        break;
      default:
        throw Exception('Unknown operation: ${item.operation}');
    }
  }

  Future<void> _handleSyncFailure(SyncQueueTableData item, String error) async {
    final newRetryCount = item.retryCount + 1;
    if (newRetryCount >= _maxRetries) {
      await _syncQueueDao.updateOne(
        item.copyWith(
          status: 'failed',
          retryCount: newRetryCount,
          lastError: Value(error),
        ),
      );
    } else {
      await _syncQueueDao.updateOne(
        item.copyWith(
          status: 'pending',
          retryCount: newRetryCount,
          lastError: Value(error),
        ),
      );
    }
  }

  Future<void> retryFailed() async {
    final failed = await _syncQueueDao.getFailed();
    if (failed.isEmpty) return;

    for (final item in failed) {
      await _syncQueueDao.updateOne(
        item.copyWith(status: 'pending', retryCount: 0, lastError: const Value(null)),
      );
    }

    await syncAll();
  }

  Stream<int> watchPendingCount() {
    return _syncQueueDao.watchAll().map(
      (items) => items.where((i) => i.status == 'pending' || i.status == 'syncing').length,
    );
  }

  Duration getBackoffDelay(int retryCount) {
    return _baseDelay * pow(2, retryCount).toInt();
  }

  String _entityEndpoint(String entity) {
    switch (entity) {
      case 'client':
        return ApiEndpoints.clients;
      case 'chantier':
        return ApiEndpoints.chantiers;
      case 'devis':
        return ApiEndpoints.devis;
      case 'facture':
        return ApiEndpoints.factures;
      case 'intervention':
        return ApiEndpoints.interventions;
      default:
        return '/$entity';
    }
  }
}

class SyncResult {
  const SyncResult({
    required this.synced,
    required this.failed,
    required this.conflicts,
  });

  final int synced;
  final int failed;
  final int conflicts;

  bool get hasErrors => failed > 0 || conflicts > 0;
}
