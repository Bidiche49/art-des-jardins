import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/devis_statut.dart';
import 'package:art_et_jardin/domain/models/devis.dart';
import 'package:art_et_jardin/features/devis/domain/devis_repository.dart';
import 'package:art_et_jardin/features/devis/presentation/providers/devis_providers.dart';
import 'package:art_et_jardin/services/sync/sync_event.dart';

class MockDevisRepository extends Mock implements DevisRepository {}

Devis _testDevis({
  String id = 'devis-1',
  String numero = 'DEV-2026-001',
}) =>
    Devis(
      id: id,
      chantierId: 'chantier-1',
      numero: numero,
      dateEmission: DateTime(2026, 1, 1),
      dateValidite: DateTime(2026, 1, 31),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
      statut: DevisStatut.brouillon,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  group('DevisListNotifier sync refresh', () {
    test('reloads list when devis sync event is emitted', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        if (loadCount == 1) {
          return [_testDevis()];
        }
        // After reconciliation, return the updated list
        return [
          _testDevis(id: 'uuid-real', numero: 'DEV-2026-002'),
        ];
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      // Wait for initial load
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value![0].id, 'devis-1');
      expect(loadCount, 1);

      // Emit a devis sync event
      syncController.add(const SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'uuid-real',
        tempEntityId: 'temp-123',
      ));

      // Wait for reload
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(loadCount, 2);
      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value![0].id, 'uuid-real');
      expect(notifier.state.value![0].numero, 'DEV-2026-002');

      notifier.dispose();
      await syncController.close();
    });

    test('does not reload on non-devis sync event', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        return [_testDevis()];
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);

      // Emit a client sync event (not devis)
      syncController.add(const SyncEvent(
        operation: 'create',
        entity: 'client',
        entityId: 'client-123',
      ));

      await Future<void>.delayed(const Duration(milliseconds: 50));

      // Should NOT have reloaded
      expect(loadCount, 1);

      notifier.dispose();
      await syncController.close();
    });

    test('reloads on devis update sync event', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        return [_testDevis()];
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);

      syncController.add(const SyncEvent(
        operation: 'update',
        entity: 'devis',
        entityId: 'devis-1',
      ));

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 2);

      notifier.dispose();
      await syncController.close();
    });

    test('reloads on devis delete sync event', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        if (loadCount == 1) return [_testDevis()];
        return []; // After delete
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);
      expect(notifier.state.value, hasLength(1));

      syncController.add(const SyncEvent(
        operation: 'delete',
        entity: 'devis',
        entityId: 'devis-1',
      ));

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 2);
      expect(notifier.state.value, isEmpty);

      notifier.dispose();
      await syncController.close();
    });

    test('handles multiple rapid sync events', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        return [_testDevis()];
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);

      // Rapid fire events
      syncController.add(const SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'devis-a',
      ));
      syncController.add(const SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'devis-b',
      ));
      syncController.add(const SyncEvent(
        operation: 'update',
        entity: 'devis',
        entityId: 'devis-c',
      ));

      await Future<void>.delayed(const Duration(milliseconds: 200));

      // Should have triggered multiple loads
      expect(loadCount, greaterThan(1));

      notifier.dispose();
      await syncController.close();
    });

    test('dispose cancels subscription', () async {
      final mockRepo = MockDevisRepository();
      final syncController = StreamController<SyncEvent>.broadcast();
      var loadCount = 0;

      when(() => mockRepo.getAll()).thenAnswer((_) async {
        loadCount++;
        return [_testDevis()];
      });

      final notifier = DevisListNotifier(mockRepo, syncController.stream);

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);

      notifier.dispose();

      // Events after dispose should not trigger reload
      syncController.add(const SyncEvent(
        operation: 'create',
        entity: 'devis',
        entityId: 'devis-new',
      ));

      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(loadCount, 1);

      await syncController.close();
    });
  });
}
