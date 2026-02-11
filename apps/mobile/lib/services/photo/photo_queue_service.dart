import 'dart:io';

import 'package:dio/dio.dart';
import 'package:drift/drift.dart' show Value;

import '../../core/network/api_endpoints.dart';
import '../../core/network/connectivity_service.dart';
import '../../data/local/database/app_database.dart';
import '../../data/local/database/daos/photo_queue_dao.dart';

class PhotoQueueService {
  PhotoQueueService({
    required Dio authDio,
    required ConnectivityService connectivityService,
    required PhotoQueueDao photoQueueDao,
  })  : _authDio = authDio,
        _connectivity = connectivityService,
        _photoQueueDao = photoQueueDao;

  final Dio _authDio;
  final ConnectivityService _connectivity;
  final PhotoQueueDao _photoQueueDao;

  static const int _maxRetries = 3;

  bool _isProcessing = false;

  Future<void> processQueue() async {
    if (_isProcessing) return;
    if (!await _connectivity.isOnline) return;

    _isProcessing = true;
    try {
      final pending = await _photoQueueDao.getPending();
      for (final item in pending) {
        await _processItem(item);
      }
    } finally {
      _isProcessing = false;
    }
  }

  Future<void> _processItem(PhotoQueueTableData item) async {
    final file = File(item.filePath);
    if (!file.existsSync()) {
      await _photoQueueDao.deleteById(item.id);
      return;
    }

    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          item.filePath,
          filename: item.filePath.split('/').last,
        ),
        'type': item.type,
        if (item.latitude != null) 'latitude': item.latitude,
        if (item.longitude != null) 'longitude': item.longitude,
        'takenAt': item.takenAt.toIso8601String(),
      });

      await _authDio.post(
        ApiEndpoints.interventionPhotos(item.interventionId),
        data: formData,
      );

      // Upload OK -> cleanup
      await _photoQueueDao.deleteById(item.id);
      if (file.existsSync()) {
        await file.delete();
      }
    } catch (_) {
      final newAttempts = item.attempts + 1;
      if (newAttempts >= _maxRetries) {
        await _photoQueueDao.updateOne(item.copyWith(
          status: 'failed',
          attempts: newAttempts,
          lastError: const Value('Max retries reached'),
        ));
      } else {
        await _photoQueueDao.updateOne(item.copyWith(
          attempts: newAttempts,
          lastError: const Value('Upload failed'),
        ));
      }
    }
  }

  Future<int> getPendingCount() async {
    final pending = await _photoQueueDao.getPending();
    return pending.length;
  }

  Future<void> retryFailed() async {
    final all = await _photoQueueDao.getAll();
    for (final item in all.where((i) => i.status == 'failed')) {
      await _photoQueueDao.updateOne(item.copyWith(
        status: 'pending',
        attempts: 0,
        lastError: const Value(null),
      ));
    }
    await processQueue();
  }
}
