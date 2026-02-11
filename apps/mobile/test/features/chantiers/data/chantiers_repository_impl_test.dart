import 'package:dio/dio.dart';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:art_et_jardin/features/chantiers/data/chantiers_repository_impl.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockSyncService extends Mock implements SyncService {}

Chantier _testChantier({
  String id = 'ch1',
  String clientId = 'c1',
  ChantierStatut statut = ChantierStatut.lead,
  String description = 'Amenagement jardin',
  String adresse = '1 rue du Parc',
}) =>
    Chantier(
      id: id,
      clientId: clientId,
      adresse: adresse,
      codePostal: '49000',
      ville: 'Angers',
      description: description,
      statut: statut,
      typePrestation: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Map<String, dynamic> _chantierJson({
  String id = 'ch1',
  String clientId = 'c1',
  String statut = 'lead',
  String description = 'Amenagement jardin',
  String adresse = '1 rue du Parc',
}) =>
    {
      'id': id,
      'clientId': clientId,
      'adresse': adresse,
      'codePostal': '49000',
      'ville': 'Angers',
      'typePrestation': <String>[],
      'description': description,
      'statut': statut,
      'createdAt': '2026-01-01T00:00:00.000',
      'updatedAt': '2026-01-01T00:00:00.000',
    };

void main() {
  late AppDatabase db;
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;
  late MockSyncService mockSync;
  late ChantiersRepositoryImpl repo;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();
    mockSync = MockSyncService();
    repo = ChantiersRepositoryImpl(
      chantiersDao: db.chantiersDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
      syncService: mockSync,
    );
  });

  tearDown(() async {
    await db.close();
  });

  setUpAll(() {
    registerFallbackValue(RequestOptions(path: ''));
  });

  group('getAll', () {
    test('online -> appel API + cache Drift', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [
              _chantierJson(),
              _chantierJson(id: 'ch2', description: 'Elagage'),
            ],
            statusCode: 200,
          ));

      final result = await repo.getAll();

      expect(result, hasLength(2));
      expect(result[0].description, 'Amenagement jardin');
      final cached = await db.chantiersDao.getAll();
      expect(cached, hasLength(2));
    });

    test('offline -> retourne cache Drift', () async {
      // Pre-populate cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      final result = await repo.getAll();

      expect(result, hasLength(1));
      expect(result[0].description, 'Amenagement jardin');
      verify(() => mockDio.get('/chantiers')).called(1);
    });

    test('retourne donnees API quand online (pas le cache stale)', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson(description: 'Updated')],
            statusCode: 200,
          ));

      final result = await repo.getAll();
      expect(result[0].description, 'Updated');
    });

    test('erreur API 500 en online -> fallback sur cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      when(() => mockDio.get('/chantiers')).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/chantiers'),
        response: Response(
          requestOptions: RequestOptions(path: '/chantiers'),
          statusCode: 500,
        ),
      ));

      final result = await repo.getAll();
      expect(result, hasLength(1));
      expect(result[0].description, 'Amenagement jardin');
    });
  });

  group('getById', () {
    test('online -> appel API + cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));

      final result = await repo.getById('ch1');

      expect(result.id, 'ch1');
      expect(result.description, 'Amenagement jardin');
      final cached = await db.chantiersDao.getById('ch1');
      expect(cached, isNotNull);
    });

    test('offline -> retourne cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));
      await repo.getById('ch1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      final result = await repo.getById('ch1');
      expect(result.description, 'Amenagement jardin');
    });
  });

  group('create', () {
    test('online -> POST API + insert Drift', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post('/chantiers', data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers'),
                data: _chantierJson(id: 'server-id-1'),
                statusCode: 201,
              ));

      final chantier = _testChantier(id: '');
      final result = await repo.create(chantier);

      expect(result.id, 'server-id-1');
      final cached = await db.chantiersDao.getById('server-id-1');
      expect(cached, isNotNull);
    });

    test('offline -> insert Drift + addToQueue avec id temp-*', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      final chantier = _testChantier(id: '');
      final result = await repo.create(chantier);

      expect(result.id, startsWith('temp-'));
      verify(() => mockSync.addToQueue(
            operation: 'create',
            entity: 'chantier',
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).called(1);
    });
  });

  group('update', () {
    test('online -> PUT API + update Drift', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));
      await repo.getById('ch1');

      when(() => mockDio.put('/chantiers/ch1', data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(description: 'Modifie'),
                statusCode: 200,
              ));

      final updated = _testChantier().copyWith(
          description: 'Modifie', updatedAt: DateTime.now());
      final result = await repo.update(updated);

      expect(result.description, 'Modifie');
    });

    test('offline -> update Drift + addToQueue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));
      await repo.getById('ch1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      final updated = _testChantier();
      final result = await repo.update(updated);

      expect(result.description, 'Amenagement jardin');
      verify(() => mockSync.addToQueue(
            operation: 'update',
            entity: 'chantier',
            data: any(named: 'data'),
            entityId: 'ch1',
          )).called(1);
    });
  });

  group('delete', () {
    test('online -> DELETE API + delete Drift', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));
      await repo.getById('ch1');

      when(() => mockDio.delete('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                statusCode: 200,
              ));

      await repo.delete('ch1');

      final cached = await db.chantiersDao.getById('ch1');
      expect(cached, isNull);
    });

    test('offline -> delete Drift + addToQueue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers/ch1'))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/chantiers/ch1'),
                data: _chantierJson(),
                statusCode: 200,
              ));
      await repo.getById('ch1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      await repo.delete('ch1');

      verify(() => mockSync.addToQueue(
            operation: 'delete',
            entity: 'chantier',
            data: any(named: 'data'),
            entityId: 'ch1',
          )).called(1);
    });
  });

  group('searchByAddress', () {
    test('recherche par adresse/ville dans le cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [
              _chantierJson(
                  id: 'ch1',
                  adresse: '1 rue du Parc',
                  description: 'Jardin'),
              _chantierJson(
                  id: 'ch2',
                  adresse: '5 avenue Pasteur',
                  description: 'Elagage'),
              _chantierJson(
                  id: 'ch3',
                  adresse: '10 rue du Parc',
                  description: 'Tonte'),
            ],
            statusCode: 200,
          ));

      final result = await repo.searchByAddress('parc');

      expect(result, hasLength(2));
    });
  });

  group('getByStatut', () {
    test('filtrage par statut dans le cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [
              _chantierJson(id: 'ch1', statut: 'lead'),
              _chantierJson(id: 'ch2', statut: 'en_cours'),
              _chantierJson(id: 'ch3', statut: 'lead'),
            ],
            statusCode: 200,
          ));
      await repo.getAll();

      final result = await repo.getByStatut(ChantierStatut.lead);

      expect(result, hasLength(2));
      for (final c in result) {
        expect(c.statut, ChantierStatut.lead);
      }
    });
  });

  group('cache', () {
    test('cache mis a jour apres getAll API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);

      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson(description: 'V1')],
            statusCode: 200,
          ));
      await repo.getAll();
      var cached = await db.chantiersDao.getAll();
      expect(cached.first.description, 'V1');

      when(() => mockDio.get('/chantiers')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/chantiers'),
            data: [_chantierJson(description: 'V2')],
            statusCode: 200,
          ));
      await repo.getAll();
      cached = await db.chantiersDao.getAll();
      expect(cached.first.description, 'V2');
    });
  });
}
