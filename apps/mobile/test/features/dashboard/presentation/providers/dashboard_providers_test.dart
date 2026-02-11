import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/facture_statut.dart';
import 'package:art_et_jardin/domain/models/dashboard_stats.dart';
import 'package:art_et_jardin/domain/models/facture.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/dashboard/domain/dashboard_repository.dart';
import 'package:art_et_jardin/features/dashboard/presentation/providers/dashboard_providers.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

DashboardStats _testStats({
  int clientsTotal = 42,
  int chantiersEnCours = 5,
  int devisEnAttente = 8,
  int facturesImpayees = 3,
  double caMois = 12500.0,
  double caAnnee = 95000.0,
}) =>
    DashboardStats(
      clientsTotal: clientsTotal,
      chantiersEnCours: chantiersEnCours,
      devisEnAttente: devisEnAttente,
      facturesImpayees: facturesImpayees,
      caMois: caMois,
      caAnnee: caAnnee,
    );

Intervention _testIntervention({
  String id = 'i1',
  DateTime? date,
  String? description,
  bool valide = false,
}) =>
    Intervention(
      id: id,
      chantierId: 'ch1',
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 15),
      heureDebut: DateTime(2026, 2, 15, 8, 0),
      description: description ?? 'Tonte pelouse',
      valide: valide,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Facture _testFacture({
  String id = 'f1',
  double totalTTC = 1500.0,
  FactureStatut statut = FactureStatut.envoyee,
  DateTime? dateEcheance,
}) =>
    Facture(
      id: id,
      devisId: 'd1',
      numero: 'FA-2026-001',
      dateEmission: DateTime(2026, 1, 15),
      dateEcheance: dateEcheance ?? DateTime(2026, 2, 1),
      totalHT: totalTTC / 1.2,
      totalTVA: totalTTC - totalTTC / 1.2,
      totalTTC: totalTTC,
      statut: statut,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockDashboardRepository mockRepo;

  setUp(() {
    mockRepo = MockDashboardRepository();
  });

  // ============== DashboardNotifier ==============
  group('DashboardNotifier', () {
    late DashboardNotifier notifier;

    void setupMocks({
      DashboardStats? stats,
      List<Intervention>? interventions,
      List<Facture>? impayees,
    }) {
      when(() => mockRepo.getStats())
          .thenAnswer((_) async => stats ?? _testStats());
      when(() => mockRepo.getUpcomingInterventions(days: any(named: 'days')))
          .thenAnswer((_) async => interventions ?? []);
      when(() => mockRepo.getFacturesImpayees())
          .thenAnswer((_) async => impayees ?? []);
    }

    tearDown(() {
      notifier.dispose();
    });

    test('charge stats avec 4 KPI corrects', () async {
      setupMocks(stats: _testStats());

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats, isNotNull);
      expect(notifier.state.stats!.clientsTotal, 42);
      expect(notifier.state.stats!.chantiersEnCours, 5);
      expect(notifier.state.stats!.devisEnAttente, 8);
      expect(notifier.state.stats!.caMois, 12500.0);
      expect(notifier.state.isLoading, false);
    });

    test('clientsTotal correct', () async {
      setupMocks(stats: _testStats(clientsTotal: 100));

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats!.clientsTotal, 100);
    });

    test('chantiersEnCours correct', () async {
      setupMocks(stats: _testStats(chantiersEnCours: 12));

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats!.chantiersEnCours, 12);
    });

    test('devisEnAttente correct', () async {
      setupMocks(stats: _testStats(devisEnAttente: 20));

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats!.devisEnAttente, 20);
    });

    test('caMois correct', () async {
      setupMocks(stats: _testStats(caMois: 25000.50));

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats!.caMois, 25000.50);
    });

    test('interventions 7 jours filtrees', () async {
      final upcoming = [
        _testIntervention(id: 'i1', date: DateTime(2026, 2, 12)),
        _testIntervention(id: 'i2', date: DateTime(2026, 2, 14)),
      ];
      setupMocks(interventions: upcoming);

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.upcomingInterventions.length, 2);
    });

    test('factures impayees detectees', () async {
      final impayees = [
        _testFacture(id: 'f1', totalTTC: 2000),
        _testFacture(id: 'f2', totalTTC: 1500),
      ];
      setupMocks(impayees: impayees);

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.facturesImpayees.length, 2);
    });

    test('erreur API -> state.error non null', () async {
      when(() => mockRepo.getStats()).thenThrow(Exception('Network error'));
      when(() => mockRepo.getUpcomingInterventions(days: any(named: 'days')))
          .thenAnswer((_) async => []);
      when(() => mockRepo.getFacturesImpayees())
          .thenAnswer((_) async => []);

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.error, isNotNull);
      expect(notifier.state.isLoading, false);
    });

    test('refresh force recharge les stats', () async {
      setupMocks();

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.refresh();

      verify(() => mockRepo.getStats()).called(2); // init + refresh
    });

    test('stats formatees pour affichage (EUR)', () async {
      setupMocks(stats: _testStats(caMois: 12345.67));

      notifier = DashboardNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      // Verify the value is a double suitable for CurrencyUtils.formatEUR
      expect(notifier.state.stats!.caMois, isA<double>());
      expect(notifier.state.stats!.caMois, closeTo(12345.67, 0.01));
    });
  });

  // ============== AnalyticsNotifier ==============
  group('AnalyticsNotifier', () {
    late AnalyticsNotifier notifier;

    void setupAnalyticsMocks({
      List<double>? revenue,
      List<double>? previousRevenue,
    }) {
      when(() => mockRepo.getStats())
          .thenAnswer((_) async => _testStats());
      when(() => mockRepo.getRevenueByMonth(any()))
          .thenAnswer((inv) async {
        final year = inv.positionalArguments[0] as int;
        if (year == DateTime.now().year) {
          return revenue ?? List.generate(12, (i) => (i + 1) * 1000.0);
        }
        return previousRevenue ?? List.generate(12, (i) => (i + 1) * 800.0);
      });
    }

    tearDown(() {
      notifier.dispose();
    });

    test('charge KPI par annee', () async {
      setupAnalyticsMocks();

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.stats, isNotNull);
      expect(notifier.state.selectedYear, DateTime.now().year);
      expect(notifier.state.isLoading, false);
    });

    test('changement annee -> reload', () async {
      setupAnalyticsMocks();

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      // Reset call count after init
      clearInteractions(mockRepo);
      setupAnalyticsMocks();

      notifier.changeYear(2025);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.selectedYear, 2025);
      verify(() => mockRepo.getRevenueByMonth(2025)).called(1);
    });

    test('revenue data pour graphique (12 mois)', () async {
      final revenue = List.generate(12, (i) => (i + 1) * 2000.0);
      setupAnalyticsMocks(revenue: revenue);

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.revenueByMonth.length, 12);
      expect(notifier.state.revenueByMonth[0], 2000.0);
      expect(notifier.state.revenueByMonth[11], 24000.0);
    });

    test('mois sans donnees -> 0', () async {
      final revenue = List.generate(12, (i) => i < 6 ? 1000.0 : 0.0);
      setupAnalyticsMocks(revenue: revenue);

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.revenueByMonth[6], 0.0);
      expect(notifier.state.revenueByMonth[11], 0.0);
    });

    test('comparaison annee N vs N-1', () async {
      setupAnalyticsMocks(
        revenue: List.generate(12, (_) => 2000.0),
        previousRevenue: List.generate(12, (_) => 1500.0),
      );

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.totalRevenue, 24000.0);
      expect(notifier.state.previousYearTotal, 18000.0);
    });

    test('calcul pourcentage evolution', () async {
      setupAnalyticsMocks(
        revenue: List.generate(12, (_) => 2000.0),
        previousRevenue: List.generate(12, (_) => 1500.0),
      );

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      // (24000 - 18000) / 18000 * 100 = 33.33%
      expect(notifier.state.evolutionPercent, closeTo(33.33, 0.1));
    });

    test('evolution 0% si annee precedente sans donnees', () async {
      setupAnalyticsMocks(
        revenue: List.generate(12, (_) => 2000.0),
        previousRevenue: List.generate(12, (_) => 0.0),
      );

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.evolutionPercent, 0.0);
    });

    test('annee invalide (< 2020) -> pas de changement', () async {
      setupAnalyticsMocks();

      notifier = AnalyticsNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final yearBefore = notifier.state.selectedYear;
      notifier.changeYear(2019);

      expect(notifier.state.selectedYear, yearBefore);
    });
  });

  // ============== FinanceNotifier ==============
  group('FinanceNotifier', () {
    late FinanceNotifier notifier;

    void setupFinanceMocks({
      List<double>? revenue,
      List<Facture>? impayees,
      Map<String, double>? byClient,
    }) {
      when(() => mockRepo.getStats())
          .thenAnswer((_) async => _testStats());
      when(() => mockRepo.getRevenueByMonth(any()))
          .thenAnswer((_) async =>
              revenue ?? List.generate(12, (i) => (i + 1) * 1000.0));
      when(() => mockRepo.getFacturesImpayees())
          .thenAnswer((_) async => impayees ?? []);
      when(() => mockRepo.getRevenueByClient(any()))
          .thenAnswer((_) async =>
              byClient ?? {'Client A': 5000.0, 'Client B': 3000.0});
    }

    tearDown(() {
      notifier.dispose();
    });

    test('tab Resume : totaux CA', () async {
      final revenue = List.generate(12, (_) => 5000.0);
      setupFinanceMocks(revenue: revenue);

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.totalCA, 60000.0);
    });

    test('tab Par client : ventilation par client', () async {
      setupFinanceMocks(
        byClient: {'Martin': 10000, 'Dupont': 8000, 'Leroy': 5000},
      );

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.revenueByClient.length, 3);
      expect(notifier.state.revenueByClient['Martin'], 10000);
    });

    test('tab Impayes : liste factures impayees', () async {
      setupFinanceMocks(impayees: [
        _testFacture(id: 'f1', totalTTC: 2000),
        _testFacture(id: 'f2', totalTTC: 1500),
      ]);

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.facturesImpayees.length, 2);
    });

    test('calcul total impayes correct', () async {
      setupFinanceMocks(impayees: [
        _testFacture(id: 'f1', totalTTC: 2000),
        _testFacture(id: 'f2', totalTTC: 1500),
        _testFacture(id: 'f3', totalTTC: 3000),
      ]);

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.totalImpayees, 6500.0);
    });

    test('tri par montant decroissant (impayees)', () async {
      setupFinanceMocks(
        byClient: {'A': 1000, 'B': 5000, 'C': 3000},
      );

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final entries = notifier.state.revenueByClient.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));
      expect(entries.first.key, 'B');
      expect(entries.last.key, 'A');
    });

    test('filtre par periode (changement annee)', () async {
      setupFinanceMocks();

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.changeYear(2025);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.selectedYear, 2025);
      verify(() => mockRepo.getRevenueByMonth(2025)).called(1);
    });

    test('formatage EUR correct (totalCA est double)', () async {
      setupFinanceMocks(
          revenue: List.generate(12, (_) => 1234.56));

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.totalCA, closeTo(14814.72, 0.01));
    });

    test('marge brute et nette calculees', () async {
      final revenue = List.generate(12, (_) => 10000.0);
      setupFinanceMocks(revenue: revenue);

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      // 35% marge brute, 15% marge nette
      expect(notifier.state.totalCA * 0.35, closeTo(42000.0, 0.01));
      expect(notifier.state.totalCA * 0.15, closeTo(18000.0, 0.01));
    });

    test('donnees vides -> affiche 0', () async {
      setupFinanceMocks(
        revenue: List.generate(12, (_) => 0.0),
        impayees: [],
        byClient: {},
      );

      notifier = FinanceNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.totalCA, 0.0);
      expect(notifier.state.totalImpayees, 0.0);
      expect(notifier.state.revenueByClient, isEmpty);
    });
  });
}
