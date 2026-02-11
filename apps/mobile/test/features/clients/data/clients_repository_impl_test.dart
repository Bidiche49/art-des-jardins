import 'package:dio/dio.dart';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:art_et_jardin/features/clients/data/clients_repository_impl.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockSyncService extends Mock implements SyncService {}

Client _testClient({
  String id = 'c1',
  ClientType type = ClientType.particulier,
  String nom = 'Dupont',
  String email = 'dupont@test.fr',
}) =>
    Client(
      id: id,
      type: type,
      nom: nom,
      email: email,
      telephone: '0612345678',
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: 'Angers',
      tags: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Map<String, dynamic> _clientJson({
  String id = 'c1',
  String type = 'particulier',
  String nom = 'Dupont',
  String email = 'dupont@test.fr',
}) =>
    {
      'id': id,
      'type': type,
      'nom': nom,
      'email': email,
      'telephone': '0612345678',
      'adresse': '1 rue Test',
      'codePostal': '49000',
      'ville': 'Angers',
      'tags': <String>[],
      'createdAt': '2026-01-01T00:00:00.000',
      'updatedAt': '2026-01-01T00:00:00.000',
    };

void main() {
  late AppDatabase db;
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;
  late MockSyncService mockSync;
  late ClientsRepositoryImpl repo;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();
    mockSync = MockSyncService();
    repo = ClientsRepositoryImpl(
      clientsDao: db.clientsDao,
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
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson(), _clientJson(id: 'c2', nom: 'Martin')],
            statusCode: 200,
          ));

      final result = await repo.getAll();

      expect(result, hasLength(2));
      expect(result[0].nom, 'Dupont');
      // Verify cached
      final cached = await db.clientsDao.getAll();
      expect(cached, hasLength(2));
    });

    test('offline -> retourne cache Drift', () async {
      // Pre-populate cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      // Now go offline
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      final result = await repo.getAll();

      expect(result, hasLength(1));
      expect(result[0].nom, 'Dupont');
      verify(() => mockDio.get('/clients')).called(1); // Only 1 call (not 2)
    });

    test('retourne donnees API quand online (pas le cache stale)', () async {
      // First call caches "Dupont"
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      // Second call gets updated data from API
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson(nom: 'Updated')],
            statusCode: 200,
          ));

      final result = await repo.getAll();
      expect(result[0].nom, 'Updated');
    });

    test('erreur API 500 en online -> fallback sur cache', () async {
      // Pre-populate cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson()],
            statusCode: 200,
          ));
      await repo.getAll();

      // API now fails
      when(() => mockDio.get('/clients')).thenThrow(DioException(
        requestOptions: RequestOptions(path: '/clients'),
        response: Response(
          requestOptions: RequestOptions(path: '/clients'),
          statusCode: 500,
        ),
      ));

      final result = await repo.getAll();
      expect(result, hasLength(1));
      expect(result[0].nom, 'Dupont');
    });
  });

  group('getById', () {
    test('online -> appel API + cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));

      final result = await repo.getById('c1');

      expect(result.id, 'c1');
      expect(result.nom, 'Dupont');
      final cached = await db.clientsDao.getById('c1');
      expect(cached, isNotNull);
    });

    test('offline -> retourne cache', () async {
      // Pre-cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));
      await repo.getById('c1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);

      final result = await repo.getById('c1');
      expect(result.nom, 'Dupont');
    });
  });

  group('create', () {
    test('online -> POST API + insert Drift', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post('/clients', data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/clients'),
                data: _clientJson(id: 'server-id-1'),
                statusCode: 201,
              ));

      final client = _testClient(id: '');
      final result = await repo.create(client);

      expect(result.id, 'server-id-1');
      final cached = await db.clientsDao.getById('server-id-1');
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

      final client = _testClient(id: '');
      final result = await repo.create(client);

      expect(result.id, startsWith('temp-'));
      verify(() => mockSync.addToQueue(
            operation: 'create',
            entity: 'client',
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).called(1);
    });
  });

  group('update', () {
    test('online -> PUT API + update Drift', () async {
      // Pre-cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));
      await repo.getById('c1');

      when(() => mockDio.put('/clients/c1', data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: '/clients/c1'),
                data: _clientJson(nom: 'DupontModifie'),
                statusCode: 200,
              ));

      final updated =
          _testClient().copyWith(nom: 'DupontModifie', updatedAt: DateTime.now());
      final result = await repo.update(updated);

      expect(result.nom, 'DupontModifie');
    });

    test('offline -> update Drift + addToQueue', () async {
      // Pre-cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));
      await repo.getById('c1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      final updated = _testClient();
      final result = await repo.update(updated);

      expect(result.nom, 'Dupont');
      verify(() => mockSync.addToQueue(
            operation: 'update',
            entity: 'client',
            data: any(named: 'data'),
            entityId: 'c1',
          )).called(1);
    });
  });

  group('delete', () {
    test('online -> DELETE API + delete Drift', () async {
      // Pre-cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));
      await repo.getById('c1');

      when(() => mockDio.delete('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            statusCode: 200,
          ));

      await repo.delete('c1');

      final cached = await db.clientsDao.getById('c1');
      expect(cached, isNull);
    });

    test('offline -> delete Drift + addToQueue', () async {
      // Pre-cache
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients/c1')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients/c1'),
            data: _clientJson(),
            statusCode: 200,
          ));
      await repo.getById('c1');

      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      await repo.delete('c1');

      verify(() => mockSync.addToQueue(
            operation: 'delete',
            entity: 'client',
            data: any(named: 'data'),
            entityId: 'c1',
          )).called(1);
    });
  });

  group('searchByName', () {
    test('recherche par nom dans le cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [
              _clientJson(id: 'c1', nom: 'Dupont', email: 'dupont@test.fr'),
              _clientJson(id: 'c2', nom: 'Martin', email: 'martin@test.fr'),
              _clientJson(id: 'c3', nom: 'Durand', email: 'durand@test.fr'),
            ],
            statusCode: 200,
          ));

      final result = await repo.searchByName('du');

      expect(result, hasLength(2));
      expect(result.map((c) => c.nom), containsAll(['Dupont', 'Durand']));
    });
  });

  group('getByType', () {
    test('filtrage par type dans le cache', () async {
      // Cache clients with different types
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [
              _clientJson(id: 'c1', type: 'particulier'),
              _clientJson(id: 'c2', type: 'professionnel', nom: 'Entreprise SA'),
              _clientJson(id: 'c3', type: 'particulier', nom: 'Martin'),
            ],
            statusCode: 200,
          ));
      await repo.getAll();

      final result = await repo.getByType(ClientType.particulier);

      expect(result, hasLength(2));
      for (final c in result) {
        expect(c.type, ClientType.particulier);
      }
    });
  });

  group('cache', () {
    test('cache mis a jour apres getAll API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);

      // First call
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson(nom: 'V1')],
            statusCode: 200,
          ));
      await repo.getAll();
      var cached = await db.clientsDao.getAll();
      expect(cached.first.nom, 'V1');

      // Second call with updated data
      when(() => mockDio.get('/clients')).thenAnswer((_) async => Response(
            requestOptions: RequestOptions(path: '/clients'),
            data: [_clientJson(nom: 'V2')],
            statusCode: 200,
          ));
      await repo.getAll();
      cached = await db.clientsDao.getAll();
      expect(cached.first.nom, 'V2');
    });
  });
}
