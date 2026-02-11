import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:drift/drift.dart' hide isNull, isNotNull;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';

AppDatabase _createTestDb() =>
    AppDatabase(NativeDatabase.memory(logStatements: false));

void main() {
  late AppDatabase db;

  setUp(() {
    db = _createTestDb();
  });

  tearDown(() async {
    await db.close();
  });

  // ===== Helper functions =====
  ClientsTableCompanion makeClient({
    String id = 'c1',
    String type = 'particulier',
    String nom = 'Martin',
  }) =>
      ClientsTableCompanion.insert(
        id: id,
        type: type,
        nom: nom,
        email: 'test@test.fr',
        telephone: '0601020304',
        adresse: '12 rue Test',
        codePostal: '49000',
        ville: 'Angers',
        createdAt: DateTime(2026, 1, 15),
        updatedAt: DateTime(2026, 1, 15),
      );

  ChantiersTableCompanion makeChantier({
    String id = 'ch1',
    String clientId = 'c1',
    String statut = 'en_cours',
  }) =>
      ChantiersTableCompanion.insert(
        id: id,
        clientId: clientId,
        adresse: '5 avenue Gare',
        codePostal: '49000',
        ville: 'Angers',
        description: 'Test chantier',
        statut: Value(statut),
        createdAt: DateTime(2026, 1, 15),
        updatedAt: DateTime(2026, 1, 15),
      );

  InterventionsTableCompanion makeIntervention({
    String id = 'i1',
    String chantierId = 'ch1',
    DateTime? date,
  }) =>
      InterventionsTableCompanion.insert(
        id: id,
        chantierId: chantierId,
        employeId: 'u1',
        date: date ?? DateTime(2026, 1, 20),
        heureDebut: DateTime(2026, 1, 20, 8),
        createdAt: DateTime(2026, 1, 15),
        updatedAt: DateTime(2026, 1, 15),
      );

  DevisTableCompanion makeDevis({
    String id = 'd1',
    String chantierId = 'ch1',
    String statut = 'brouillon',
  }) =>
      DevisTableCompanion.insert(
        id: id,
        chantierId: chantierId,
        numero: 'DEV-2026-001',
        dateEmission: DateTime(2026, 1, 15),
        dateValidite: DateTime(2026, 2, 15),
        totalHT: 5000,
        totalTVA: 1000,
        totalTTC: 6000,
        statut: Value(statut),
        createdAt: DateTime(2026, 1, 15),
        updatedAt: DateTime(2026, 1, 15),
      );

  FacturesTableCompanion makeFacture({
    String id = 'f1',
    String devisId = 'd1',
    String statut = 'brouillon',
    DateTime? dateEcheance,
  }) =>
      FacturesTableCompanion.insert(
        id: id,
        devisId: devisId,
        numero: 'FAC-2026-001',
        dateEmission: DateTime(2026, 1, 15),
        dateEcheance: dateEcheance ?? DateTime(2026, 2, 15),
        totalHT: 5000,
        totalTVA: 1000,
        totalTTC: 6000,
        statut: Value(statut),
        createdAt: DateTime(2026, 1, 15),
        updatedAt: DateTime(2026, 1, 15),
      );

  SyncQueueTableCompanion makeSyncItem({
    String operation = 'create',
    String entity = 'client',
    String status = 'pending',
    int timestamp = 1000,
  }) =>
      SyncQueueTableCompanion.insert(
        operation: operation,
        entity: entity,
        data: '{"nom":"Test"}',
        timestamp: timestamp,
        status: Value(status),
      );

  SyncMetaTableCompanion makeSyncMeta({String entity = 'client'}) =>
      SyncMetaTableCompanion.insert(entity: entity);

  PhotoQueueTableCompanion makePhoto({
    String interventionId = 'i1',
    String status = 'pending',
  }) =>
      PhotoQueueTableCompanion.insert(
        interventionId: interventionId,
        type: 'BEFORE',
        filePath: '/tmp/photo.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048,
        takenAt: DateTime(2026, 1, 20, 8, 5),
        status: Value(status),
      );

  // ===== CRUD Tests: Clients =====
  group('ClientsDao CRUD', () {
    test('insert -> read returns inserted entity', () async {
      await db.clientsDao.insertOne(makeClient());
      final result = await db.clientsDao.getById('c1');
      expect(result, isNotNull);
      expect(result!.nom, 'Martin');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.clientsDao.insertOne(makeClient(id: 'c1'));
      await db.clientsDao.insertOne(makeClient(id: 'c2', nom: 'Dupont'));
      final all = await db.clientsDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.clientsDao.insertOne(makeClient());
      final row = await db.clientsDao.getById('c1');
      await db.clientsDao.updateOne(ClientsTableCompanion(
        id: Value(row!.id),
        type: Value(row.type),
        nom: const Value('Nouveau'),
        email: Value(row.email),
        telephone: Value(row.telephone),
        adresse: Value(row.adresse),
        codePostal: Value(row.codePostal),
        ville: Value(row.ville),
        tags: Value(row.tags),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));
      final updated = await db.clientsDao.getById('c1');
      expect(updated!.nom, 'Nouveau');
    });

    test('delete -> read returns null', () async {
      await db.clientsDao.insertOne(makeClient());
      await db.clientsDao.deleteById('c1');
      final result = await db.clientsDao.getById('c1');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.clientsDao.insertOne(makeClient());
      expect(
        () => db.clientsDao.insertOne(makeClient()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: Chantiers =====
  group('ChantiersDao CRUD', () {
    test('insert -> read returns entity', () async {
      await db.chantiersDao.insertOne(makeChantier());
      final result = await db.chantiersDao.getById('ch1');
      expect(result, isNotNull);
      expect(result!.clientId, 'c1');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.chantiersDao.insertOne(makeChantier(id: 'ch1'));
      await db.chantiersDao.insertOne(makeChantier(id: 'ch2'));
      final all = await db.chantiersDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.chantiersDao.insertOne(makeChantier());
      final row = await db.chantiersDao.getById('ch1');
      await db.chantiersDao.updateOne(ChantiersTableCompanion(
        id: Value(row!.id),
        clientId: Value(row.clientId),
        adresse: const Value('Nouvelle adresse'),
        codePostal: Value(row.codePostal),
        ville: Value(row.ville),
        typePrestation: Value(row.typePrestation),
        description: Value(row.description),
        statut: Value(row.statut),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));
      final updated = await db.chantiersDao.getById('ch1');
      expect(updated!.adresse, 'Nouvelle adresse');
    });

    test('delete -> read returns null', () async {
      await db.chantiersDao.insertOne(makeChantier());
      await db.chantiersDao.deleteById('ch1');
      final result = await db.chantiersDao.getById('ch1');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.chantiersDao.insertOne(makeChantier());
      expect(
        () => db.chantiersDao.insertOne(makeChantier()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: Interventions =====
  group('InterventionsDao CRUD', () {
    test('insert -> read returns entity', () async {
      await db.interventionsDao.insertOne(makeIntervention());
      final result = await db.interventionsDao.getById('i1');
      expect(result, isNotNull);
      expect(result!.chantierId, 'ch1');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.interventionsDao.insertOne(makeIntervention(id: 'i1'));
      await db.interventionsDao.insertOne(makeIntervention(id: 'i2'));
      final all = await db.interventionsDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.interventionsDao.insertOne(makeIntervention());
      final row = await db.interventionsDao.getById('i1');
      await db.interventionsDao.updateOne(InterventionsTableCompanion(
        id: Value(row!.id),
        chantierId: Value(row.chantierId),
        employeId: Value(row.employeId),
        date: Value(row.date),
        heureDebut: Value(row.heureDebut),
        description: const Value('Mise a jour'),
        valide: Value(row.valide),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));
      final updated = await db.interventionsDao.getById('i1');
      expect(updated!.description, 'Mise a jour');
    });

    test('delete -> read returns null', () async {
      await db.interventionsDao.insertOne(makeIntervention());
      await db.interventionsDao.deleteById('i1');
      final result = await db.interventionsDao.getById('i1');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.interventionsDao.insertOne(makeIntervention());
      expect(
        () => db.interventionsDao.insertOne(makeIntervention()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: Devis =====
  group('DevisDao CRUD', () {
    test('insert -> read returns entity', () async {
      await db.devisDao.insertOne(makeDevis());
      final result = await db.devisDao.getById('d1');
      expect(result, isNotNull);
      expect(result!.numero, 'DEV-2026-001');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.devisDao.insertOne(makeDevis(id: 'd1'));
      await db.devisDao.insertOne(
          makeDevis(id: 'd2').copyWith(numero: const Value('DEV-2026-002')));
      final all = await db.devisDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.devisDao.insertOne(makeDevis());
      final row = await db.devisDao.getById('d1');
      await db.devisDao.updateOne(DevisTableCompanion(
        id: Value(row!.id),
        chantierId: Value(row.chantierId),
        numero: Value(row.numero),
        dateEmission: Value(row.dateEmission),
        dateValidite: Value(row.dateValidite),
        totalHT: const Value(7000),
        totalTVA: Value(row.totalTVA),
        totalTTC: Value(row.totalTTC),
        statut: Value(row.statut),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));
      final updated = await db.devisDao.getById('d1');
      expect(updated!.totalHT, 7000);
    });

    test('delete -> read returns null', () async {
      await db.devisDao.insertOne(makeDevis());
      await db.devisDao.deleteById('d1');
      final result = await db.devisDao.getById('d1');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.devisDao.insertOne(makeDevis());
      expect(
        () => db.devisDao.insertOne(makeDevis()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: Factures =====
  group('FacturesDao CRUD', () {
    test('insert -> read returns entity', () async {
      await db.facturesDao.insertOne(makeFacture());
      final result = await db.facturesDao.getById('f1');
      expect(result, isNotNull);
      expect(result!.numero, 'FAC-2026-001');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.facturesDao.insertOne(makeFacture(id: 'f1'));
      await db.facturesDao.insertOne(makeFacture(id: 'f2')
          .copyWith(numero: const Value('FAC-2026-002')));
      final all = await db.facturesDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.facturesDao.insertOne(makeFacture());
      final row = await db.facturesDao.getById('f1');
      await db.facturesDao.updateOne(FacturesTableCompanion(
        id: Value(row!.id),
        devisId: Value(row.devisId),
        numero: Value(row.numero),
        dateEmission: Value(row.dateEmission),
        dateEcheance: Value(row.dateEcheance),
        totalHT: Value(row.totalHT),
        totalTVA: Value(row.totalTVA),
        totalTTC: Value(row.totalTTC),
        statut: const Value('payee'),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));
      final updated = await db.facturesDao.getById('f1');
      expect(updated!.statut, 'payee');
    });

    test('delete -> read returns null', () async {
      await db.facturesDao.insertOne(makeFacture());
      await db.facturesDao.deleteById('f1');
      final result = await db.facturesDao.getById('f1');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.facturesDao.insertOne(makeFacture());
      expect(
        () => db.facturesDao.insertOne(makeFacture()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: SyncQueue =====
  group('SyncQueueDao CRUD', () {
    test('insert -> getAll returns entity', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      expect(all, hasLength(1));
      expect(all.first.entity, 'client');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.syncQueueDao.insertOne(makeSyncItem(timestamp: 1));
      await db.syncQueueDao.insertOne(makeSyncItem(entity: 'chantier', timestamp: 2));
      final all = await db.syncQueueDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> returns updated values', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      final item = all.first;
      await db.syncQueueDao.updateOne(item.copyWith(status: 'syncing'));
      final updated = await db.syncQueueDao.getAll();
      expect(updated.first.status, 'syncing');
    });

    test('delete -> removed from list', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      await db.syncQueueDao.deleteById(all.first.id);
      final after = await db.syncQueueDao.getAll();
      expect(after, isEmpty);
    });

    test('auto-increment PK works', () async {
      await db.syncQueueDao.insertOne(makeSyncItem(timestamp: 1));
      await db.syncQueueDao.insertOne(makeSyncItem(timestamp: 2));
      final all = await db.syncQueueDao.getAll();
      expect(all[0].id, isNot(all[1].id));
    });
  });

  // ===== CRUD Tests: SyncMeta =====
  group('SyncMetaDao CRUD', () {
    test('insert -> read returns entity', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta());
      final result = await db.syncMetaDao.getByEntity('client');
      expect(result, isNotNull);
      expect(result!.entity, 'client');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta(entity: 'client'));
      await db.syncMetaDao.insertOne(makeSyncMeta(entity: 'chantier'));
      final all = await db.syncMetaDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> read returns updated values', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta());
      final row = await db.syncMetaDao.getByEntity('client');
      await db.syncMetaDao.updateOne(SyncMetaTableCompanion(
        entity: Value(row!.entity),
        lastSyncAt: Value(DateTime(2026, 1, 20)),
        totalSynced: const Value(42),
      ));
      final updated = await db.syncMetaDao.getByEntity('client');
      expect(updated!.totalSynced, 42);
    });

    test('delete -> read returns null', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta());
      await db.syncMetaDao.deleteByEntity('client');
      final result = await db.syncMetaDao.getByEntity('client');
      expect(result, isNull);
    });

    test('insert duplicate PK -> throws', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta());
      expect(
        () => db.syncMetaDao.insertOne(makeSyncMeta()),
        throwsA(isA<SqliteException>()),
      );
    });
  });

  // ===== CRUD Tests: PhotoQueue =====
  group('PhotoQueueDao CRUD', () {
    test('insert -> getAll returns entity', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      final all = await db.photoQueueDao.getAll();
      expect(all, hasLength(1));
      expect(all.first.interventionId, 'i1');
    });

    test('insert multiple -> getAll returns all', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      await db.photoQueueDao.insertOne(makePhoto(interventionId: 'i2'));
      final all = await db.photoQueueDao.getAll();
      expect(all, hasLength(2));
    });

    test('update -> returns updated values', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      final all = await db.photoQueueDao.getAll();
      await db.photoQueueDao.updateOne(all.first.copyWith(status: 'uploading'));
      final updated = await db.photoQueueDao.getAll();
      expect(updated.first.status, 'uploading');
    });

    test('delete -> removed from list', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      final all = await db.photoQueueDao.getAll();
      await db.photoQueueDao.deleteById(all.first.id);
      final after = await db.photoQueueDao.getAll();
      expect(after, isEmpty);
    });

    test('auto-increment PK works', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      await db.photoQueueDao.insertOne(makePhoto(interventionId: 'i2'));
      final all = await db.photoQueueDao.getAll();
      expect(all[0].id, isNot(all[1].id));
    });
  });

  // ===== Specific Queries =====
  group('Specific queries', () {
    test('getClientsByType filters correctly', () async {
      await db.clientsDao.insertOne(makeClient(id: 'c1', type: 'particulier'));
      await db.clientsDao.insertOne(makeClient(id: 'c2', type: 'professionnel'));
      await db.clientsDao.insertOne(makeClient(id: 'c3', type: 'particulier'));
      final result = await db.clientsDao.getByType('particulier');
      expect(result, hasLength(2));
    });

    test('getChantiersByClient filters correctly', () async {
      await db.chantiersDao.insertOne(makeChantier(id: 'ch1', clientId: 'c1'));
      await db.chantiersDao.insertOne(makeChantier(id: 'ch2', clientId: 'c2'));
      await db.chantiersDao.insertOne(makeChantier(id: 'ch3', clientId: 'c1'));
      final result = await db.chantiersDao.getByClient('c1');
      expect(result, hasLength(2));
    });

    test('getChantiersByStatut filters correctly', () async {
      await db.chantiersDao.insertOne(
          makeChantier(id: 'ch1', statut: 'en_cours'));
      await db.chantiersDao.insertOne(
          makeChantier(id: 'ch2', statut: 'termine'));
      await db.chantiersDao.insertOne(
          makeChantier(id: 'ch3', statut: 'en_cours'));
      final result = await db.chantiersDao.getByStatut('en_cours');
      expect(result, hasLength(2));
    });

    test('getInterventionsByChantier filters correctly', () async {
      await db.interventionsDao.insertOne(
          makeIntervention(id: 'i1', chantierId: 'ch1'));
      await db.interventionsDao.insertOne(
          makeIntervention(id: 'i2', chantierId: 'ch2'));
      final result = await db.interventionsDao.getByChantier('ch1');
      expect(result, hasLength(1));
    });

    test('getInterventionsByDate filters correctly', () async {
      await db.interventionsDao.insertOne(
          makeIntervention(id: 'i1', date: DateTime(2026, 1, 20)));
      await db.interventionsDao.insertOne(
          makeIntervention(id: 'i2', date: DateTime(2026, 1, 21)));
      final result =
          await db.interventionsDao.getByDate(DateTime(2026, 1, 20));
      expect(result, hasLength(1));
      expect(result.first.id, 'i1');
    });

    test('getDevisByChantier filters correctly', () async {
      await db.devisDao.insertOne(makeDevis(id: 'd1', chantierId: 'ch1'));
      await db.devisDao.insertOne(makeDevis(id: 'd2', chantierId: 'ch2')
          .copyWith(numero: const Value('DEV-002')));
      final result = await db.devisDao.getByChantier('ch1');
      expect(result, hasLength(1));
    });

    test('getDevisByStatut filters correctly', () async {
      await db.devisDao.insertOne(makeDevis(id: 'd1', statut: 'brouillon'));
      await db.devisDao.insertOne(makeDevis(id: 'd2', statut: 'envoye')
          .copyWith(numero: const Value('DEV-002')));
      final result = await db.devisDao.getByStatut('brouillon');
      expect(result, hasLength(1));
    });

    test('getFacturesByDevis filters correctly', () async {
      await db.facturesDao.insertOne(makeFacture(id: 'f1', devisId: 'd1'));
      await db.facturesDao.insertOne(makeFacture(id: 'f2', devisId: 'd2')
          .copyWith(numero: const Value('FAC-002')));
      final result = await db.facturesDao.getByDevis('d1');
      expect(result, hasLength(1));
    });

    test('getFacturesEnRetard returns overdue invoices', () async {
      final pastDate = DateTime.now().subtract(const Duration(days: 30));
      final futureDate = DateTime.now().add(const Duration(days: 30));
      await db.facturesDao.insertOne(
          makeFacture(id: 'f1', statut: 'envoyee', dateEcheance: pastDate));
      await db.facturesDao.insertOne(
          makeFacture(id: 'f2', statut: 'envoyee', dateEcheance: futureDate)
              .copyWith(numero: const Value('FAC-002')));
      await db.facturesDao.insertOne(
          makeFacture(id: 'f3', statut: 'payee', dateEcheance: pastDate)
              .copyWith(numero: const Value('FAC-003')));
      final result = await db.facturesDao.getEnRetard();
      expect(result, hasLength(1));
      expect(result.first.id, 'f1');
    });

    test('getPendingSyncItems returns pending sorted by timestamp', () async {
      await db.syncQueueDao.insertOne(
          makeSyncItem(status: 'pending', timestamp: 200));
      await db.syncQueueDao.insertOne(
          makeSyncItem(status: 'failed', timestamp: 100));
      await db.syncQueueDao.insertOne(
          makeSyncItem(status: 'pending', timestamp: 50));
      final result = await db.syncQueueDao.getPending();
      expect(result, hasLength(2));
      expect(result.first.timestamp, 50);
    });

    test('getFailedSyncItems returns failed', () async {
      await db.syncQueueDao.insertOne(makeSyncItem(status: 'pending'));
      await db.syncQueueDao.insertOne(makeSyncItem(status: 'failed'));
      final result = await db.syncQueueDao.getFailed();
      expect(result, hasLength(1));
    });

    test('getSyncItemsByEntity filters correctly', () async {
      await db.syncQueueDao.insertOne(
          makeSyncItem(entity: 'client', timestamp: 1));
      await db.syncQueueDao.insertOne(
          makeSyncItem(entity: 'chantier', timestamp: 2));
      final result = await db.syncQueueDao.getByEntity('client');
      expect(result, hasLength(1));
    });

    test('getSyncMeta returns correct meta', () async {
      await db.syncMetaDao.insertOne(makeSyncMeta(entity: 'client'));
      await db.syncMetaDao.insertOne(makeSyncMeta(entity: 'chantier'));
      final result = await db.syncMetaDao.getByEntity('client');
      expect(result, isNotNull);
      expect(result!.entity, 'client');
    });

    test('getPendingPhotos returns non-uploaded', () async {
      await db.photoQueueDao.insertOne(makePhoto(status: 'pending'));
      await db.photoQueueDao.insertOne(makePhoto(status: 'uploading', interventionId: 'i2'));
      final result = await db.photoQueueDao.getPending();
      expect(result, hasLength(1));
    });

    test('getPhotosByIntervention filters correctly', () async {
      await db.photoQueueDao.insertOne(makePhoto(interventionId: 'i1'));
      await db.photoQueueDao.insertOne(makePhoto(interventionId: 'i2'));
      final result = await db.photoQueueDao.getByIntervention('i1');
      expect(result, hasLength(1));
    });
  });

  // ===== Performance Tests =====
  group('Performance', () {
    test('insert 100 clients then search by type', () async {
      for (var i = 0; i < 100; i++) {
        await db.clientsDao.insertOne(
            makeClient(id: 'c$i', type: i.isEven ? 'particulier' : 'professionnel'));
      }
      final result = await db.clientsDao.getByType('particulier');
      expect(result, hasLength(50));
    });

    test('insert 100 chantiers then filter by statut', () async {
      for (var i = 0; i < 100; i++) {
        await db.chantiersDao.insertOne(
            makeChantier(id: 'ch$i', statut: i % 3 == 0 ? 'en_cours' : 'termine'));
      }
      final result = await db.chantiersDao.getByStatut('en_cours');
      expect(result, hasLength(34));
    });

    test('syncedAt column exists for diff sync', () async {
      await db.clientsDao.insertOne(makeClient());
      final result = await db.clientsDao.getById('c1');
      expect(result!.syncedAt, isNull);
    });
  });

  // ===== Cascade & Integrity =====
  group('Cascade and integrity', () {
    test('syncQueue incrementRetryCount works', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      expect(all.first.retryCount, 0);
      await db.syncQueueDao.incrementRetryCount(all.first.id);
      final updated = await db.syncQueueDao.getAll();
      expect(updated.first.retryCount, 1);
    });

    test('syncQueue status transitions pending -> syncing -> failed', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      final item = all.first;

      await db.syncQueueDao.updateOne(item.copyWith(status: 'syncing'));
      var updated = (await db.syncQueueDao.getAll()).first;
      expect(updated.status, 'syncing');

      await db.syncQueueDao.updateOne(updated.copyWith(status: 'failed'));
      updated = (await db.syncQueueDao.getAll()).first;
      expect(updated.status, 'failed');
    });

    test('syncQueue delete after sync success', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final all = await db.syncQueueDao.getAll();
      await db.syncQueueDao.deleteById(all.first.id);
      final after = await db.syncQueueDao.getAll();
      expect(after, isEmpty);
    });

    test('photoQueue update attempts + status', () async {
      await db.photoQueueDao.insertOne(makePhoto());
      final all = await db.photoQueueDao.getAll();
      final photo = all.first;
      await db.photoQueueDao.updateOne(
          photo.copyWith(attempts: 1, status: 'uploading'));
      final updated = (await db.photoQueueDao.getAll()).first;
      expect(updated.attempts, 1);
      expect(updated.status, 'uploading');
    });

    test('transaction: insert multiple in a transaction', () async {
      await db.transaction(() async {
        await db.clientsDao.insertOne(makeClient(id: 'c1'));
        await db.clientsDao.insertOne(makeClient(id: 'c2'));
      });
      final all = await db.clientsDao.getAll();
      expect(all, hasLength(2));
    });

    test('transaction: rollback on error', () async {
      try {
        await db.transaction(() async {
          await db.clientsDao.insertOne(makeClient(id: 'c1'));
          // This should fail (duplicate PK)
          await db.clientsDao.insertOne(makeClient(id: 'c1'));
        });
      } catch (_) {}
      final all = await db.clientsDao.getAll();
      expect(all, isEmpty);
    });

    test('chantier insert without foreign key constraint is OK', () async {
      // SQLite without FK constraints enabled - insert succeeds
      await db.chantiersDao.insertOne(makeChantier(clientId: 'nonexistent'));
      final result = await db.chantiersDao.getById('ch1');
      expect(result, isNotNull);
    });

    test('client deletion does not cascade to chantiers (no FK)', () async {
      await db.clientsDao.insertOne(makeClient(id: 'c1'));
      await db.chantiersDao.insertOne(makeChantier(clientId: 'c1'));
      await db.clientsDao.deleteById('c1');
      final chantiers = await db.chantiersDao.getAll();
      expect(chantiers, hasLength(1));
    });
  });

  // ===== Reactive Streams =====
  group('Reactive streams', () {
    test('watch clients emits when inserted', () async {
      final stream = db.clientsDao.watchAll();

      // Initial state is empty
      final initial = await stream.first;
      expect(initial, isEmpty);

      // Insert triggers new emission
      await db.clientsDao.insertOne(makeClient());
      final afterInsert = await stream.first;
      expect(afterInsert, hasLength(1));
    });

    test('watch clients emits when modified', () async {
      await db.clientsDao.insertOne(makeClient());
      final stream = db.clientsDao.watchAll();
      final first = await stream.first;
      expect(first, hasLength(1));

      final row = first.first;
      await db.clientsDao.updateOne(ClientsTableCompanion(
        id: Value(row.id),
        type: Value(row.type),
        nom: const Value('Modified'),
        email: Value(row.email),
        telephone: Value(row.telephone),
        adresse: Value(row.adresse),
        codePostal: Value(row.codePostal),
        ville: Value(row.ville),
        tags: Value(row.tags),
        createdAt: Value(row.createdAt),
        updatedAt: Value(DateTime.now()),
      ));

      final second = await stream.first;
      expect(second.first.nom, 'Modified');
    });

    test('watch sync queue emits on status change', () async {
      await db.syncQueueDao.insertOne(makeSyncItem());
      final stream = db.syncQueueDao.watchAll();
      final first = await stream.first;
      expect(first.first.status, 'pending');

      await db.syncQueueDao.updateOne(first.first.copyWith(status: 'syncing'));
      final second = await stream.first;
      expect(second.first.status, 'syncing');
    });

    test('stream closes properly on database close', () async {
      final testDb = _createTestDb();
      final stream = testDb.clientsDao.watchAll();
      final sub = stream.listen((_) {});
      await testDb.close();
      await sub.cancel();
    });

    test('watch with filter works correctly', () async {
      await db.clientsDao.insertOne(makeClient(id: 'c1', type: 'particulier'));
      final result = await db.clientsDao.getByType('particulier');
      expect(result, hasLength(1));
      await db.clientsDao.insertOne(makeClient(id: 'c2', type: 'professionnel'));
      final result2 = await db.clientsDao.getByType('particulier');
      expect(result2, hasLength(1));
    });
  });
}
