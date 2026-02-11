import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/models/sync_conflict.dart';
import 'package:art_et_jardin/features/sync/presentation/widgets/conflict_queue_banner.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';

SyncConflict _makeConflict({String id = 'test_1'}) {
  return SyncConflict(
    id: id,
    entityType: 'client',
    entityId: 'abc',
    entityLabel: 'Test',
    localVersion: {'nom': 'A'},
    serverVersion: {'nom': 'B'},
    localTimestamp: DateTime(2024, 1, 1),
    serverTimestamp: DateTime(2024, 1, 2),
    conflictingFields: ['nom'],
  );
}

void main() {
  group('ConflictQueueBanner', () {
    testWidgets('visible when conflicts > 0', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: Scaffold(body: ConflictQueueBanner()),
          ),
        ),
      );

      expect(find.byIcon(Icons.warning_amber_rounded), findsOneWidget);
      expect(find.textContaining('conflit'), findsOneWidget);
    });

    testWidgets('hidden when conflicts = 0', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: Scaffold(body: ConflictQueueBanner()),
          ),
        ),
      );

      expect(find.byIcon(Icons.warning_amber_rounded), findsNothing);
    });

    testWidgets('shows correct conflict count', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(conflictNotifierProvider.notifier)
        ..addConflict(_makeConflict(id: 'c1'))
        ..addConflict(_makeConflict(id: 'c2'));

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: Scaffold(body: ConflictQueueBanner()),
          ),
        ),
      );

      expect(
        find.text('2 conflits en attente de resolution'),
        findsOneWidget,
      );
    });

    testWidgets('non-dismissible (no close button)', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: Scaffold(body: ConflictQueueBanner()),
          ),
        ),
      );

      expect(find.byIcon(Icons.close), findsNothing);
    });

    testWidgets('tap triggers onTap callback', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      bool tapped = false;

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp(
            home: Scaffold(
              body: ConflictQueueBanner(onTap: () => tapped = true),
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ConflictQueueBanner));
      expect(tapped, true);
    });
  });
}
