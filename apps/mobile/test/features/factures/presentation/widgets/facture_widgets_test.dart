import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/facture_statut.dart';
import 'package:art_et_jardin/domain/models/facture.dart';
import 'package:art_et_jardin/features/factures/presentation/widgets/facture_card.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

Facture _testFacture({
  FactureStatut statut = FactureStatut.envoyee,
  double totalTTC = 1200,
  DateTime? dateEcheance,
}) =>
    Facture(
      id: 'fac-1',
      devisId: 'devis-1',
      numero: 'FAC-2026-001',
      dateEmission: DateTime(2026, 1, 15),
      dateEcheance: dateEcheance ?? DateTime(2027, 2, 15),
      totalHT: 1000,
      totalTVA: 200,
      totalTTC: totalTTC,
      statut: statut,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  group('FactureCard', () {
    testWidgets('affiche numero et montant TTC', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(facture: _testFacture())));
      expect(find.text('FAC-2026-001'), findsOneWidget);
      expect(find.textContaining('1200.00'), findsOneWidget);
    });

    testWidgets('affiche date emission', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(facture: _testFacture())));
      expect(find.text('15/01/2026'), findsOneWidget);
    });

    testWidgets('badge envoyee affiche', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(facture: _testFacture())));
      expect(find.textContaining('Envoy'), findsOneWidget);
    });

    testWidgets('badge payee affiche', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(
          facture: _testFacture(statut: FactureStatut.payee))));
      expect(find.textContaining('Pay'), findsOneWidget);
    });

    testWidgets('badge retard rouge sur facture en retard', (tester) async {
      // Date echeance dans le passe, statut envoyee
      await tester.pumpWidget(_wrap(FactureCard(
        facture: _testFacture(
          statut: FactureStatut.envoyee,
          dateEcheance: DateTime(2025, 1, 1),
        ),
      )));
      expect(find.text('Retard'), findsOneWidget);
    });

    testWidgets('pas de badge retard si payee', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(
        facture: _testFacture(
          statut: FactureStatut.payee,
          dateEcheance: DateTime(2025, 1, 1),
        ),
      )));
      expect(find.text('Retard'), findsNothing);
    });

    testWidgets('pas de badge retard si annulee', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(
        facture: _testFacture(
          statut: FactureStatut.annulee,
          dateEcheance: DateTime(2025, 1, 1),
        ),
      )));
      expect(find.text('Retard'), findsNothing);
    });

    testWidgets('montant formate en EUR', (tester) async {
      await tester.pumpWidget(
          _wrap(FactureCard(facture: _testFacture(totalTTC: 1500.50))));
      expect(find.textContaining('1500.50'), findsOneWidget);
      expect(find.textContaining('\u20ac'), findsWidgets);
    });

    testWidgets('tap appelle onTap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(_wrap(
          FactureCard(facture: _testFacture(), onTap: () => tapped = true)));
      await tester.tap(find.byType(FactureCard));
      expect(tapped, true);
    });

    testWidgets('icone chevron visible', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(facture: _testFacture())));
      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });

    testWidgets('icone receipt visible', (tester) async {
      await tester.pumpWidget(_wrap(FactureCard(facture: _testFacture())));
      expect(find.byIcon(Icons.receipt_long_outlined), findsOneWidget);
    });
  });
}
