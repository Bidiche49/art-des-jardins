import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dio/dio.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/data/local/database/daos/clients_dao.dart';
import 'package:art_et_jardin/data/local/database/daos/chantiers_dao.dart';
import 'package:art_et_jardin/data/local/database/daos/devis_dao.dart';
import 'package:art_et_jardin/data/local/database/daos/factures_dao.dart';
import 'package:art_et_jardin/features/search/data/search_repository_impl.dart';

class MockClientsDao extends Mock implements ClientsDao {}

class MockChantiersDao extends Mock implements ChantiersDao {}

class MockDevisDao extends Mock implements DevisDao {}

class MockFacturesDao extends Mock implements FacturesDao {}

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

void main() {
  late SearchRepositoryImpl repository;
  late MockClientsDao mockClientsDao;
  late MockChantiersDao mockChantiersDao;
  late MockDevisDao mockDevisDao;
  late MockFacturesDao mockFacturesDao;
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;

  setUp(() {
    mockClientsDao = MockClientsDao();
    mockChantiersDao = MockChantiersDao();
    mockDevisDao = MockDevisDao();
    mockFacturesDao = MockFacturesDao();
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();

    repository = SearchRepositoryImpl(
      clientsDao: mockClientsDao,
      chantiersDao: mockChantiersDao,
      devisDao: mockDevisDao,
      facturesDao: mockFacturesDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
    );
  });

  ClientsTableData makeClient({
    required String id,
    required String nom,
    String? prenom,
    String email = 'test@test.com',
  }) {
    return ClientsTableData(
      id: id,
      type: 'particulier',
      nom: nom,
      prenom: prenom,
      raisonSociale: null,
      email: email,
      telephone: '0600000000',
      telephoneSecondaire: null,
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: 'Angers',
      notes: null,
      tags: '[]',
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
      syncedAt: null,
    );
  }

  ChantiersTableData makeChantier({
    required String id,
    required String adresse,
    String ville = 'Angers',
    String description = '',
  }) {
    return ChantiersTableData(
      id: id,
      clientId: 'client-1',
      adresse: adresse,
      codePostal: '49000',
      ville: ville,
      typePrestation: 'entretien',
      description: description,
      statut: 'en_cours',
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );
  }

  DevisTableData makeDevis({
    required String id,
    required String numero,
    String? notes,
  }) {
    return DevisTableData(
      id: id,
      chantierId: 'chantier-1',
      numero: numero,
      dateEmission: DateTime(2026, 1, 1),
      dateValidite: DateTime(2026, 2, 1),
      statut: 'brouillon',
      totalHT: 1000.0,
      totalTVA: 200.0,
      totalTTC: 1200.0,
      notes: notes,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );
  }

  FacturesTableData makeFacture({
    required String id,
    required String numero,
    String? notes,
  }) {
    return FacturesTableData(
      id: id,
      devisId: 'devis-1',
      numero: numero,
      dateEmission: DateTime(2026, 1, 1),
      dateEcheance: DateTime(2026, 2, 1),
      datePaiement: null,
      totalHT: 1000.0,
      totalTVA: 200.0,
      totalTTC: 1200.0,
      statut: 'envoyee',
      modePaiement: null,
      pdfUrl: null,
      notes: notes,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
      syncedAt: null,
    );
  }

  group('SearchRepository - offline cache search', () {
    setUp(() {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
    });

    test('search "Dupont" returns matching clients', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => [
            makeClient(id: 'c1', nom: 'Dupont', prenom: 'Jean'),
            makeClient(id: 'c2', nom: 'Martin', prenom: 'Marie'),
          ]);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('Dupont');

      expect(results.length, 1);
      expect(results.first.entity, 'client');
      expect(results.first.title, 'Jean Dupont');
    });

    test('results are grouped by type', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => [
            makeClient(id: 'c1', nom: 'Test', email: 'test@test.com'),
          ]);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => [
            makeChantier(id: 'ch1', adresse: '10 rue Test'),
          ]);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('test');

      final entities = results.map((r) => r.entity).toSet();
      expect(entities, containsAll(['client', 'chantier']));
    });

    test('empty query returns empty results', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => []);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('xyz');
      expect(results, isEmpty);
    });

    test('each result has required fields', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => [
            makeClient(id: 'c1', nom: 'Dupont', prenom: 'Jean',
                email: 'dupont@mail.com'),
          ]);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('Dupont');

      expect(results.first.entity, isNotEmpty);
      expect(results.first.entityId, 'c1');
      expect(results.first.title, isNotEmpty);
      expect(results.first.subtitle, 'dupont@mail.com');
    });

    test('searches devis by numero', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => []);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => [
            makeDevis(id: 'd1', numero: 'DEV-2026-001'),
          ]);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('DEV-2026');
      expect(results.length, 1);
      expect(results.first.entity, 'devis');
    });

    test('searches factures by numero', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => []);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => [
            makeFacture(id: 'f1', numero: 'FAC-2026-001'),
          ]);

      final results = await repository.search('FAC-2026');
      expect(results.length, 1);
      expect(results.first.entity, 'facture');
    });

    test('searchByEntity filters to specific entity', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => [
            makeClient(id: 'c1', nom: 'Test'),
          ]);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => [
            makeChantier(id: 'ch1', adresse: '10 rue Test'),
          ]);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.searchByEntity('test', 'client');
      expect(results.length, 1);
      expect(results.first.entity, 'client');
    });

    test('search matches chantier description', () async {
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => []);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => [
            makeChantier(
                id: 'ch1',
                adresse: '1 rue Main',
                description: 'Taille haie jardin'),
          ]);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('haie');
      expect(results.length, 1);
      expect(results.first.entity, 'chantier');
    });
  });

  group('SearchRepository - online', () {
    test('calls API when online', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any(), queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => Response(
                data: {'data': []},
                statusCode: 200,
                requestOptions: RequestOptions(path: '/search'),
              ));

      final results = await repository.search('test');
      expect(results, isEmpty);
      verify(() => mockDio.get('/search',
          queryParameters: {'q': 'test'})).called(1);
    });

    test('falls back to cache on API error', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any(), queryParameters: any(named: 'queryParameters')))
          .thenThrow(DioException(
              requestOptions: RequestOptions(path: '/search')));
      when(() => mockClientsDao.getAll()).thenAnswer((_) async => []);
      when(() => mockChantiersDao.getAll()).thenAnswer((_) async => []);
      when(() => mockDevisDao.getAll()).thenAnswer((_) async => []);
      when(() => mockFacturesDao.getAll()).thenAnswer((_) async => []);

      final results = await repository.search('test');
      expect(results, isEmpty);
    });
  });
}
