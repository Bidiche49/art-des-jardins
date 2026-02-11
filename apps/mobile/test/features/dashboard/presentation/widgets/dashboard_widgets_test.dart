import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/facture_statut.dart';
import 'package:art_et_jardin/domain/models/facture.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/dashboard/presentation/widgets/activity_feed.dart';
import 'package:art_et_jardin/features/dashboard/presentation/widgets/chart_widget.dart';
import 'package:art_et_jardin/features/dashboard/presentation/widgets/kpi_card.dart';

Widget _wrap(Widget child, {List<Override> overrides = const []}) {
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      home: Scaffold(body: child),
    ),
  );
}

Intervention _testIntervention({
  String id = 'i1',
  DateTime? date,
  String description = 'Tonte pelouse',
  bool valide = false,
}) =>
    Intervention(
      id: id,
      chantierId: 'ch1',
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 15),
      heureDebut: DateTime(2026, 2, 15, 8, 0),
      description: description,
      valide: valide,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Facture _testFacture({
  String id = 'f1',
  double totalTTC = 1500.0,
  DateTime? dateEcheance,
}) =>
    Facture(
      id: id,
      devisId: 'd1',
      numero: 'FA-2026-001',
      dateEmission: DateTime(2026, 1, 15),
      dateEcheance: dateEcheance ?? DateTime(2026, 1, 1),
      totalHT: totalTTC / 1.2,
      totalTVA: totalTTC - totalTTC / 1.2,
      totalTTC: totalTTC,
      statut: FactureStatut.envoyee,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  // ============== KpiCard ==============
  group('KpiCard', () {
    testWidgets('affiche titre et valeur', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(title: 'Clients', value: '42'),
      ));

      expect(find.text('Clients'), findsOneWidget);
      expect(find.text('42'), findsOneWidget);
    });

    testWidgets('affiche icone si fournie', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(
          title: 'Test',
          value: '10',
          icon: Icons.people,
        ),
      ));

      expect(find.byIcon(Icons.people), findsOneWidget);
    });

    testWidgets('affiche subtitle si fourni', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(
          title: 'CA',
          value: '12 500 EUR',
          subtitle: 'Annee: 95 000 EUR',
        ),
      ));

      expect(find.text('Annee: 95 000 EUR'), findsOneWidget);
    });

    testWidgets('affiche trend positif', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(
          title: 'Evolution',
          value: '+15%',
          trend: 15.0,
        ),
      ));

      expect(find.byIcon(Icons.trending_up), findsOneWidget);
      expect(find.text('+15.0%'), findsOneWidget);
    });

    testWidgets('affiche trend negatif', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(
          title: 'Evolution',
          value: '-5%',
          trend: -5.0,
        ),
      ));

      expect(find.byIcon(Icons.trending_down), findsOneWidget);
    });
  });

  // ============== UpcomingInterventionsList ==============
  group('UpcomingInterventionsList', () {
    testWidgets('affiche message si aucune intervention', (tester) async {
      await tester.pumpWidget(_wrap(
        const UpcomingInterventionsList(interventions: []),
      ));

      expect(find.text('Aucune intervention prevue'), findsOneWidget);
    });

    testWidgets('affiche liste interventions', (tester) async {
      await tester.pumpWidget(_wrap(
        UpcomingInterventionsList(interventions: [
          _testIntervention(id: 'i1', description: 'Tonte'),
          _testIntervention(id: 'i2', description: 'Elagage'),
        ]),
      ));

      expect(find.text('Tonte'), findsOneWidget);
      expect(find.text('Elagage'), findsOneWidget);
    });

    testWidgets('badge Valide pour intervention validee', (tester) async {
      await tester.pumpWidget(_wrap(
        UpcomingInterventionsList(interventions: [
          _testIntervention(valide: true),
        ]),
      ));

      expect(find.text('Valide'), findsOneWidget);
    });

    testWidgets('badge En cours pour intervention non validee', (tester) async {
      await tester.pumpWidget(_wrap(
        UpcomingInterventionsList(interventions: [
          _testIntervention(valide: false),
        ]),
      ));

      expect(find.text('En cours'), findsOneWidget);
    });
  });

  // ============== ImpayeesAlert ==============
  group('ImpayeesAlert', () {
    testWidgets('invisible si aucune impayee', (tester) async {
      await tester.pumpWidget(_wrap(
        const ImpayeesAlert(factures: []),
      ));

      expect(find.byType(ImpayeesAlert), findsOneWidget);
      expect(find.byIcon(Icons.warning_amber_rounded), findsNothing);
    });

    testWidgets('affiche alerte si impayees > 0', (tester) async {
      await tester.pumpWidget(_wrap(
        ImpayeesAlert(factures: [
          _testFacture(id: 'f1', totalTTC: 2000),
          _testFacture(id: 'f2', totalTTC: 1500),
        ]),
      ));

      expect(find.byIcon(Icons.warning_amber_rounded), findsOneWidget);
      expect(find.text('2 factures impayees'), findsOneWidget);
    });

    testWidgets('affiche total EUR', (tester) async {
      await tester.pumpWidget(_wrap(
        ImpayeesAlert(factures: [
          _testFacture(id: 'f1', totalTTC: 2000),
        ]),
      ));

      expect(find.textContaining('2'), findsWidgets);
    });
  });

  // ============== RevenueBarChart ==============
  group('RevenueBarChart', () {
    testWidgets('affiche graphique avec 12 mois', (tester) async {
      await tester.pumpWidget(_wrap(
        RevenueBarChart(
          data: List.generate(12, (i) => (i + 1) * 1000.0),
        ),
      ));

      // The chart should render without errors
      expect(find.byType(RevenueBarChart), findsOneWidget);
    });

    testWidgets('gere donnees vides (tout a 0)', (tester) async {
      await tester.pumpWidget(_wrap(
        RevenueBarChart(
          data: List.generate(12, (_) => 0.0),
        ),
      ));

      expect(find.byType(RevenueBarChart), findsOneWidget);
    });
  });

  // ============== Montants formatage ==============
  group('Formatage', () {
    testWidgets('montants EUR dans KpiCard', (tester) async {
      await tester.pumpWidget(_wrap(
        const KpiCard(
          title: 'CA',
          value: '12 345,67 EUR',
        ),
      ));

      expect(find.textContaining('EUR'), findsOneWidget);
    });
  });
}
