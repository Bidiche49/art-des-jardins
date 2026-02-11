import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/daos/factures_dao.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/domain/enums/facture_statut.dart';
import 'package:art_et_jardin/domain/models/facture.dart';
import 'package:art_et_jardin/features/factures/data/factures_repository_impl.dart';

class MockFacturesDao extends Mock implements FacturesDao {}

class MockDio extends Mock implements Dio {
  @override
  BaseOptions get options => BaseOptions(baseUrl: 'http://localhost:3000/api');
}

class MockConnectivity extends Mock implements ConnectivityService {}

Facture _testFacture({
  String id = 'fac-1',
  FactureStatut statut = FactureStatut.envoyee,
  DateTime? dateEcheance,
}) =>
    Facture(
      id: id,
      devisId: 'devis-1',
      numero: 'FAC-2026-001',
      dateEmission: DateTime(2026, 1, 1),
      dateEcheance: dateEcheance ?? DateTime(2026, 2, 1),
      totalHT: 1000,
      totalTVA: 200,
      totalTTC: 1200,
      statut: statut,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

FacturesTableData _testRow({
  String id = 'fac-1',
  String statut = 'envoyee',
  DateTime? dateEcheance,
}) =>
    FacturesTableData(
      id: id,
      devisId: 'devis-1',
      numero: 'FAC-2026-001',
      dateEmission: DateTime(2026, 1, 1),
      dateEcheance: dateEcheance ?? DateTime(2026, 2, 1),
      totalHT: 1000,
      totalTVA: 200,
      totalTTC: 1200,
      statut: statut,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockFacturesDao mockDao;
  late MockDio mockDio;
  late MockConnectivity mockConnectivity;
  late FacturesRepositoryImpl repo;

  setUp(() {
    mockDao = MockFacturesDao();
    mockDio = MockDio();
    mockConnectivity = MockConnectivity();

    repo = FacturesRepositoryImpl(
      facturesDao: mockDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
    );

    registerFallbackValue(const FacturesTableCompanion());

    // Default stubs
    when(() => mockDao.getById(any())).thenAnswer((_) async => null);
    when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);
    when(() => mockDao.updateOne(any())).thenAnswer((_) async => true);
  });

  group('getAll', () {
    test('online fetches from API and caches', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [_testFacture().toJson()],
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getAll();
      expect(result.length, 1);
      expect(result[0].numero, 'FAC-2026-001');
      verify(() => mockDao.insertOne(any())).called(1);
    });

    test('offline returns cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [_testRow()]);

      final result = await repo.getAll();
      expect(result.length, 1);
      expect(result[0].numero, 'FAC-2026-001');
    });

    test('API error falls back to cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any()))
          .thenThrow(DioException(requestOptions: RequestOptions()));
      when(() => mockDao.getAll()).thenAnswer((_) async => [_testRow()]);

      final result = await repo.getAll();
      expect(result.length, 1);
    });
  });

  group('getById', () {
    test('online fetches from API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: _testFacture().toJson(),
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await repo.getById('fac-1');
      expect(result.id, 'fac-1');
    });

    test('offline returns cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getById('fac-1'))
          .thenAnswer((_) async => _testRow());

      final result = await repo.getById('fac-1');
      expect(result.id, 'fac-1');
    });
  });

  group('getByStatut', () {
    test('online filters by statut via API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any(), queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => Response(
                data: [_testFacture(statut: FactureStatut.payee).toJson()],
                statusCode: 200,
                requestOptions: RequestOptions(),
              ));

      final result = await repo.getByStatut(FactureStatut.payee);
      expect(result.length, 1);
      expect(result[0].statut, FactureStatut.payee);
    });

    test('offline filters by statut from cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [
            _testRow(id: 'fac-1', statut: 'envoyee'),
            _testRow(id: 'fac-2', statut: 'payee'),
          ]);

      final result = await repo.getByStatut(FactureStatut.payee);
      expect(result.length, 1);
      expect(result[0].id, 'fac-2');
    });
  });

  group('getEnRetard', () {
    test('online fetches en retard from API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any(), queryParameters: any(named: 'queryParameters')))
          .thenAnswer((_) async => Response(
                data: [_testFacture(dateEcheance: DateTime(2025, 1, 1)).toJson()],
                statusCode: 200,
                requestOptions: RequestOptions(),
              ));

      final result = await repo.getEnRetard();
      expect(result.length, 1);
    });

    test('offline returns en retard from cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getEnRetard()).thenAnswer((_) async => [
            _testRow(dateEcheance: DateTime(2025, 1, 1)),
          ]);

      final result = await repo.getEnRetard();
      expect(result.length, 1);
    });
  });

  group('getPdfUrl', () {
    test('returns correct URL', () async {
      final url = await repo.getPdfUrl('fac-1');
      expect(url, contains('/factures/fac-1/pdf'));
    });
  });
}
