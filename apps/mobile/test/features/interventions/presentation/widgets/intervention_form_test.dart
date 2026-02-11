import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/intervention_form.dart';

Widget _wrap(Widget child) => MaterialApp(
      home: Scaffold(body: SizedBox(height: 900, child: child)),
    );

List<Chantier> _testChantiers() => [
      Chantier(
        id: 'ch1',
        clientId: 'c1',
        adresse: '1 rue du Parc',
        codePostal: '49000',
        ville: 'Angers',
        description: 'Amenagement jardin',
        statut: ChantierStatut.enCours,
        typePrestation: [],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      ),
      Chantier(
        id: 'ch2',
        clientId: 'c2',
        adresse: '5 avenue Pasteur',
        codePostal: '49100',
        ville: 'Angers',
        description: 'Elagage',
        statut: ChantierStatut.planifie,
        typePrestation: [],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      ),
    ];

Intervention _testIntervention() => Intervention(
      id: 'i1',
      chantierId: 'ch1',
      employeId: 'emp1',
      date: DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      heureFin: DateTime(2026, 2, 10, 12, 0),
      dureeMinutes: 240,
      description: 'Tonte pelouse',
      notes: 'RAS',
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Future<void> _scrollToSubmit(WidgetTester tester) async {
  await tester.dragUntilVisible(
    find.byType(FilledButton),
    find.byType(ListView),
    const Offset(0, -100),
  );
  await tester.pumpAndSettle();
}

void main() {
  group('InterventionForm', () {
    testWidgets('chantier dropdown avec options', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionForm(chantiers: _testChantiers(), onSubmit: (_) {}),
      ));

      expect(find.text('Chantier *'), findsOneWidget);
      await tester.tap(find.byType(DropdownButtonFormField<String>));
      await tester.pumpAndSettle();

      expect(find.text('Amenagement jardin'), findsWidgets);
      expect(find.text('Elagage'), findsWidgets);
    });

    testWidgets('champs date, heure debut, duree visibles', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionForm(chantiers: _testChantiers(), onSubmit: (_) {}),
      ));

      expect(find.text('Date *'), findsOneWidget);
      expect(find.text('Heure de debut *'), findsOneWidget);
      expect(find.text('Heure de fin'), findsOneWidget);
      expect(find.text('Duree (minutes)'), findsOneWidget);
    });

    testWidgets('mode creation : champs vides + bouton Creer',
        (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionForm(chantiers: _testChantiers(), onSubmit: (_) {}),
      ));

      expect(find.text('Tonte pelouse'), findsNothing);
      await _scrollToSubmit(tester);
      expect(find.text('Creer'), findsOneWidget);
    });

    testWidgets('mode edition : pre-remplissage + bouton Modifier',
        (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionForm(
          intervention: _testIntervention(),
          chantiers: _testChantiers(),
          onSubmit: (_) {},
        ),
      ));

      expect(find.text('Tonte pelouse'), findsOneWidget);
      expect(find.text('RAS'), findsOneWidget);

      await _scrollToSubmit(tester);
      expect(find.text('Modifier'), findsOneWidget);
    });

    testWidgets('validation chantier requis', (tester) async {
      await tester.pumpWidget(_wrap(
        InterventionForm(chantiers: _testChantiers(), onSubmit: (_) {}),
      ));

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // Scroll back to see validation error
      await tester.drag(find.byType(ListView), const Offset(0, 500));
      await tester.pumpAndSettle();

      expect(find.text('Ce champ est requis'), findsWidgets);
    });
  });
}
