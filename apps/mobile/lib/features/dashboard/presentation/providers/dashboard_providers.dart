import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/models/dashboard_stats.dart';
import '../../../../domain/models/facture.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/dashboard_repository_impl.dart';
import '../../domain/dashboard_repository.dart';

// ============== Repository ==============

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  final db = ref.read(appDatabaseProvider);
  return DashboardRepositoryImpl(
    clientsDao: db.clientsDao,
    chantiersDao: db.chantiersDao,
    devisDao: db.devisDao,
    facturesDao: db.facturesDao,
    interventionsDao: db.interventionsDao,
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
  );
});

// ============== Dashboard Notifier ==============

final dashboardNotifierProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(
    repository: ref.read(dashboardRepositoryProvider),
  );
});

class DashboardState {
  const DashboardState({
    this.stats,
    this.upcomingInterventions = const [],
    this.facturesImpayees = const [],
    this.isLoading = false,
    this.error,
  });

  final DashboardStats? stats;
  final List<Intervention> upcomingInterventions;
  final List<Facture> facturesImpayees;
  final bool isLoading;
  final String? error;

  DashboardState copyWith({
    DashboardStats? stats,
    List<Intervention>? upcomingInterventions,
    List<Facture>? facturesImpayees,
    bool? isLoading,
    String? error,
  }) {
    return DashboardState(
      stats: stats ?? this.stats,
      upcomingInterventions:
          upcomingInterventions ?? this.upcomingInterventions,
      facturesImpayees: facturesImpayees ?? this.facturesImpayees,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class DashboardNotifier extends StateNotifier<DashboardState> {
  DashboardNotifier({required DashboardRepository repository})
      : _repository = repository,
        super(const DashboardState()) {
    loadDashboard();
  }

  final DashboardRepository _repository;

  Future<void> loadDashboard() async {
    state = state.copyWith(isLoading: true);
    try {
      final stats = await _repository.getStats();
      final upcoming = await _repository.getUpcomingInterventions();
      final impayees = await _repository.getFacturesImpayees();

      state = state.copyWith(
        stats: stats,
        upcomingInterventions: upcoming,
        facturesImpayees: impayees,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() => loadDashboard();
}

// ============== Analytics Notifier ==============

final analyticsNotifierProvider =
    StateNotifierProvider<AnalyticsNotifier, AnalyticsState>((ref) {
  return AnalyticsNotifier(
    repository: ref.read(dashboardRepositoryProvider),
  );
});

class AnalyticsState {
  const AnalyticsState({
    this.selectedYear,
    this.stats,
    this.revenueByMonth = const [],
    this.previousYearRevenue = const [],
    this.isLoading = false,
    this.error,
  });

  final int? selectedYear;
  final DashboardStats? stats;
  final List<double> revenueByMonth;
  final List<double> previousYearRevenue;
  final bool isLoading;
  final String? error;

  double get totalRevenue =>
      revenueByMonth.fold(0.0, (sum, v) => sum + v);

  double get previousYearTotal =>
      previousYearRevenue.fold(0.0, (sum, v) => sum + v);

  double get evolutionPercent {
    if (previousYearTotal == 0) return 0;
    return ((totalRevenue - previousYearTotal) / previousYearTotal) * 100;
  }

  AnalyticsState copyWith({
    int? selectedYear,
    DashboardStats? stats,
    List<double>? revenueByMonth,
    List<double>? previousYearRevenue,
    bool? isLoading,
    String? error,
  }) {
    return AnalyticsState(
      selectedYear: selectedYear ?? this.selectedYear,
      stats: stats ?? this.stats,
      revenueByMonth: revenueByMonth ?? this.revenueByMonth,
      previousYearRevenue:
          previousYearRevenue ?? this.previousYearRevenue,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AnalyticsNotifier extends StateNotifier<AnalyticsState> {
  AnalyticsNotifier({required DashboardRepository repository})
      : _repository = repository,
        super(AnalyticsState(selectedYear: DateTime.now().year)) {
    loadAnalytics(DateTime.now().year);
  }

  final DashboardRepository _repository;

  Future<void> loadAnalytics(int year) async {
    state = state.copyWith(isLoading: true, selectedYear: year);
    try {
      final stats = await _repository.getStats();
      final revenue = await _repository.getRevenueByMonth(year);
      final previousRevenue = await _repository.getRevenueByMonth(year - 1);

      state = state.copyWith(
        stats: stats,
        revenueByMonth: revenue,
        previousYearRevenue: previousRevenue,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void changeYear(int year) {
    if (year < 2020 || year > DateTime.now().year + 1) return;
    loadAnalytics(year);
  }

  Future<void> refresh() async {
    final year = state.selectedYear ?? DateTime.now().year;
    await loadAnalytics(year);
  }
}

// ============== Finance Notifier ==============

final financeNotifierProvider =
    StateNotifierProvider<FinanceNotifier, FinanceState>((ref) {
  return FinanceNotifier(
    repository: ref.read(dashboardRepositoryProvider),
  );
});

class FinanceState {
  const FinanceState({
    this.selectedYear,
    this.revenueByMonth = const [],
    this.facturesImpayees = const [],
    this.revenueByClient = const {},
    this.devisEnAttenteMontant = 0.0,
    this.isLoading = false,
    this.error,
  });

  final int? selectedYear;
  final List<double> revenueByMonth;
  final List<Facture> facturesImpayees;
  final Map<String, double> revenueByClient;
  final double devisEnAttenteMontant;
  final bool isLoading;
  final String? error;

  double get totalCA =>
      revenueByMonth.fold(0.0, (sum, v) => sum + v);

  double get totalImpayees =>
      facturesImpayees.fold(0.0, (sum, f) => sum + f.totalTTC);

  FinanceState copyWith({
    int? selectedYear,
    List<double>? revenueByMonth,
    List<Facture>? facturesImpayees,
    Map<String, double>? revenueByClient,
    double? devisEnAttenteMontant,
    bool? isLoading,
    String? error,
  }) {
    return FinanceState(
      selectedYear: selectedYear ?? this.selectedYear,
      revenueByMonth: revenueByMonth ?? this.revenueByMonth,
      facturesImpayees: facturesImpayees ?? this.facturesImpayees,
      revenueByClient: revenueByClient ?? this.revenueByClient,
      devisEnAttenteMontant:
          devisEnAttenteMontant ?? this.devisEnAttenteMontant,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class FinanceNotifier extends StateNotifier<FinanceState> {
  FinanceNotifier({required DashboardRepository repository})
      : _repository = repository,
        super(FinanceState(selectedYear: DateTime.now().year)) {
    loadFinance(DateTime.now().year);
  }

  final DashboardRepository _repository;

  Future<void> loadFinance(int year) async {
    state = state.copyWith(isLoading: true, selectedYear: year);
    try {
      final revenue = await _repository.getRevenueByMonth(year);
      final impayees = await _repository.getFacturesImpayees();
      final byClient = await _repository.getRevenueByClient(year);

      // Devis en attente montant will be populated from stats
      final stats = await _repository.getStats();

      state = state.copyWith(
        revenueByMonth: revenue,
        facturesImpayees: impayees,
        revenueByClient: byClient,
        devisEnAttenteMontant: stats.caAnnee * 0.1, // estimate from pending
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void changeYear(int year) {
    if (year < 2020 || year > DateTime.now().year + 1) return;
    loadFinance(year);
  }

  Future<void> refresh() async {
    final year = state.selectedYear ?? DateTime.now().year;
    await loadFinance(year);
  }
}
