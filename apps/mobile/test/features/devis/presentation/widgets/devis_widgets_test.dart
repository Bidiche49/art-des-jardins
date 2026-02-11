import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/devis_statut.dart';
import 'package:art_et_jardin/domain/models/devis.dart';
import 'package:art_et_jardin/domain/models/ligne_devis.dart';
import 'package:art_et_jardin/features/devis/presentation/widgets/devis_card.dart';
import 'package:art_et_jardin/features/devis/presentation/widgets/devis_totaux.dart';
import 'package:art_et_jardin/features/devis/presentation/widgets/ligne_devis_row.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

Devis _testDevis({
  DevisStatut statut = DevisStatut.brouillon,
  double totalTTC = 120,
}) =>
    Devis(
      id: 'devis-1',
      chantierId: 'chantier-1',
      numero: 'DEV-2026-001',
      dateEmission: DateTime(2026, 1, 15),
      dateValidite: DateTime(2026, 2, 14),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: totalTTC,
      statut: statut,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

LigneDevis _testLigne() => const LigneDevis(
      id: 'ligne-1',
      devisId: 'devis-1',
      description: 'Tonte pelouse',
      quantite: 2,
      unite: 'm2',
      prixUnitaireHT: 50,
      tva: 20,
      montantHT: 100,
      montantTTC: 120,
    );

void main() {
  group('DevisCard', () {
    testWidgets('affiche numero et montant TTC', (tester) async {
      await tester.pumpWidget(_wrap(DevisCard(devis: _testDevis())));
      expect(find.text('DEV-2026-001'), findsOneWidget);
      expect(find.textContaining('120.00'), findsOneWidget);
    });

    testWidgets('affiche date emission', (tester) async {
      await tester.pumpWidget(_wrap(DevisCard(devis: _testDevis())));
      expect(find.text('15/01/2026'), findsOneWidget);
    });

    testWidgets('badge brouillon affiche', (tester) async {
      await tester.pumpWidget(_wrap(DevisCard(devis: _testDevis())));
      expect(find.text('Brouillon'), findsOneWidget);
    });

    testWidgets('badge envoye affiche', (tester) async {
      await tester.pumpWidget(
          _wrap(DevisCard(devis: _testDevis(statut: DevisStatut.envoye))));
      expect(find.textContaining('Envoy'), findsOneWidget);
    });

    testWidgets('badge accepte affiche', (tester) async {
      await tester.pumpWidget(
          _wrap(DevisCard(devis: _testDevis(statut: DevisStatut.accepte))));
      expect(find.textContaining('Accept'), findsOneWidget);
    });

    testWidgets('badge refuse affiche', (tester) async {
      await tester.pumpWidget(
          _wrap(DevisCard(devis: _testDevis(statut: DevisStatut.refuse))));
      expect(find.textContaining('Refus'), findsOneWidget);
    });

    testWidgets('tap appelle onTap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
          _wrap(DevisCard(devis: _testDevis(), onTap: () => tapped = true)));
      await tester.tap(find.byType(DevisCard));
      expect(tapped, true);
    });

    testWidgets('icone chevron visible', (tester) async {
      await tester.pumpWidget(_wrap(DevisCard(devis: _testDevis())));
      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });
  });

  group('DevisTotaux', () {
    testWidgets('affiche total HT', (tester) async {
      await tester.pumpWidget(
          _wrap(const DevisTotaux(totalHT: 100, totalTVA: 20, totalTTC: 120)));
      expect(find.text('Total HT'), findsOneWidget);
      // Exact match: "100.00 €"
      expect(find.text('100.00 \u20ac'), findsOneWidget);
    });

    testWidgets('affiche total TVA', (tester) async {
      await tester.pumpWidget(
          _wrap(const DevisTotaux(totalHT: 100, totalTVA: 20, totalTTC: 120)));
      expect(find.text('Total TVA'), findsOneWidget);
      expect(find.text('20.00 \u20ac'), findsOneWidget);
    });

    testWidgets('affiche total TTC', (tester) async {
      await tester.pumpWidget(
          _wrap(const DevisTotaux(totalHT: 100, totalTVA: 20, totalTTC: 120)));
      expect(find.text('Total TTC'), findsOneWidget);
      expect(find.text('120.00 \u20ac'), findsOneWidget);
    });

    testWidgets('totaux 0 quand vide', (tester) async {
      await tester.pumpWidget(
          _wrap(const DevisTotaux(totalHT: 0, totalTVA: 0, totalTTC: 0)));
      expect(find.text('Total HT'), findsOneWidget);
      final texts = find.textContaining('0.00');
      expect(texts, findsWidgets);
    });
  });

  group('LigneDevisRow', () {
    testWidgets('affiche description', (tester) async {
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 0,
        onUpdate: (_, _) {},
        onRemove: (_) {},
      )));
      expect(find.text('Tonte pelouse'), findsOneWidget);
    });

    testWidgets('affiche numero ligne', (tester) async {
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 2,
        onUpdate: (_, _) {},
        onRemove: (_) {},
      )));
      expect(find.text('Ligne 3'), findsOneWidget);
    });

    testWidgets('affiche montant HT', (tester) async {
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 0,
        onUpdate: (_, _) {},
        onRemove: (_) {},
      )));
      expect(find.textContaining('100.00'), findsOneWidget);
    });

    testWidgets('bouton supprimer present', (tester) async {
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 0,
        onUpdate: (_, _) {},
        onRemove: (_) {},
      )));
      expect(find.byIcon(Icons.delete_outline), findsOneWidget);
    });

    testWidgets('tap supprimer appelle onRemove', (tester) async {
      int? removedIndex;
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 0,
        onUpdate: (_, _) {},
        onRemove: (i) => removedIndex = i,
      )));
      await tester.tap(find.byIcon(Icons.delete_outline));
      expect(removedIndex, 0);
    });

    testWidgets('champs quantite/unite/prix/tva presents', (tester) async {
      await tester.pumpWidget(_wrap(LigneDevisRow(
        ligne: _testLigne(),
        index: 0,
        onUpdate: (_, _) {},
        onRemove: (_) {},
      )));
      expect(find.text('Qté'), findsOneWidget);
      expect(find.text('Unité'), findsOneWidget);
      expect(find.text('Prix HT'), findsOneWidget);
      expect(find.text('TVA %'), findsOneWidget);
    });
  });
}
