import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/services/sync/devis_reconciliation.dart';
import 'package:art_et_jardin/services/sync/sync_event.dart';

void main() {
  late AppDatabase db;
  late DevisReconciliation reconciliation;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
    reconciliation = DevisReconciliation(
      devisDao: db.devisDao,
      lignesDevisDao: db.lignesDevisDao,
    );
  });

  tearDown(() async {
    await db.close();
  });

  // ============== Helper to insert a temp devis ==============
  Future<void> insertTempDevis(String tempId) async {
    await db.devisDao.insertOne(DevisTableCompanion.insert(
      id: tempId,
      chantierId: 'chantier-1',
      numero: 'BROUILLON',
      dateEmission: DateTime(2026, 2, 1),
      dateValidite: DateTime(2026, 3, 1),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
      createdAt: DateTime(2026, 2, 1),
      updatedAt: DateTime(2026, 2, 1),
    ));
  }

  Future<void> insertTempLignes(String devisId) async {
    await db.lignesDevisDao.insertAll([
      LignesDevisTableCompanion.insert(
        id: 'ligne-temp-1',
        devisId: devisId,
        description: 'Tonte pelouse',
        quantite: 10,
        unite: 'm2',
        prixUnitaireHT: 5,
        montantHT: 50,
        montantTTC: 60,
        ordre: 0,
      ),
      LignesDevisTableCompanion.insert(
        id: 'ligne-temp-2',
        devisId: devisId,
        description: 'Taille haie',
        quantite: 5,
        unite: 'ml',
        prixUnitaireHT: 10,
        montantHT: 50,
        montantTTC: 60,
        ordre: 1,
      ),
    ]);
  }

  group('reconcile create', () {
    test('replaces temp devis record with real record from API', () async {
      const tempId = 'temp-1234567890';
      const realId = 'uuid-real-devis-001';

      await insertTempDevis(tempId);

      // Verify temp record exists
      var tempRecord = await db.devisDao.getById(tempId);
      expect(tempRecord, isNotNull);
      expect(tempRecord!.numero, 'BROUILLON');

      // Simulate sync event with API response
      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: realId,
        tempEntityId: tempId,
        responseData: {
          'id': realId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-001',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 100.0,
          'totalTVA': 20.0,
          'totalTTC': 120.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-01T00:00:00.000',
        },
      );

      await reconciliation.reconcile(event);

      // Temp record should be gone
      tempRecord = await db.devisDao.getById(tempId);
      expect(tempRecord, isNull);

      // Real record should exist
      final realRecord = await db.devisDao.getById(realId);
      expect(realRecord, isNotNull);
      expect(realRecord!.numero, 'DEV-2026-001');
      expect(realRecord.chantierId, 'chantier-1');
    });

    test('migrates lignes from temp ID to real ID when API has no lignes',
        () async {
      const tempId = 'temp-1234567890';
      const realId = 'uuid-real-devis-002';

      await insertTempDevis(tempId);
      await insertTempLignes(tempId);

      // Verify temp lignes exist
      var tempLignes = await db.lignesDevisDao.getByDevisId(tempId);
      expect(tempLignes, hasLength(2));

      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: realId,
        tempEntityId: tempId,
        responseData: {
          'id': realId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-002',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 100.0,
          'totalTVA': 20.0,
          'totalTTC': 120.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-01T00:00:00.000',
        },
      );

      await reconciliation.reconcile(event);

      // Temp lignes should be gone
      tempLignes = await db.lignesDevisDao.getByDevisId(tempId);
      expect(tempLignes, isEmpty);

      // Real lignes should exist with real devisId
      final realLignes = await db.lignesDevisDao.getByDevisId(realId);
      expect(realLignes, hasLength(2));
      expect(realLignes[0].devisId, realId);
      expect(realLignes[1].devisId, realId);
    });

    test('uses lignes from API response when available', () async {
      const tempId = 'temp-1234567890';
      const realId = 'uuid-real-devis-003';

      await insertTempDevis(tempId);
      await insertTempLignes(tempId);

      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: realId,
        tempEntityId: tempId,
        responseData: {
          'id': realId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-003',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 200.0,
          'totalTVA': 40.0,
          'totalTTC': 240.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-01T00:00:00.000',
          'lignes': [
            {
              'id': 'ligne-real-1',
              'devisId': realId,
              'description': 'Tonte pelouse premium',
              'quantite': 20.0,
              'unite': 'm2',
              'prixUnitaireHT': 10.0,
              'tva': 20.0,
              'montantHT': 200.0,
              'montantTTC': 240.0,
              'ordre': 0,
            },
          ],
        },
      );

      await reconciliation.reconcile(event);

      // Temp lignes should be gone
      final tempLignes = await db.lignesDevisDao.getByDevisId(tempId);
      expect(tempLignes, isEmpty);

      // Real lignes from API should be inserted
      final realLignes = await db.lignesDevisDao.getByDevisId(realId);
      expect(realLignes, hasLength(1));
      expect(realLignes[0].id, 'ligne-real-1');
      expect(realLignes[0].description, 'Tonte pelouse premium');
      expect(realLignes[0].quantite, 20.0);
    });

    test('no duplicates after reconciliation', () async {
      const tempId = 'temp-1234567890';
      const realId = 'uuid-real-devis-004';

      await insertTempDevis(tempId);
      await insertTempLignes(tempId);

      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: realId,
        tempEntityId: tempId,
        responseData: {
          'id': realId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-004',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 100.0,
          'totalTVA': 20.0,
          'totalTTC': 120.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-01T00:00:00.000',
        },
      );

      await reconciliation.reconcile(event);

      // Should have exactly 1 devis (the real one, not the temp)
      final allDevis = await db.devisDao.getAll();
      final matching =
          allDevis.where((d) => d.id == tempId || d.id == realId).toList();
      expect(matching, hasLength(1));
      expect(matching.first.id, realId);
    });

    test('handles null tempEntityId gracefully', () async {
      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'some-id',
        tempEntityId: null,
        responseData: {
          'id': 'some-id',
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-005',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 100.0,
          'totalTVA': 20.0,
          'totalTTC': 120.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-01T00:00:00.000',
        },
      );

      // Should not throw
      await reconciliation.reconcile(event);

      // No devis should be created since tempId is null
      final allDevis = await db.devisDao.getAll();
      expect(allDevis, isEmpty);
    });

    test('handles null responseData gracefully', () async {
      final event = SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'some-id',
        tempEntityId: 'temp-123',
        responseData: null,
      );

      // Should not throw
      await reconciliation.reconcile(event);
    });
  });

  group('reconcile update', () {
    test('updates existing devis with API response data', () async {
      const devisId = 'uuid-devis-existing';

      // Insert existing devis
      await db.devisDao.insertOne(DevisTableCompanion.insert(
        id: devisId,
        chantierId: 'chantier-1',
        numero: 'DEV-2026-010',
        dateEmission: DateTime(2026, 2, 1),
        dateValidite: DateTime(2026, 3, 1),
        totalHT: 100,
        totalTVA: 20,
        totalTTC: 120,
        createdAt: DateTime(2026, 2, 1),
        updatedAt: DateTime(2026, 2, 1),
      ));

      final event = SyncEvent(
        operation: 'update',
        entity: 'devis',
        entityId: devisId,
        responseData: {
          'id': devisId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-010',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 200.0,
          'totalTVA': 40.0,
          'totalTTC': 240.0,
          'statut': 'envoye',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-25T00:00:00.000',
        },
      );

      await reconciliation.reconcile(event);

      final updated = await db.devisDao.getById(devisId);
      expect(updated, isNotNull);
      expect(updated!.totalHT, 200.0);
      expect(updated.totalTTC, 240.0);
      expect(updated.statut, 'envoye');
    });

    test('updates lignes from API response on update', () async {
      const devisId = 'uuid-devis-existing';

      await db.devisDao.insertOne(DevisTableCompanion.insert(
        id: devisId,
        chantierId: 'chantier-1',
        numero: 'DEV-2026-011',
        dateEmission: DateTime(2026, 2, 1),
        dateValidite: DateTime(2026, 3, 1),
        totalHT: 100,
        totalTVA: 20,
        totalTTC: 120,
        createdAt: DateTime(2026, 2, 1),
        updatedAt: DateTime(2026, 2, 1),
      ));

      // Insert old lignes
      await db.lignesDevisDao.insertAll([
        LignesDevisTableCompanion.insert(
          id: 'ligne-old-1',
          devisId: devisId,
          description: 'Old description',
          quantite: 1,
          unite: 'u',
          prixUnitaireHT: 100,
          montantHT: 100,
          montantTTC: 120,
          ordre: 0,
        ),
      ]);

      final event = SyncEvent(
        operation: 'update',
        entity: 'devis',
        entityId: devisId,
        responseData: {
          'id': devisId,
          'chantierId': 'chantier-1',
          'numero': 'DEV-2026-011',
          'dateEmission': '2026-02-01T00:00:00.000',
          'dateValidite': '2026-03-01T00:00:00.000',
          'totalHT': 200.0,
          'totalTVA': 40.0,
          'totalTTC': 240.0,
          'statut': 'brouillon',
          'createdAt': '2026-02-01T00:00:00.000',
          'updatedAt': '2026-02-25T00:00:00.000',
          'lignes': [
            {
              'id': 'ligne-new-1',
              'devisId': devisId,
              'description': 'New description',
              'quantite': 2.0,
              'unite': 'u',
              'prixUnitaireHT': 100.0,
              'tva': 20.0,
              'montantHT': 200.0,
              'montantTTC': 240.0,
              'ordre': 0,
            },
          ],
        },
      );

      await reconciliation.reconcile(event);

      final lignes = await db.lignesDevisDao.getByDevisId(devisId);
      expect(lignes, hasLength(1));
      expect(lignes[0].id, 'ligne-new-1');
      expect(lignes[0].description, 'New description');
      expect(lignes[0].quantite, 2.0);
    });
  });

  group('reconcile delete', () {
    test('delete operation does nothing (cleanup already done by sync engine)',
        () async {
      final event = SyncEvent(
        operation: 'delete',
        entity: 'devis',
        entityId: 'uuid-deleted',
      );

      // Should not throw
      await reconciliation.reconcile(event);
    });
  });
}
