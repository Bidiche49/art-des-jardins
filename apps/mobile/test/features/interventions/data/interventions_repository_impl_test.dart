import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/daos/interventions_dao.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/interventions/data/interventions_repository_impl.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockInterventionsDao extends Mock implements InterventionsDao {}

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockSyncService extends Mock implements SyncService {}

Intervention _testIntervention({
  String id = 'i1',
  String chantierId = 'ch1',
  String description = 'Tonte pelouse',
  DateTime? date,
}) =>
    Intervention(
      id: id,
      chantierId: chantierId,
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      heureFin: DateTime(2026, 2, 10, 12, 0),
      dureeMinutes: 240,
      description: description,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

InterventionsTableData _testData({
  String id = 'i1',
  String chantierId = 'ch1',
  String? description = 'Tonte pelouse',
  DateTime? date,
}) =>
    InterventionsTableData(
      id: id,
      chantierId: chantierId,
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      heureFin: DateTime(2026, 2, 10, 12, 0),
      dureeMinutes: 240,
      description: description,
      notes: null,
      valide: false,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
      syncedAt: null,
    );

void main() {
  late MockInterventionsDao mockDao;
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;
  late MockSyncService mockSync;
  late InterventionsRepositoryImpl repo;

  setUp(() {
    mockDao = MockInterventionsDao();
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();
    mockSync = MockSyncService();
    repo = InterventionsRepositoryImpl(
      interventionsDao: mockDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
      syncService: mockSync,
    );

    registerFallbackValue(const InterventionsTableCompanion());

    // Default stubs
    when(() => mockDao.getById(any())).thenAnswer((_) async => null);
    when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);
    when(() => mockDao.updateOne(any())).thenAnswer((_) async => true);
    when(() => mockDao.deleteById(any())).thenAnswer((_) async => 1);
    when(() => mockSync.addToQueue(
          operation: any(named: 'operation'),
          entity: any(named: 'entity'),
          data: any(named: 'data'),
          entityId: any(named: 'entityId'),
        )).thenAnswer((_) async {});
  });

  group('InterventionsRepositoryImpl', () {
    test('getAll online -> API + cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [_testIntervention().toJson()],
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getAll();

      expect(result, hasLength(1));
      expect(result.first.id, 'i1');
      verify(() => mockDio.get('/interventions')).called(1);
    });

    test('getAll offline -> cache fallback', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll())
          .thenAnswer((_) async => [_testData()]);

      final result = await repo.getAll();

      expect(result, hasLength(1));
      expect(result.first.description, 'Tonte pelouse');
      verifyNever(() => mockDio.get(any()));
    });

    test('getAll online erreur -> cache fallback', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenThrow(DioException(
        requestOptions: RequestOptions(),
      ));
      when(() => mockDao.getAll())
          .thenAnswer((_) async => [_testData()]);

      final result = await repo.getAll();

      expect(result, hasLength(1));
    });

    test('getById online -> API + cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: _testIntervention().toJson(),
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getById('i1');

      expect(result.id, 'i1');
    });

    test('getById offline -> cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getById('i1'))
          .thenAnswer((_) async => _testData());

      final result = await repo.getById('i1');

      expect(result.description, 'Tonte pelouse');
    });

    test('create online -> POST API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: _testIntervention(id: 'server-id').toJson(),
                statusCode: 201,
                requestOptions: RequestOptions(),
              ));

      final result =
          await repo.create(_testIntervention(id: ''));

      expect(result.id, 'server-id');
    });

    test('create offline -> temp ID + sync queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      final result =
          await repo.create(_testIntervention(id: ''));

      expect(result.id, startsWith('temp-'));
      verify(() => mockSync.addToQueue(
            operation: 'create',
            entity: 'intervention',
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).called(1);
    });

    test('update online -> PUT API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.put(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: _testIntervention(description: 'Modifie').toJson(),
                statusCode: 200,
                requestOptions: RequestOptions(),
              ));

      final result = await repo.update(_testIntervention());

      expect(result.description, 'Modifie');
    });

    test('update offline -> cache + sync queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      await repo.update(_testIntervention());

      verify(() => mockSync.addToQueue(
            operation: 'update',
            entity: 'intervention',
            data: any(named: 'data'),
            entityId: 'i1',
          )).called(1);
    });

    test('delete online -> DELETE API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.delete(any())).thenAnswer((_) async => Response(
            statusCode: 204,
            requestOptions: RequestOptions(),
          ));

      await repo.delete('i1');

      verify(() => mockDio.delete('/interventions/i1')).called(1);
      verify(() => mockDao.deleteById('i1')).called(1);
    });

    test('delete offline -> cache + sync queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      await repo.delete('i1');

      verify(() => mockSync.addToQueue(
            operation: 'delete',
            entity: 'intervention',
            data: any(named: 'data'),
            entityId: 'i1',
          )).called(1);
    });

    test('getByChantier -> filtrage par chantierId', () async {
      when(() => mockDao.getByChantier('ch1'))
          .thenAnswer((_) async => [_testData()]);

      final result = await repo.getByChantier('ch1');

      expect(result, hasLength(1));
      expect(result.first.chantierId, 'ch1');
    });

    test('getByDateRange -> filtre par plage de dates', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [
            _testData(id: 'i1', date: DateTime(2026, 2, 10)),
            _testData(id: 'i2', date: DateTime(2026, 2, 12)),
            _testData(id: 'i3', date: DateTime(2026, 2, 20)),
          ]);

      final result = await repo.getByDateRange(
        DateTime(2026, 2, 10),
        DateTime(2026, 2, 14),
      );

      expect(result, hasLength(2));
      expect(result.map((i) => i.id), containsAll(['i1', 'i2']));
    });
  });
}
