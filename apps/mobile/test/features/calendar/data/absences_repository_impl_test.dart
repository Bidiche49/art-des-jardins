import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/data/local/database/daos/absences_dao.dart';
import 'package:art_et_jardin/domain/enums/absence_type.dart';
import 'package:art_et_jardin/domain/models/absence.dart';
import 'package:art_et_jardin/features/calendar/data/absences_repository_impl.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockAbsencesDao extends Mock implements AbsencesDao {}

class MockDio extends Mock implements Dio {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockSyncService extends Mock implements SyncService {}

Absence _testAbsence({
  String id = 'abs1',
  String userId = 'user1',
  AbsenceType type = AbsenceType.conge,
  bool validee = false,
  DateTime? dateDebut,
  DateTime? dateFin,
}) =>
    Absence(
      id: id,
      userId: userId,
      dateDebut: dateDebut ?? DateTime(2026, 3, 10),
      dateFin: dateFin ?? DateTime(2026, 3, 14),
      type: type,
      motif: 'Vacances',
      validee: validee,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

AbsencesTableData _testData({
  String id = 'abs1',
  String userId = 'user1',
  String type = 'conge',
  bool validee = false,
}) =>
    AbsencesTableData(
      id: id,
      userId: userId,
      dateDebut: DateTime(2026, 3, 10),
      dateFin: DateTime(2026, 3, 14),
      type: type,
      motif: 'Vacances',
      validee: validee,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
      syncedAt: null,
    );

void main() {
  late MockAbsencesDao mockDao;
  late MockDio mockDio;
  late MockConnectivityService mockConnectivity;
  late MockSyncService mockSync;
  late AbsencesRepositoryImpl repo;

  setUp(() {
    mockDao = MockAbsencesDao();
    mockDio = MockDio();
    mockConnectivity = MockConnectivityService();
    mockSync = MockSyncService();
    repo = AbsencesRepositoryImpl(
      absencesDao: mockDao,
      authDio: mockDio,
      connectivityService: mockConnectivity,
      syncService: mockSync,
    );

    registerFallbackValue(const AbsencesTableCompanion());
    registerFallbackValue(<String, dynamic>{});
  });

  group('getMyAbsences', () {
    test('filtre par userId courant', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [
            _testData(id: 'abs1', userId: 'user1'),
            _testData(id: 'abs2', userId: 'user2'),
          ]);

      final result = await repo.getMyAbsences('user1');

      expect(result.length, 1);
      expect(result.first.userId, 'user1');
    });
  });

  group('getPendingAbsences', () {
    test('filtre validee=false', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [
            _testData(id: 'abs1', validee: false),
            _testData(id: 'abs2', validee: true),
          ]);

      final result = await repo.getPendingAbsences();

      expect(result.length, 1);
      expect(result.first.validee, false);
    });
  });

  group('getAll', () {
    test('retourne toutes les absences', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getAll()).thenAnswer((_) async => [
            _testData(id: 'abs1'),
            _testData(id: 'abs2', userId: 'user2'),
          ]);

      final result = await repo.getAll();

      expect(result.length, 2);
    });

    test('online -> fetch API + cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: [
              _testAbsence().toJson(),
            ],
            statusCode: 200,
            requestOptions: RequestOptions(path: '/calendar/absences'),
          ));
      when(() => mockDao.getById(any())).thenAnswer((_) async => null);
      when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);

      final result = await repo.getAll();

      expect(result.length, 1);
      verify(() => mockDao.insertOne(any())).called(1);
    });

    test('online erreur -> fallback cache', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.get(any())).thenThrow(Exception('Network error'));
      when(() => mockDao.getAll()).thenAnswer((_) async => [_testData()]);

      final result = await repo.getAll();

      expect(result.length, 1);
    });
  });

  group('create', () {
    test('online -> POST API + cache', () async {
      final absence = _testAbsence();
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: absence.toJson(),
                statusCode: 201,
                requestOptions: RequestOptions(path: '/calendar/absences'),
              ));
      when(() => mockDao.getById(any())).thenAnswer((_) async => null);
      when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);

      final result = await repo.create(absence);

      expect(result.id, 'abs1');
    });

    test('offline -> cache local + sync queue', () async {
      final absence = _testAbsence();
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      final result = await repo.create(absence);

      expect(result.id, 'abs1');
      verify(() => mockSync.addToQueue(
            operation: 'create',
            entity: 'absence',
            data: any(named: 'data'),
            entityId: 'abs1',
          )).called(1);
    });
  });

  group('validate', () {
    test('online -> PATCH API', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => true);
      when(() => mockDio.patch(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: _testAbsence(validee: true).toJson(),
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));
      when(() => mockDao.getById(any())).thenAnswer((_) async => null);
      when(() => mockDao.insertOne(any())).thenAnswer((_) async => 1);

      final result = await repo.validate('abs1');

      expect(result.validee, true);
    });

    test('offline -> update cache + sync queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.getById('abs1'))
          .thenAnswer((_) async => _testData(validee: false));
      when(() => mockDao.updateOne(any())).thenAnswer((_) async => true);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      final result = await repo.validate('abs1');

      expect(result.validee, true);
    });
  });

  group('validation rules', () {
    test('date fin >= date debut toujours respecte dans le modele', () {
      final absence = _testAbsence(
        dateDebut: DateTime(2026, 3, 10),
        dateFin: DateTime(2026, 3, 14),
      );
      expect(absence.dateFin.isAfter(absence.dateDebut), true);
    });

    test('type est obligatoire dans le modele', () {
      final absence = _testAbsence(type: AbsenceType.maladie);
      expect(absence.type, AbsenceType.maladie);
    });

    test('calcul nombre jours absence', () {
      final absence = _testAbsence(
        dateDebut: DateTime(2026, 3, 10),
        dateFin: DateTime(2026, 3, 14),
      );
      final days = absence.dateFin.difference(absence.dateDebut).inDays + 1;
      expect(days, 5);
    });
  });

  group('delete', () {
    test('offline -> supprime cache + sync queue', () async {
      when(() => mockConnectivity.isOnline).thenAnswer((_) async => false);
      when(() => mockDao.deleteById(any())).thenAnswer((_) async => 1);
      when(() => mockSync.addToQueue(
            operation: any(named: 'operation'),
            entity: any(named: 'entity'),
            data: any(named: 'data'),
            entityId: any(named: 'entityId'),
          )).thenAnswer((_) async {});

      await repo.delete('abs1');

      verify(() => mockDao.deleteById('abs1')).called(1);
      verify(() => mockSync.addToQueue(
            operation: 'delete',
            entity: 'absence',
            data: any(named: 'data'),
            entityId: 'abs1',
          )).called(1);
    });
  });
}
