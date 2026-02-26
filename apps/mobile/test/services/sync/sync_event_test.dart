import 'package:dio/dio.dart';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/data/local/database/app_database.dart';
import 'package:art_et_jardin/services/sync/sync_event.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockDio extends Mock implements Dio {}

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
    syncService.dispose();
    await db.close();
  });

  setUpAll(() {
    registerFallbackValue(RequestOptions(path: ''));
  });

  group('sync event stream', () {
    test('emits event after successful create sync', () async {
      final responseData = {
        'id': 'uuid-real-123',
        'chantierId': 'chantier-1',
        'numero': 'DEV-2026-001',
      };

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: responseData,
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {'chantierId': 'chantier-1', 'lignes': []},
        entityId: 'temp-123',
      );

      final events = <SyncEvent>[];
      final sub = syncService.syncEventStream.listen(events.add);

      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(events, hasLength(1));
      expect(events.first.operation, 'create');
      expect(events.first.entity, 'devis');
      expect(events.first.entityId, 'uuid-real-123');
      expect(events.first.tempEntityId, 'temp-123');
      expect(events.first.responseData, isNotNull);
      expect(events.first.responseData!['numero'], 'DEV-2026-001');

      await sub.cancel();
    });

    test('emits event after successful update sync', () async {
      final responseData = {
        'id': 'uuid-123',
        'chantierId': 'chantier-1',
        'numero': 'DEV-2026-001',
        'statut': 'envoye',
      };

      when(() => mockDio.put(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: responseData,
                requestOptions: RequestOptions(path: ''),
                statusCode: 200,
              ));

      await syncService.addToQueue(
        operation: 'update',
        entity: 'devis',
        data: {'statut': 'envoye'},
        entityId: 'uuid-123',
      );

      final events = <SyncEvent>[];
      final sub = syncService.syncEventStream.listen(events.add);

      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(events, hasLength(1));
      expect(events.first.operation, 'update');
      expect(events.first.entity, 'devis');
      expect(events.first.entityId, 'uuid-123');
      expect(events.first.tempEntityId, isNull);

      await sub.cancel();
    });

    test('emits event after successful delete sync', () async {
      when(() => mockDio.delete(any()))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(path: ''),
                statusCode: 200,
              ));

      await syncService.addToQueue(
        operation: 'delete',
        entity: 'devis',
        data: {},
        entityId: 'uuid-123',
      );

      final events = <SyncEvent>[];
      final sub = syncService.syncEventStream.listen(events.add);

      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(events, hasLength(1));
      expect(events.first.operation, 'delete');
      expect(events.first.entity, 'devis');
      expect(events.first.entityId, 'uuid-123');

      await sub.cancel();
    });

    test('does not emit event on sync failure', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {'test': true},
      );

      final events = <SyncEvent>[];
      final sub = syncService.syncEventStream.listen(events.add);

      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(events, isEmpty);

      await sub.cancel();
    });

    test('emits multiple events for batch sync', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {'id': 'real-id'},
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));
      when(() => mockDio.put(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {'id': 'updated-id'},
                requestOptions: RequestOptions(path: ''),
                statusCode: 200,
              ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {'test': true},
        entityId: 'temp-1',
      );
      await syncService.addToQueue(
        operation: 'update',
        entity: 'client',
        data: {'nom': 'Updated'},
        entityId: 'client-1',
      );

      final events = <SyncEvent>[];
      final sub = syncService.syncEventStream.listen(events.add);

      await syncService.syncAll();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(events, hasLength(2));
      expect(events[0].entity, 'devis');
      expect(events[1].entity, 'client');

      await sub.cancel();
    });
  });

  group('reconciliation callback', () {
    test('reconciliation callback is called on successful sync', () async {
      final reconciliationCalls = <SyncEvent>[];

      syncService.registerReconciliation(
        'devis',
        (event) async => reconciliationCalls.add(event),
      );

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {
                  'id': 'uuid-real',
                  'chantierId': 'chantier-1',
                  'numero': 'DEV-2026-001',
                },
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {'chantierId': 'chantier-1'},
        entityId: 'temp-123',
      );

      await syncService.syncAll();

      expect(reconciliationCalls, hasLength(1));
      expect(reconciliationCalls.first.tempEntityId, 'temp-123');
      expect(reconciliationCalls.first.entityId, 'uuid-real');
    });

    test('reconciliation not called for unregistered entities', () async {
      final reconciliationCalls = <SyncEvent>[];

      syncService.registerReconciliation(
        'devis',
        (event) async => reconciliationCalls.add(event),
      );

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {'id': 'client-real'},
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'client',
        data: {'nom': 'Test'},
      );

      await syncService.syncAll();

      expect(reconciliationCalls, isEmpty);
    });

    test('reconciliation not called on sync failure', () async {
      final reconciliationCalls = <SyncEvent>[];

      syncService.registerReconciliation(
        'devis',
        (event) async => reconciliationCalls.add(event),
      );

      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          requestOptions: RequestOptions(path: ''),
          statusCode: 500,
        ),
      ));

      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {'test': true},
        entityId: 'temp-123',
      );

      await syncService.syncAll();

      expect(reconciliationCalls, isEmpty);
    });
  });

  group('full reconciliation flow', () {
    test('create devis offline -> sync -> temp record replaced', () async {
      // Step 1: Insert temp devis in local DB (simulating offline create)
      const tempId = 'temp-1234567890';
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

      // Step 2: Insert temp lignes
      await db.lignesDevisDao.insertAll([
        LignesDevisTableCompanion.insert(
          id: 'ligne-temp-1',
          devisId: tempId,
          description: 'Tonte',
          quantite: 10,
          unite: 'm2',
          prixUnitaireHT: 5,
          montantHT: 50,
          montantTTC: 60,
          ordre: 0,
        ),
      ]);

      // Step 3: Queue sync
      await syncService.addToQueue(
        operation: 'create',
        entity: 'devis',
        data: {
          'chantierId': 'chantier-1',
          'lignes': [
            {
              'description': 'Tonte',
              'quantite': 10,
              'unite': 'm2',
              'prixUnitaireHT': 5,
              'tva': 20,
              'ordre': 0,
            }
          ],
        },
        entityId: tempId,
      );

      // Step 4: Register reconciliation
      const realId = 'uuid-real-devis';
      syncService.registerReconciliation('devis', (event) async {
        final responseData = event.responseData;
        if (responseData == null || event.tempEntityId == null) return;

        // Delete temp
        await db.lignesDevisDao.deleteByDevisId(event.tempEntityId!);
        await db.devisDao.deleteById(event.tempEntityId!);

        // Insert real devis
        await db.devisDao.insertOne(DevisTableCompanion.insert(
          id: responseData['id'] as String,
          chantierId: responseData['chantierId'] as String,
          numero: responseData['numero'] as String,
          dateEmission: DateTime.parse(responseData['dateEmission'] as String),
          dateValidite: DateTime.parse(responseData['dateValidite'] as String),
          totalHT: (responseData['totalHT'] as num).toDouble(),
          totalTVA: (responseData['totalTVA'] as num).toDouble(),
          totalTTC: (responseData['totalTTC'] as num).toDouble(),
          createdAt: DateTime.parse(responseData['createdAt'] as String),
          updatedAt: DateTime.parse(responseData['updatedAt'] as String),
        ));

        // Insert real lignes
        final lignesJson = responseData['lignes'] as List? ?? [];
        for (final l in lignesJson) {
          final ligneMap = l as Map<String, dynamic>;
          await db.lignesDevisDao.insertOne(LignesDevisTableCompanion.insert(
            id: ligneMap['id'] as String,
            devisId: responseData['id'] as String,
            description: ligneMap['description'] as String,
            quantite: (ligneMap['quantite'] as num).toDouble(),
            unite: ligneMap['unite'] as String,
            prixUnitaireHT: (ligneMap['prixUnitaireHT'] as num).toDouble(),
            montantHT: (ligneMap['montantHT'] as num).toDouble(),
            montantTTC: (ligneMap['montantTTC'] as num).toDouble(),
            ordre: ligneMap['ordre'] as int,
          ));
        }
      });

      // Step 5: Mock API response
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {
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
                  'lignes': [
                    {
                      'id': 'ligne-real-1',
                      'devisId': realId,
                      'description': 'Tonte',
                      'quantite': 10.0,
                      'unite': 'm2',
                      'prixUnitaireHT': 5.0,
                      'tva': 20.0,
                      'montantHT': 50.0,
                      'montantTTC': 60.0,
                      'ordre': 0,
                    }
                  ],
                },
                requestOptions: RequestOptions(path: ''),
                statusCode: 201,
              ));

      // Step 6: Sync
      final result = await syncService.syncAll();

      expect(result.synced, 1);

      // Step 7: Verify - temp gone, real exists
      final tempDevis = await db.devisDao.getById(tempId);
      expect(tempDevis, isNull);

      final realDevis = await db.devisDao.getById(realId);
      expect(realDevis, isNotNull);
      expect(realDevis!.numero, 'DEV-2026-001');

      final tempLignes = await db.lignesDevisDao.getByDevisId(tempId);
      expect(tempLignes, isEmpty);

      final realLignes = await db.lignesDevisDao.getByDevisId(realId);
      expect(realLignes, hasLength(1));
      expect(realLignes[0].id, 'ligne-real-1');
    });
  });
}
