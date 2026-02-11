import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/models/sync_conflict.dart';
import 'package:art_et_jardin/features/sync/presentation/pages/conflict_resolution_page.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';

SyncConflict _makeConflict({
  String id = 'test_1',
  String entityType = 'client',
  String entityLabel = 'Dupont Jean',
}) {
  return SyncConflict(
    id: id,
    entityType: entityType,
    entityId: 'abc-123',
    entityLabel: entityLabel,
    localVersion: {
      'nom': 'Dupont',
      'prenom': 'Jean',
      'email': 'local@test.fr',
    },
    serverVersion: {
      'nom': 'Dupont',
      'prenom': 'Pierre',
      'email': 'server@test.fr',
    },
    localTimestamp: DateTime(2024, 1, 1),
    serverTimestamp: DateTime(2024, 1, 2),
    conflictingFields: ['email', 'prenom'],
  );
}

Widget _buildTestWidget(ProviderContainer container) {
  return UncontrolledProviderScope(
    container: container,
    child: const MaterialApp(
      home: ConflictResolutionPage(),
    ),
  );
}

void main() {
  group('ConflictResolutionPage', () {
    testWidgets('displays two versions side by side', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      // Local and server values for conflicting fields are shown
      expect(find.text('local@test.fr'), findsOneWidget);
      expect(find.text('server@test.fr'), findsOneWidget);
      expect(find.text('Jean'), findsOneWidget);
      expect(find.text('Pierre'), findsOneWidget);
    });

    testWidgets('conflicting fields are highlighted in table', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      // The comparison table is rendered
      expect(find.byType(Table), findsOneWidget);

      // Conflicting field names are displayed
      expect(find.text('prenom'), findsOneWidget);
      expect(find.text('email'), findsOneWidget);

      // Non-conflicting field also displayed
      expect(find.text('nom'), findsOneWidget);
    });

    testWidgets('Garder ma version button resolves conflict', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Garder ma version'));
      await tester.pump();

      expect(container.read(conflictNotifierProvider), isEmpty);
      expect(find.text('Conflit resolu'), findsOneWidget);
    });

    testWidgets('Garder version serveur button resolves conflict',
        (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Garder version serveur'));
      await tester.pump();

      expect(container.read(conflictNotifierProvider), isEmpty);
      expect(find.text('Conflit resolu'), findsOneWidget);
    });

    testWidgets('Fusionner button opens merge editor', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Fusionner'));
      await tester.pumpAndSettle();

      expect(find.text('Fusionner les champs'), findsOneWidget);
    });

    testWidgets('merge editor has editable radio fields', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Fusionner'));
      await tester.pumpAndSettle();

      // Each conflicting field has 2 radio options
      expect(find.text('Ma version'), findsNWidgets(2));
      expect(find.text('Version serveur'), findsNWidgets(2));

      final radios = find.byType(RadioListTile<String>);
      expect(radios, findsNWidgets(4));
    });

    testWidgets('merge editor validates before save', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Fusionner'));
      await tester.pumpAndSettle();

      // Save button disabled initially (no selections made)
      final saveButton = tester.widget<FilledButton>(
        find.widgetWithText(FilledButton, 'Sauvegarder'),
      );
      expect(saveButton.onPressed, isNull);

      // Select values for all conflicting fields
      final radios = find.byType(RadioListTile<String>);
      await tester.tap(radios.at(0)); // email -> local
      await tester.pump();
      await tester.ensureVisible(radios.at(2));
      await tester.pumpAndSettle();
      await tester.tap(radios.at(2)); // prenom -> local
      await tester.pump();

      // Save button should now be enabled
      final saveButtonAfter = tester.widget<FilledButton>(
        find.widgetWithText(FilledButton, 'Sauvegarder'),
      );
      expect(saveButtonAfter.onPressed, isNotNull);
    });

    testWidgets('success shows snackbar and empty state', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container
          .read(conflictNotifierProvider.notifier)
          .addConflict(_makeConflict());

      await tester.pumpWidget(_buildTestWidget(container));

      await tester.tap(find.text('Garder ma version'));
      await tester.pump();

      // Snackbar shown
      expect(find.text('Conflit resolu'), findsOneWidget);

      // After state update, empty state shown
      await tester.pumpAndSettle();
      expect(find.text('Aucun conflit'), findsOneWidget);
    });

    testWidgets('empty list shows empty state', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(_buildTestWidget(container));

      expect(find.text('Aucun conflit'), findsOneWidget);
      expect(find.byIcon(Icons.check_circle_outline), findsOneWidget);
    });

    testWidgets('conflict count shown in header', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(conflictNotifierProvider.notifier);
      notifier.addConflict(_makeConflict(id: 'c1'));
      notifier.addConflict(_makeConflict(id: 'c2', entityLabel: 'Martin Paul'));

      await tester.pumpWidget(_buildTestWidget(container));

      expect(find.text('Conflits (2)'), findsOneWidget);
    });
  });
}
