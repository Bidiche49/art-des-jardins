import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/intervention_card.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

Intervention _testIntervention({
  String description = 'Tonte pelouse',
  bool valide = false,
  List<String> photos = const [],
  DateTime? heureFin,
  int? dureeMinutes,
}) =>
    Intervention(
      id: 'i1',
      chantierId: 'ch1',
      employeId: 'emp1',
      date: DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      heureFin: heureFin,
      dureeMinutes: dureeMinutes,
      description: description,
      photos: photos,
      valide: valide,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  group('InterventionCard', () {
    testWidgets('affiche description et badge statut', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(intervention: _testIntervention()),
      ));

      expect(find.text('Tonte pelouse'), findsOneWidget);
      expect(find.text('En cours'), findsOneWidget);
    });

    testWidgets('badge Validee si valide', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(intervention: _testIntervention(valide: true)),
      ));

      expect(find.text('Validee'), findsOneWidget);
    });

    testWidgets('affiche heure debut', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(intervention: _testIntervention()),
      ));

      expect(find.text('08:00'), findsOneWidget);
    });

    testWidgets('affiche plage horaire si heureFin', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(
          intervention: _testIntervention(
            heureFin: DateTime(2026, 2, 10, 12, 0),
          ),
        ),
      ));

      expect(find.text('08:00 - 12:00'), findsOneWidget);
    });

    testWidgets('affiche duree si pas de heureFin', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(
          intervention: _testIntervention(dureeMinutes: 120),
        ),
      ));

      expect(find.text('08:00 (120 min)'), findsOneWidget);
    });

    testWidgets('badge nombre de photos visible', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(
          intervention: _testIntervention(
            photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
          ),
        ),
      ));

      expect(find.text('3'), findsOneWidget);
      expect(find.byIcon(Icons.photo_camera), findsOneWidget);
    });

    testWidgets('pas de badge photo si vide', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(intervention: _testIntervention()),
      ));

      expect(find.byIcon(Icons.photo_camera), findsNothing);
    });

    testWidgets('chevron visible', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionCard(intervention: _testIntervention()),
      ));

      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });

    testWidgets('tap callback', (tester) async {
      var tapped = false;
      await tester.pumpWidget(_wrap(
        InterventionCard(
          intervention: _testIntervention(),
          onTap: () => tapped = true,
        ),
      ));

      await tester.tap(find.byType(InterventionCard));
      expect(tapped, isTrue);
    });
  });
}
