import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:art_et_jardin/features/scanner/domain/scan_history_service.dart';

void main() {
  late ScanHistoryService service;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    service = ScanHistoryService(prefs);
  });

  ScanHistoryEntry makeEntry({
    String entityType = 'chantier',
    required String entityId,
    String label = 'Test',
  }) {
    return ScanHistoryEntry(
      entityType: entityType,
      entityId: entityId,
      label: label,
      scannedAt: DateTime(2026, 1, 1),
    );
  }

  group('ScanHistoryService', () {
    test('initially empty', () {
      expect(service.getHistory(), isEmpty);
    });

    test('addEntry adds scan to history', () async {
      await service.addEntry(makeEntry(entityId: 'id-1'));

      final history = service.getHistory();
      expect(history.length, 1);
      expect(history.first.entityId, 'id-1');
    });

    test('max 10 entries FIFO', () async {
      for (int i = 0; i < 12; i++) {
        await service.addEntry(makeEntry(entityId: 'id-$i'));
      }

      final history = service.getHistory();
      expect(history.length, 10);
      // Most recent should be first
      expect(history.first.entityId, 'id-11');
      // Oldest 2 (id-0, id-1) should be removed
      expect(history.any((e) => e.entityId == 'id-0'), false);
      expect(history.any((e) => e.entityId == 'id-1'), false);
    });

    test('duplicate entityId replaces existing entry', () async {
      await service.addEntry(makeEntry(entityId: 'id-1', label: 'First'));
      await service.addEntry(makeEntry(entityId: 'id-2', label: 'Second'));
      await service.addEntry(makeEntry(entityId: 'id-1', label: 'Updated'));

      final history = service.getHistory();
      expect(history.length, 2);
      // Updated entry should be first (most recent)
      expect(history.first.entityId, 'id-1');
      expect(history.first.label, 'Updated');
    });

    test('clear removes all history', () async {
      await service.addEntry(makeEntry(entityId: 'id-1'));
      await service.addEntry(makeEntry(entityId: 'id-2'));

      await service.clear();
      expect(service.getHistory(), isEmpty);
    });

    test('JSON serialization roundtrip', () async {
      final entry = ScanHistoryEntry(
        entityType: 'chantier',
        entityId: 'test-uuid-123',
        label: 'Chantier Test',
        scannedAt: DateTime(2026, 2, 11, 14, 30),
      );

      await service.addEntry(entry);
      final history = service.getHistory();

      expect(history.first.entityType, 'chantier');
      expect(history.first.entityId, 'test-uuid-123');
      expect(history.first.label, 'Chantier Test');
    });
  });
}
