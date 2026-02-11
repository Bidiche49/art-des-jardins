import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/models/sync_conflict.dart';
import 'package:art_et_jardin/services/sync/conflict_service.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';

void main() {
  late ConflictService service;

  setUp(() {
    service = ConflictService();
  });

  // ============== hasConflict ==============
  group('hasConflict', () {
    test('no conflict when versions are identical', () {
      final local = {'version': 1, 'updatedAt': '2024-01-01T10:00:00.000Z'};
      final server = {'version': 1, 'updatedAt': '2024-01-01T10:00:00.000Z'};
      expect(service.hasConflict(local, server), false);
    });

    test('conflict when server version > local version', () {
      final local = {'version': 1};
      final server = {'version': 2};
      expect(service.hasConflict(local, server), true);
    });

    test('conflict when same version but server updatedAt is newer', () {
      final local = {'version': 1, 'updatedAt': '2024-01-01T10:00:00.000Z'};
      final server = {'version': 1, 'updatedAt': '2024-01-02T10:00:00.000Z'};
      expect(service.hasConflict(local, server), true);
    });
  });

  // ============== detectConflictingFields ==============
  group('detectConflictingFields', () {
    test('returns correct conflicting fields', () {
      final local = {'nom': 'Dupont', 'prenom': 'Jean', 'email': 'a@b.fr'};
      final server = {'nom': 'Dupont', 'prenom': 'Pierre', 'email': 'c@d.fr'};
      final result = service.detectConflictingFields(local, server);
      expect(result, ['email', 'prenom']);
    });

    test('excludes id, version, timestamps', () {
      final local = {
        'id': '1',
        'version': 1,
        'createdAt': '2024-01-01',
        'updatedAt': '2024-01-01',
        'created_at': '2024-01-01',
        'updated_at': '2024-01-01',
        'nom': 'A',
      };
      final server = {
        'id': '2',
        'version': 2,
        'createdAt': '2024-01-02',
        'updatedAt': '2024-01-02',
        'created_at': '2024-01-02',
        'updated_at': '2024-01-02',
        'nom': 'B',
      };
      final result = service.detectConflictingFields(local, server);
      expect(result, ['nom']);
    });

    test('returns empty list when no differences', () {
      final data = {'nom': 'Same', 'prenom': 'Same'};
      expect(service.detectConflictingFields(data, Map.from(data)), isEmpty);
    });

    test('returns 3 fields when 3 are different', () {
      final local = {'a': 1, 'b': 2, 'c': 3, 'd': 4};
      final server = {'a': 10, 'b': 20, 'c': 30, 'd': 4};
      final result = service.detectConflictingFields(local, server);
      expect(result, hasLength(3));
      expect(result, ['a', 'b', 'c']);
    });
  });

  // ============== createSyncConflict ==============
  group('createSyncConflict', () {
    test('stores local and server data with detected fields', () {
      final local = {'nom': 'Local', 'prenom': 'Jean'};
      final server = {'nom': 'Server', 'prenom': 'Jean'};
      final conflict = service.createSyncConflict(
        entityType: 'client',
        entityId: 'abc',
        entityLabel: 'Client Test',
        localVersion: local,
        serverVersion: server,
        localTimestamp: DateTime(2024, 1, 1),
        serverTimestamp: DateTime(2024, 1, 2),
      );

      expect(conflict.localVersion, local);
      expect(conflict.serverVersion, server);
      expect(conflict.entityType, 'client');
      expect(conflict.entityId, 'abc');
      expect(conflict.entityLabel, 'Client Test');
      expect(conflict.conflictingFields, ['nom']);
    });
  });

  // ============== resolveConflict ==============
  group('resolveConflict', () {
    late SyncConflict conflict;

    setUp(() {
      conflict = SyncConflict(
        id: 'test_1',
        entityType: 'client',
        entityId: 'abc',
        entityLabel: 'Test',
        localVersion: {'nom': 'Local', 'email': 'local@test.fr'},
        serverVersion: {'nom': 'Server', 'email': 'server@test.fr'},
        localTimestamp: DateTime(2024, 1, 1),
        serverTimestamp: DateTime(2024, 1, 2),
        conflictingFields: ['email', 'nom'],
      );
    });

    test('local strategy returns local version', () {
      final result = service.resolveConflict(
        conflict: conflict,
        strategy: 'local',
      );
      expect(result['nom'], 'Local');
      expect(result['email'], 'local@test.fr');
    });

    test('server strategy returns server version', () {
      final result = service.resolveConflict(
        conflict: conflict,
        strategy: 'server',
      );
      expect(result['nom'], 'Server');
      expect(result['email'], 'server@test.fr');
    });

    test('merge strategy combines local and server fields', () {
      final result = service.resolveConflict(
        conflict: conflict,
        strategy: 'merge',
        mergeOverrides: {'nom': 'Local'},
      );
      expect(result['nom'], 'Local');
      expect(result['email'], 'server@test.fr');
    });

    test('merge validates merged fields have correct values', () {
      final result = service.resolveConflict(
        conflict: conflict,
        strategy: 'merge',
        mergeOverrides: {'nom': 'Local', 'email': 'local@test.fr'},
      );
      expect(result.containsKey('nom'), true);
      expect(result.containsKey('email'), true);
      expect(result['nom'], 'Local');
      expect(result['email'], 'local@test.fr');
    });
  });

  // ============== ConflictNotifier ==============
  group('ConflictNotifier', () {
    late ConflictNotifier notifier;

    setUp(() {
      notifier = ConflictNotifier(conflictService: ConflictService());
    });

    test('conflict removed from list after resolution', () {
      final conflict = SyncConflict(
        id: 'test_1',
        entityType: 'client',
        entityId: 'abc',
        entityLabel: 'Test',
        localVersion: {'nom': 'Local'},
        serverVersion: {'nom': 'Server'},
        localTimestamp: DateTime(2024, 1, 1),
        serverTimestamp: DateTime(2024, 1, 2),
        conflictingFields: ['nom'],
      );

      notifier.addConflict(conflict);
      expect(notifier.state, hasLength(1));

      notifier.resolveConflict(conflictId: 'test_1', strategy: 'local');
      expect(notifier.state, isEmpty);
    });

    test('conflict count correct after multiple resolutions', () {
      final conflict1 = SyncConflict(
        id: 'test_1',
        entityType: 'client',
        entityId: 'a',
        entityLabel: 'Client A',
        localVersion: {'nom': 'A'},
        serverVersion: {'nom': 'B'},
        localTimestamp: DateTime(2024, 1, 1),
        serverTimestamp: DateTime(2024, 1, 2),
        conflictingFields: ['nom'],
      );
      final conflict2 = SyncConflict(
        id: 'test_2',
        entityType: 'chantier',
        entityId: 'b',
        entityLabel: 'Chantier B',
        localVersion: {'desc': 'X'},
        serverVersion: {'desc': 'Y'},
        localTimestamp: DateTime(2024, 1, 1),
        serverTimestamp: DateTime(2024, 1, 2),
        conflictingFields: ['desc'],
      );

      notifier.addConflict(conflict1);
      notifier.addConflict(conflict2);
      expect(notifier.conflictCount, 2);

      notifier.resolveConflict(conflictId: 'test_1', strategy: 'server');
      expect(notifier.conflictCount, 1);

      notifier.resolveConflict(conflictId: 'test_2', strategy: 'local');
      expect(notifier.conflictCount, 0);
    });
  });
}
