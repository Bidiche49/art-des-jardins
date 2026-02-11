import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:art_et_jardin/features/clients/presentation/widgets/client_form.dart';

Widget _wrap(Widget child) => MaterialApp(
      home: Scaffold(body: SizedBox(height: 900, child: child)),
    );

/// Large surface to prevent scroll issues in form tests
Widget _wrapLarge(Widget child) => MaterialApp(
      home: MediaQuery(
        data: const MediaQueryData(size: Size(400, 1400)),
        child: Scaffold(body: child),
      ),
    );

Client _testClient() => Client(
      id: 'c1',
      type: ClientType.particulier,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'dupont@test.fr',
      telephone: '0612345678',
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: 'Angers',
      tags: [],
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
  group('ClientForm', () {
    testWidgets('type selector : 3 chips (particulier/pro/syndic)',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      expect(find.text('Particulier'), findsOneWidget);
      expect(find.text('Professionnel'), findsOneWidget);
      expect(find.text('Syndic'), findsOneWidget);
    });

    testWidgets('particulier selectionne -> champ prenom visible',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      expect(find.text('Prenom'), findsOneWidget);
    });

    testWidgets('particulier selectionne -> champ raisonSociale cache',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      expect(find.text('Raison sociale'), findsNothing);
    });

    testWidgets('pro selectionne -> champ raisonSociale visible',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.tap(find.text('Professionnel'));
      await tester.pumpAndSettle();

      expect(find.text('Raison sociale'), findsOneWidget);
    });

    testWidgets('pro selectionne -> champ prenom cache', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.tap(find.text('Professionnel'));
      await tester.pumpAndSettle();

      expect(find.text('Prenom'), findsNothing);
    });

    testWidgets('syndic selectionne -> champ raisonSociale visible',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.tap(find.text('Syndic'));
      await tester.pumpAndSettle();

      expect(find.text('Raison sociale'), findsOneWidget);
    });

    testWidgets('validation email invalide -> erreur affichee',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Email *'), 'invalid');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.text('Email invalide'), findsOneWidget);
    });

    testWidgets('validation email valide -> pas d\'erreur email',
        (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Email *'), 'test@test.fr');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.text('Email invalide'), findsNothing);
    });

    testWidgets('validation telephone FR invalide -> erreur', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Telephone *'), '123');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.textContaining('invalide'), findsWidgets);
    });

    testWidgets('validation code postal != 5 chars -> erreur', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      // Scroll to code postal first
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

    testWidgets('champs required vides -> erreur', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // Scroll back up to see validation errors
      await tester.drag(find.byType(ListView), const Offset(0, 500));
      await tester.pumpAndSettle();

      expect(find.text('Ce champ est requis'), findsWidgets);
    });

    testWidgets('formulaire valide -> submit OK', (tester) async {
      Client? submitted;
      await tester.pumpWidget(_wrapLarge(
        ClientForm(onSubmit: (c) => submitted = c),
      ));

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Nom *'), 'Dupont');
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Email *'), 'test@test.fr');
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Telephone *'), '0612345678');

      // Scroll to see remaining fields
      await tester.dragUntilVisible(
        find.widgetWithText(TextFormField, 'Adresse *'),
        find.byType(ListView),
        const Offset(0, -100),
      );
      await tester.pumpAndSettle();

      await tester.enterText(
          find.widgetWithText(TextFormField, 'Adresse *'), '1 rue Test');
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Code postal *'), '49000');
      await tester.enterText(
          find.widgetWithText(TextFormField, 'Ville *'), 'Angers');

      await _scrollToSubmit(tester);
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(submitted, isNotNull);
      expect(submitted!.nom, 'Dupont');
      expect(submitted!.type, ClientType.particulier);
    });

    testWidgets('mode edition : pre-remplissage des champs', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(client: _testClient(), onSubmit: (_) {}),
      ));

      expect(find.text('Dupont'), findsOneWidget);
      expect(find.text('Jean'), findsOneWidget);
      expect(find.text('dupont@test.fr'), findsOneWidget);

      await _scrollToSubmit(tester);
      expect(find.text('Modifier'), findsOneWidget);
    });

    testWidgets('mode creation : champs vides', (tester) async {
      await tester.pumpWidget(_wrap(
        ClientForm(onSubmit: (_) {}),
      ));

      await _scrollToSubmit(tester);
      expect(find.text('Creer'), findsOneWidget);
      // No pre-filled values
      expect(find.text('Dupont'), findsNothing);
    });
  });
}
