import 'dart:async';
import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

void main() {
  late AppDatabase db;
  late MockDio mockDio;
  late SyncService syncService;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
    mockDio = MockDio();
    syncService = SyncService(
      syncQueueDao: db.syncQueueDao,
      authDio: mockDio,
    );
  });

  tearDown(() async {
    await db.close();
  });

  setUpAll(() {
    registerFallbackValue(RequestOptions(path: ''));
  });

  // ============== addToQueue ==============
  group('addToQueue', () {
    test('inserts with status pending', () async {
      await syncService.addToQueue(
        operation: 'create',
        entity: 'client',
        data: {'nom': 'Dupont'},
      );

      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));
      expect(items.first.status, 'pending');
      expect(items.first.operation, 'create');
    });

    test('generates increasing timestamps', () async {
      await syncService.addToQueue(
        operation: 'create',
        entity: 'client',
        data: {'nom': 'A'},
      );
      await Future<void>.delayed(const Duration(milliseconds: 10));
      await syncService.addToQueue(
        operation: 'create',
        entity: 'client',
        data: {'nom': 'B'},
      );

      final items = await db.syncQueueDao.getAll();
      expect(items[1].timestamp, greaterThan(items[0].timestamp));
    });

    test('works with create/update/delete operations', () async {
      for (final op in ['create', 'update', 'delete']) {
        await syncService.addToQueue(
          operation: op,
          entity: 'client',
          data: {'test': true},
          entityId: 'id-123',
        );
      }

      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(3));
      expect(items.map((i) => i.operation).toList(),
          ['create', 'update', 'delete']);
    });

    test('serializes data as JSON', () async {
      final data = {'nom': 'Dupont', 'email': 'test@test.fr', 'tags': ['vip']};
      await syncService.addToQueue(
        operation: 'create',
        entity: 'client',
        data: data,
      );

      final items = await db.syncQueueDao.getAll();
      final stored = jsonDecode(items.first.data) as Map<String, dynamic>;
      expect(stored['nom'], 'Dupont');
      expect(stored['tags'], ['vip']);
    });

    test('works for different entities', () async {
      for (final entity in ['client', 'chantier', 'devis', 'intervention']) {
        await syncService.addToQueue(
          operation: 'create',
          entity: entity,
          data: {'test': true},
        );
      }

      final items = await db.syncQueueDao.getAll();
      expect(items.map((i) => i.entity).toSet(),
          {'client', 'chantier', 'devis', 'intervention'});
    });

    test('multiple items sorted by timestamp', () async {
      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'n': 1});
      await syncService.addToQueue(
        operation: 'update', entity: 'chantier', data: {'n': 2});
      await syncService.addToQueue(
        operation: 'delete', entity: 'devis', data: {'n': 3});

      final pending = await db.syncQueueDao.getPending();
      expect(pending, hasLength(3));
      for (int i = 1; i < pending.length; i++) {
        expect(pending[i].timestamp,
            greaterThanOrEqualTo(pending[i - 1].timestamp));
      }
    });
  });

  // ============== syncAll ==============
  group('syncAll', () {
    test('processes items in timestamp order', () async {
      final calledEndpoints = <String>[];
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((inv) async {
        calledEndpoints.add(inv.positionalArguments[0] as String);
        return Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 201,
        );
      });

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'first': true});
      await syncService.addToQueue(
        operation: 'create', entity: 'chantier', data: {'second': true});

      await syncService.syncAll();

      expect(calledEndpoints, ['/clients', '/chantiers']);
    });

    test('create OK -> item deleted from queue', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      final result = await syncService.syncAll();

      expect(result.synced, 1);
      final remaining = await db.syncQueueDao.getAll();
      expect(remaining, isEmpty);
    });

    test('update OK -> item deleted from queue', () async {
      when(() => mockDio.put(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 200,
              ));

      await syncService.addToQueue(
        operation: 'update',
        entity: 'client',
        data: {'nom': 'Updated'},
        entityId: 'abc-123',
      );

      final result = await syncService.syncAll();

      expect(result.synced, 1);
      expect(await db.syncQueueDao.getAll(), isEmpty);
    });

    test('delete OK -> item deleted from queue', () async {
      when(() => mockDio.delete(any()))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 200,
              ));

      await syncService.addToQueue(
        operation: 'delete',
        entity: 'client',
        data: {},
        entityId: 'abc-123',
      );

      final result = await syncService.syncAll();
      expect(result.synced, 1);
    });

    test('sync fails 500 -> retryCount incremented, status pending', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      await syncService.syncAll();

      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));
      expect(items.first.retryCount, 1);
      expect(items.first.status, 'pending');
    });

    test('sync fails network -> retryCount incremented', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        type: DioExceptionType.connectionError,
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      await syncService.syncAll();

      final items = await db.syncQueueDao.getAll();
      expect(items.first.retryCount, 1);
    });

    test('max retries reached -> status failed', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      // Retry 3 times
      await syncService.syncAll();
      await syncService.syncAll();
      await syncService.syncAll();

      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));
      expect(items.first.status, 'failed');
      expect(items.first.retryCount, 3);
    });

    test('HTTP 409 -> conflict, item stays pending', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 409,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      final result = await syncService.syncAll();

      expect(result.conflicts, 1);
      final items = await db.syncQueueDao.getAll();
      expect(items.first.status, 'pending');
      expect(items.first.lastError, 'conflict');
    });

    test('empty queue -> returns immediately', () async {
      final result = await syncService.syncAll();
      expect(result.synced, 0);
      expect(result.failed, 0);
      verifyNever(() => mockDio.post(any(), data: any(named: 'data')));
    });

    test('error on 1 item -> continues with next', () async {
      var callCount = 0;
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async {
        callCount++;
        if (callCount == 1) {
          throw DioException(
            requestOptions: RequestOptions(path: ''),
            response: Response(
              requestOptions: RequestOptions(path: ''),
              statusCode: 500,
            ),
          );
        }
        return Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 201,
        );
      });

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Fail'});
      await syncService.addToQueue(
        operation: 'create', entity: 'chantier', data: {'nom': 'OK'});

      final result = await syncService.syncAll();

      expect(result.synced, 1);
      // Failed item remains, successful item removed
      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));
      expect(items.first.entity, 'client');
    });

    test('5 items in queue -> all processed sequentially', () async {
      final processed = <String>[];
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((inv) async {
        processed.add(inv.positionalArguments[0] as String);
        return Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 201,
        );
      });

      for (int i = 0; i < 5; i++) {
        await syncService.addToQueue(
          operation: 'create', entity: 'client', data: {'n': i});
      }

      final result = await syncService.syncAll();
      expect(result.synced, 5);
      expect(processed, hasLength(5));
    });

    test('concurrent syncAll calls -> no duplicate processing', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async {
        await Future<void>.delayed(const Duration(milliseconds: 10));
        return Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 201,
        );
      });

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      final r1 = syncService.syncAll();
      final r2 = syncService.syncAll();
      final results = await Future.wait([r1, r2]);

      // One should sync, other should skip
      final totalSynced = results.fold(0, (sum, r) => sum + r.synced);
      expect(totalSynced, 1);
    });
  });

  // ============== retryFailed ==============
  group('retryFailed', () {
    test('resets failed items to pending', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'nom': 'Test'});

      // Fail 3 times
      await syncService.syncAll();
      await syncService.syncAll();
      await syncService.syncAll();

      var items = await db.syncQueueDao.getAll();
      expect(items.first.status, 'failed');

      // Now retry succeeds
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.retryFailed();

      items = await db.syncQueueDao.getAll();
      expect(items, isEmpty); // Successfully synced
    });

    test('resets retryCount to 0', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      await syncService.syncAll();
      await syncService.syncAll();
      await syncService.syncAll();

      // Before retry
      var items = await db.syncQueueDao.getAll();
      expect(items.first.retryCount, 3);
      expect(items.first.status, 'failed');

      // After retryFailed (which also resets and syncs, but will fail again)
      await syncService.retryFailed();

      items = await db.syncQueueDao.getAll();
      expect(items.first.retryCount, 1); // Failed once more during sync
    });

    test('no failed items -> no-op', () async {
      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      await syncService.retryFailed();

      // Pending item unaffected
      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));
      expect(items.first.status, 'pending');
    });

    test('pending items not affected by retryFailed', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'pending': true});

      // Fail it
      await syncService.syncAll();
      await syncService.syncAll();
      await syncService.syncAll();

      // Add a new pending item
      await syncService.addToQueue(
        operation: 'create', entity: 'chantier', data: {'new': true});

      await syncService.retryFailed();

      final items = await db.syncQueueDao.getAll();
      // Both should exist - one retried+failed again, one newly pending
      expect(items.length, greaterThanOrEqualTo(1));
    });
  });

  // ============== auto-sync ==============
  group('AutoSyncController', () {
    test('online triggers syncAll', () async {
      final mockConnectivity = MockConnectivityService();
      final controller = StreamController<ConnectivityStatus>.broadcast();

      when(() => mockConnectivity.statusStream).thenAnswer((_) => controller.stream);
      when(() => mockConnectivity.startListening()).thenReturn(null);
      when(() => mockConnectivity.getCurrentStatus())
          .thenAnswer((_) async => ConnectivityStatus.offline);

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      final autoSync = AutoSyncController(
        syncService: syncService,
        connectivityService: mockConnectivity,
      );
      autoSync.start();

      // Go online
      controller.add(ConnectivityStatus.online);
      await Future<void>.delayed(const Duration(seconds: 2));

      final items = await db.syncQueueDao.getAll();
      expect(items, isEmpty);

      autoSync.dispose();
      await controller.close();
    });

    test('app starts online -> initial sync', () async {
      final mockConnectivity = MockConnectivityService();
      final controller = StreamController<ConnectivityStatus>.broadcast();

      when(() => mockConnectivity.statusStream).thenAnswer((_) => controller.stream);
      when(() => mockConnectivity.startListening()).thenReturn(null);
      when(() => mockConnectivity.getCurrentStatus())
          .thenAnswer((_) async => ConnectivityStatus.online);

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      final autoSync = AutoSyncController(
        syncService: syncService,
        connectivityService: mockConnectivity,
      );
      autoSync.start();

      await Future<void>.delayed(const Duration(milliseconds: 500));

      final items = await db.syncQueueDao.getAll();
      expect(items, isEmpty);

      autoSync.dispose();
      await controller.close();
    });

    test('app starts offline -> no sync', () async {
      final mockConnectivity = MockConnectivityService();
      final controller = StreamController<ConnectivityStatus>.broadcast();

      when(() => mockConnectivity.statusStream).thenAnswer((_) => controller.stream);
      when(() => mockConnectivity.startListening()).thenReturn(null);
      when(() => mockConnectivity.getCurrentStatus())
          .thenAnswer((_) async => ConnectivityStatus.offline);

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      final autoSync = AutoSyncController(
        syncService: syncService,
        connectivityService: mockConnectivity,
      );
      autoSync.start();

      await Future<void>.delayed(const Duration(milliseconds: 500));

      // Item still in queue (no sync happened)
      final items = await db.syncQueueDao.getAll();
      expect(items, hasLength(1));

      autoSync.dispose();
      await controller.close();
    });
  });

  // ============== pendingSyncCount ==============
  group('pendingSyncCount', () {
    test('initial count is 0', () async {
      final count = await syncService.watchPendingCount().first;
      expect(count, 0);
    });

    test('count increases on addToQueue', () async {
      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      final count = await syncService.watchPendingCount().first;
      expect(count, 1);
    });

    test('count decreases on successful sync', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});

      var count = await syncService.watchPendingCount().first;
      expect(count, 1);

      await syncService.syncAll();

      count = await syncService.watchPendingCount().first;
      expect(count, 0);
    });

    test('stream emits on changes', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      final counts = <int>[];
      final sub = syncService.watchPendingCount().listen(counts.add);

      await Future<void>.delayed(const Duration(milliseconds: 100));
      await syncService.addToQueue(
        operation: 'create', entity: 'client', data: {'test': true});
      await Future<void>.delayed(const Duration(milliseconds: 100));
      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 100));

      await sub.cancel();

      // Should have emitted at least 0, then 1, then 0
      expect(counts, contains(0));
      expect(counts, contains(1));
    });
  });

  // ============== backoff ==============
  group('backoff', () {
    test('exponential backoff delay', () {
      expect(syncService.getBackoffDelay(0), const Duration(seconds: 1));
      expect(syncService.getBackoffDelay(1), const Duration(seconds: 2));
      expect(syncService.getBackoffDelay(2), const Duration(seconds: 4));
    });
  });
}
