import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/daos/devis_dao.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/domain/enums/devis_statut.dart';
import 'package:art_et_jardin/domain/models/devis.dart';
import 'package:art_et_jardin/features/devis/data/devis_repository_impl.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockDevisDao extends Mock implements DevisDao {}

class MockDio extends Mock implements Dio {
  @override
  BaseOptions get options => BaseOptions(baseUrl: 'http://localhost:3000/api');
}

class MockConnectivity extends Mock implements ConnectivityService {}

class MockSync extends Mock implements SyncService {}

Devis _testDevis({String id = 'devis-1'}) => Devis(
      id: id,
      chantierId: 'chantier-1',
      numero: 'DEV-2026-001',
      dateEmission: DateTime(2026, 1, 1),
      dateValidite: DateTime(2026, 1, 31),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
      statut: DevisStatut.brouillon,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

DevisTableData _testRow({String id = 'devis-1'}) => DevisTableData(
      id: id,
      chantierId: 'chantier-1',
      numero: 'DEV-2026-001',
      dateEmission: DateTime(2026, 1, 1),
      dateValidite: DateTime(2026, 1, 31),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
      statut: 'brouillon',
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockDevisDao mockDao;
  late MockDio mockDio;
  late MockConnectivity mockConnectivity;
  late MockSync mockSync;
  late DevisRepositoryImpl repo;

  setUp(() {
    mockDao = MockDevisDao();
    mockDio = MockDio();
    mockConnectivity = MockConnectivity();
    mockSync = MockSync();

    repo = DevisRepositoryImpl(
      devisDao: mockDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
      syncService: mockSync,
    );

    registerFallbackValue(const DevisTableCompanion());

    // Default stubs
    when(() => mockDao.getById(any())).thenAnswer((_) async => null);
    when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);
    when(() => mockDao.updateOne(any())).thenAnswer((_) async => true);
    when(() => mockDao.deleteById(any())).thenAnswer((_) async => 1);
  });

  group('getAll', () {
    test('online fetches from API and caches', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [_testDevis().toJson()],
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getAll();
      expect(result.length, 1);
      expect(result[0].numero, 'DEV-2026-001');
      verify(() => mockDao.insertOne(any())).called(1);
    });

    test('offline returns cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [_testRow()]);

      final result = await repo.getAll();
      expect(result.length, 1);
    });

    test('API error falls back to cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenThrow(
          DioException(requestOptions: RequestOptions()));
      when(() => mockDao.getAll()).thenAnswer((_) async => [_testRow()]);

      final result = await repo.getAll();
      expect(result.length, 1);
    });
  });

  group('getById', () {
    test('online fetches from API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: _testDevis().toJson(),
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getById('devis-1');
      expect(result.id, 'devis-1');
    });

    test('offline returns cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getById('devis-1'))
          .thenAnswer((_) async => _testRow());

      final result = await repo.getById('devis-1');
      expect(result.id, 'devis-1');
    });
  });

  group('create', () {
    test('offline creates temp ID and queues sync', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            entity: any(named: 'entity'),
            entityId: any(named: 'entityId'),
            operation: any(named: 'operation'),
            data: any(named: 'data'),
          )).thenAnswer((_) async {});

      final result = await repo.create(
        chantierId: 'chantier-1',
        lignes: [],
      );

      expect(result.id, startsWith('temp-'));
      expect(result.statut, DevisStatut.brouillon);
      verify(() => mockSync.addToQueue(
            entity: 'devis',
            entityId: any(named: 'entityId'),
            operation: 'create',
            data: any(named: 'data'),
          )).called(1);
    });

    test('online posts to API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: _testDevis().toJson(),
                statusCode: 201,
                requestOptions: RequestOptions(),
              ));

      final result = await repo.create(
        chantierId: 'chantier-1',
        lignes: [],
      );

      expect(result.numero, 'DEV-2026-001');
    });
  });

  group('delete', () {
    test('online deletes via API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.delete(any())).thenAnswer((_) async => Response(
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      await repo.delete('devis-1');
      verify(() => mockDao.deleteById('devis-1')).called(1);
    });

    test('offline deletes locally and queues sync', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            entity: any(named: 'entity'),
            entityId: any(named: 'entityId'),
            operation: any(named: 'operation'),
            data: any(named: 'data'),
          )).thenAnswer((_) async {});

      await repo.delete('devis-1');
      verify(() => mockDao.deleteById('devis-1')).called(1);
      verify(() => mockSync.addToQueue(
            entity: 'devis',
            entityId: 'devis-1',
            operation: 'delete',
            data: any(named: 'data'),
          )).called(1);
    });
  });

  group('getPdfUrl', () {
    test('returns correct URL', () async {
      final url = await repo.getPdfUrl('devis-1');
      expect(url, contains('/devis/devis-1/pdf'));
    });
  });

  group('getTemplates', () {
    test('online fetches templates', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [
              {
                'id': 'tpl-1',
                'name': 'Tonte',
                'category': 'entretien',
                'unit': 'm2',
                'unitPriceHT': 15.0,
                'tvaRate': 20.0,
                'isGlobal': false,
                'createdAt': '2026-01-01T00:00:00.000',
                'updatedAt': '2026-01-01T00:00:00.000',
              }
            ],
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getTemplates();
      expect(result.length, 1);
      expect(result[0].name, 'Tonte');
    });

    test('offline returns empty', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      final result = await repo.getTemplates();
      expect(result, isEmpty);
    });
  });
}
