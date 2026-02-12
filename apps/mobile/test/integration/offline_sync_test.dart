import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/sync_conflict.dart';
import 'package:art_et_jardin/services/sync/conflict_service.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';

class MockConflictService extends Mock implements ConflictService {}

SyncConflict _testConflict({
  String id = 'c1',
  String entityType = 'client',
  String entityId = 'c1',
  Map<String, dynamic> localVersion = const {'nom': 'Local'},
  Map<String, dynamic> serverVersion = const {'nom': 'Server'},
}) =>
    SyncConflict(
      id: id,
      entityType: entityType,
      entityId: entityId,
      entityLabel: 'Test $entityType',
      localVersion: localVersion,
      serverVersion: serverVersion,
      localTimestamp: DateTime(2026, 2, 12, 10, 0),
      serverTimestamp: DateTime(2026, 2, 12, 10, 5),
    );

void main() {
  late MockConflictService mockConflict;

  setUp(() {
    mockConflict = MockConflictService();
    registerFallbackValue(_testConflict());
  });

  group('Offline Sync - ConflictNotifier', () {
    late ConflictNotifier notifier;

    tearDown(() {
      notifier.dispose();
    });

    test('initially empty', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      expect(notifier.state, isEmpty);
      expect(notifier.conflictCount, 0);
    });

    test('addConflict adds to state', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict());
      expect(notifier.conflictCount, 1);
      expect(notifier.state.first.entityType, 'client');
    });

    test('multiple conflicts tracked', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict(id: 'c1', entityType: 'client'));
      notifier.addConflict(_testConflict(id: 'c2', entityType: 'chantier'));
      expect(notifier.conflictCount, 2);
    });

    test('resolveConflict with local strategy', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict(
        localVersion: {'nom': 'Local'},
        serverVersion: {'nom': 'Server'},
      ));

      when(() => mockConflict.resolveConflict(
            conflict: any(named: 'conflict'),
            strategy: 'local',
            mergeOverrides: any(named: 'mergeOverrides'),
          )).thenReturn({'nom': 'Local'});

      final result = notifier.resolveConflict(
        conflictId: 'c1',
        strategy: 'local',
      );

      expect(result, {'nom': 'Local'});
      expect(notifier.conflictCount, 0);
    });

    test('resolveConflict with server strategy', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict());

      when(() => mockConflict.resolveConflict(
            conflict: any(named: 'conflict'),
            strategy: 'server',
            mergeOverrides: any(named: 'mergeOverrides'),
          )).thenReturn({'nom': 'Server'});

      final result = notifier.resolveConflict(
        conflictId: 'c1',
        strategy: 'server',
      );

      expect(result, {'nom': 'Server'});
    });

    test('resolveConflict with merge strategy and overrides', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict(
        localVersion: {'nom': 'Local', 'email': 'local@test.fr'},
        serverVersion: {'nom': 'Server', 'email': 'server@test.fr'},
      ));

      when(() => mockConflict.resolveConflict(
            conflict: any(named: 'conflict'),
            strategy: 'merge',
            mergeOverrides: any(named: 'mergeOverrides'),
          )).thenReturn({'nom': 'Local', 'email': 'server@test.fr'});

      final result = notifier.resolveConflict(
        conflictId: 'c1',
        strategy: 'merge',
        mergeOverrides: {'nom': 'Local'},
      );

      expect(result['nom'], 'Local');
      expect(result['email'], 'server@test.fr');
    });

    test('resolve only removes targeted conflict', () {
      notifier = ConflictNotifier(conflictService: mockConflict);
      notifier.addConflict(_testConflict(id: 'c1', entityType: 'client'));
      notifier.addConflict(_testConflict(id: 'c2', entityType: 'chantier'));

      when(() => mockConflict.resolveConflict(
            conflict: any(named: 'conflict'),
            strategy: any(named: 'strategy'),
            mergeOverrides: any(named: 'mergeOverrides'),
          )).thenReturn({});

      notifier.resolveConflict(conflictId: 'c1', strategy: 'server');

      expect(notifier.conflictCount, 1);
      expect(notifier.state.first.id, 'c2');
    });

  });

  group('Offline Sync - ConflictService', () {
    test('hasConflict detects version mismatch', () {
      final service = ConflictService();
      expect(
        service.hasConflict(
          {'version': 1},
          {'version': 2},
        ),
        isTrue,
      );
    });

    test('hasConflict returns false for same version', () {
      final service = ConflictService();
      expect(
        service.hasConflict(
          {'version': 2},
          {'version': 1},
        ),
        isFalse,
      );
    });

    test('detectConflictingFields finds differing fields', () {
      final service = ConflictService();
      final fields = service.detectConflictingFields(
        {'nom': 'Local', 'email': 'a@b.fr', 'id': '1'},
        {'nom': 'Server', 'email': 'a@b.fr', 'id': '1'},
      );
      expect(fields, ['nom']);
    });

    test('createSyncConflict generates valid conflict', () {
      final service = ConflictService();
      final conflict = service.createSyncConflict(
        entityType: 'client',
        entityId: 'c1',
        entityLabel: 'Dupont',
        localVersion: {'nom': 'Local'},
        serverVersion: {'nom': 'Server'},
        localTimestamp: DateTime(2026, 2, 12),
        serverTimestamp: DateTime(2026, 2, 12, 0, 5),
      );
      expect(conflict.entityType, 'client');
      expect(conflict.conflictingFields, ['nom']);
    });

    test('resolveConflict with merge applies overrides', () {
      final service = ConflictService();
      final result = service.mergeData(
        {'nom': 'Local', 'email': 'local@test.fr'},
        {'nom': 'Server', 'email': 'server@test.fr'},
        {'nom': 'Local'},
      );
      expect(result['nom'], 'Local');
      expect(result['email'], 'server@test.fr');
    });
  });
}
