import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/enums/type_prestation.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:art_et_jardin/features/chantiers/presentation/widgets/chantier_form.dart';

Widget _wrap(Widget child) => MaterialApp(
      home: Scaffold(body: SizedBox(height: 900, child: child)),
    );

Widget _wrapLarge(Widget child) => MaterialApp(
      home: MediaQuery(
        data: const MediaQueryData(size: Size(400, 1800)),
        child: Scaffold(body: child),
      ),
    );

List<Client> _testClients() => [
      Client(
        id: 'c1',
        type: ClientType.particulier,
        nom: 'Dupont',
        email: 'dupont@test.fr',
        telephone: '0612345678',
        adresse: '1 rue Test',
        codePostal: '49000',
        ville: 'Angers',
        tags: [],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      ),
      Client(
        id: 'c2',
        type: ClientType.professionnel,
        nom: 'Entreprise SA',
        email: 'contact@entreprise.fr',
        telephone: '0698765432',
        adresse: '5 rue Pro',
        codePostal: '49100',
        ville: 'Angers',
        tags: [],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      ),
    ];

Chantier _testChantier() => Chantier(
      id: 'ch1',
      clientId: 'c1',
      adresse: '10 rue du Parc',
      codePostal: '49000',
      ville: 'Angers',
      description: 'Amenagement jardin',
      statut: ChantierStatut.enCours,
      typePrestation: [TypePrestation.paysagisme, TypePrestation.tonte],
      dateDebut: DateTime(2026, 3, 1),
      dateFin: DateTime(2026, 4, 15),
      notes: 'Acces par le portail',
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
  group('ChantierForm', () {
    testWidgets('client dropdown avec options disponibles', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      expect(find.text('Client *'), findsOneWidget);
      // Open dropdown
      await tester.tap(find.byType(DropdownButtonFormField<String>));
      await tester.pumpAndSettle();

      expect(find.text('Dupont'), findsWidgets);
      expect(find.text('Entreprise SA'), findsWidgets);
    });

    testWidgets('multi-select TypePrestation (FilterChips)', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      // Scroll to see prestation chips
      await tester.dragUntilVisible(
        find.text('Types de prestation'),
        find.byType(ListView),
        const Offset(0, -100),
      );
      await tester.pumpAndSettle();

      // All 7 TypePrestation values should be visible
      for (final type in TypePrestation.values) {
        expect(find.widgetWithText(FilterChip, type.label), findsOneWidget);
      }

      // Select "Paysagisme"
      await tester.tap(find.widgetWithText(FilterChip, 'Paysagisme'));
      await tester.pumpAndSettle();

      // Select "Tonte"
      await tester.tap(find.widgetWithText(FilterChip, 'Tonte'));
      await tester.pumpAndSettle();
    });

    testWidgets('validation adresse required', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // Scroll back up to see validation errors
      await tester.drag(find.byType(ListView), const Offset(0, 500));
      await tester.pumpAndSettle();

      expect(find.text('Ce champ est requis'), findsWidgets);
    });

    testWidgets('9 statuts disponibles en mode edition', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(
          chantier: _testChantier(),
          clients: _testClients(),
          onSubmit: (_) {},
        ),
      ));

      // Scroll to statut dropdown
      await tester.dragUntilVisible(
        find.byType(DropdownButtonFormField<ChantierStatut>),
        find.byType(ListView),
        const Offset(0, -100),
      );
      await tester.pumpAndSettle();

      // Open statut dropdown
      await tester.tap(find.byType(DropdownButtonFormField<ChantierStatut>));
      await tester.pumpAndSettle();

      // All 9 statuts should be in the dropdown
      expect(find.text('Lead'), findsWidgets);
      expect(find.text('En cours'), findsWidgets);
      expect(find.text('Terminé'), findsWidgets);
      expect(find.text('Annulé'), findsWidgets);
    });

    testWidgets('statut non visible en mode creation', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      // Scroll through the whole form
      await _scrollToSubmit(tester);

      // No statut dropdown in create mode
      expect(
          find.byType(DropdownButtonFormField<ChantierStatut>), findsNothing);
    });

    testWidgets('mode creation : champs vides + bouton Creer', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      expect(find.text('Amenagement jardin'), findsNothing);

      await _scrollToSubmit(tester);
      expect(find.text('Creer'), findsOneWidget);
    });

    testWidgets('mode edition : pre-remplissage + bouton Modifier',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(
          chantier: _testChantier(),
          clients: _testClients(),
          onSubmit: (_) {},
        ),
      ));

      expect(find.text('Amenagement jardin'), findsOneWidget);
      expect(find.text('10 rue du Parc'), findsOneWidget);

      await _scrollToSubmit(tester);
      expect(find.text('Modifier'), findsOneWidget);
    });

    testWidgets('formulaire valide -> submit OK', (tester) async {
      Chantier? submitted;
      await tester.pumpWidget(_wrapLarge(
        ChantierForm(
          clients: _testClients(),
          onSubmit: (c) => submitted = c,
        ),
      ));

      // Select client from dropdown
      await tester.tap(find.byType(DropdownButtonFormField<String>));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Dupont').last);
      await tester.pumpAndSettle();

      // Fill description
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Description *'),
          'Amenagement complet');

      // Fill adresse
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Adresse *'), '1 rue Test');

      // Scroll to code postal
      await tester.dragUntilVisible(
        find.widgetWithText(TextFormField, 'Code postal *'),
        find.byType(ListView),
        const Offset(0, -100),
      );
      await tester.pumpAndSettle();

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Code postal *'), '49000');
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Ville *'), 'Angers');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(submitted, isNotNull);
      expect(submitted!.description, 'Amenagement complet');
      expect(submitted!.clientId, 'c1');
    });

    testWidgets('validation code postal invalide', (tester) async {
      await tester.pumpWidget(_wrap(
        ChantierForm(clients: _testClients(), onSubmit: (_) {}),
      ));

      // Scroll to code postal
      await tester.dragUntilVisible(
        find.widgetWithText(TextFormField, 'Code postal *'),
        find.byType(ListView),
        const Offset(0, -100),
      );
      await tester.pumpAndSettle();

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Code postal *'), '123');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.textContaining('5 chiffres'), findsOneWidget);
    });
  });
}
