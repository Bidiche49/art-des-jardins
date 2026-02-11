import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/connectivity_service.dart';
import '../../core/network/dio_client.dart';
import '../../data/local/database/app_database.dart';
import '../../data/local/database/daos/sync_queue_dao.dart';
import '../../domain/models/sync_conflict.dart';
import 'conflict_service.dart';
import 'sync_service.dart';

final appDatabaseProvider = Provider<AppDatabase>((ref) {
  throw UnimplementedError('AppDatabase must be overridden in ProviderScope');
});

final syncQueueDaoProvider = Provider<SyncQueueDao>((ref) {
  return ref.read(appDatabaseProvider).syncQueueDao;
});

final syncServiceProvider = Provider<SyncService>((ref) {
  return SyncService(
    syncQueueDao: ref.read(syncQueueDaoProvider),
    authDio: ref.read(authDioProvider),
  );
});

final pendingSyncCountProvider = StreamProvider<int>((ref) {
  final syncService = ref.read(syncServiceProvider);
  return syncService.watchPendingCount();
});

final autoSyncProvider = Provider<AutoSyncController>((ref) {
  final syncService = ref.read(syncServiceProvider);
  final connectivity = ref.read(connectivityServiceProvider);
  final controller = AutoSyncController(
    syncService: syncService,
    connectivityService: connectivity,
  );
  ref.onDispose(controller.dispose);
  return controller;
});

// ============== Conflict providers ==============

final conflictServiceProvider = Provider<ConflictService>((ref) {
  return ConflictService();
});

final conflictNotifierProvider =
    StateNotifierProvider<ConflictNotifier, List<SyncConflict>>((ref) {
  return ConflictNotifier(
    conflictService: ref.read(conflictServiceProvider),
  );
});

final conflictCountProvider = Provider<int>((ref) {
  return ref.watch(conflictNotifierProvider).length;
});

class ConflictNotifier extends StateNotifier<List<SyncConflict>> {
  ConflictNotifier({required ConflictService conflictService})
      : _conflictService = conflictService,
        super([]);

  final ConflictService _conflictService;

  int get conflictCount => state.length;

  void addConflict(SyncConflict conflict) {
    state = [...state, conflict];
  }

  Map<String, dynamic> resolveConflict({
    required String conflictId,
    required String strategy,
    Map<String, dynamic>? mergeOverrides,
  }) {
    final conflict = state.firstWhere((c) => c.id == conflictId);
    final resolved = _conflictService.resolveConflict(
      conflict: conflict,
      strategy: strategy,
      mergeOverrides: mergeOverrides,
    );
    state = state.where((c) => c.id != conflictId).toList();
    return resolved;
  }
}

// ============== Auto-sync ==============

class AutoSyncController {
  AutoSyncController({
    required SyncService syncService,
    required ConnectivityService connectivityService,
  })  : _syncService = syncService,
        _connectivityService = connectivityService;

  final SyncService _syncService;
  final ConnectivityService _connectivityService;
  StreamSubscription<ConnectivityStatus>? _subscription;
  Timer? _debounce;
  bool _started = false;

  void start() {
    if (_started) return;
    _started = true;

    _connectivityService.startListening();
    _subscription = _connectivityService.statusStream.listen((status) {
      _debounce?.cancel();
      if (status == ConnectivityStatus.online) {
        _debounce = Timer(const Duration(seconds: 1), () {
          _syncService.syncAll();
        });
      }
    });

    // Initial sync if online
    _connectivityService.getCurrentStatus().then((status) {
      if (status == ConnectivityStatus.online) {
        _syncService.syncAll();
      }
    });
  }

  void dispose() {
    _debounce?.cancel();
    _subscription?.cancel();
    _started = false;
  }
}
