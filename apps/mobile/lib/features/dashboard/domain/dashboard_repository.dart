import '../../../domain/models/dashboard_stats.dart';
import '../../../domain/models/facture.dart';
import '../../../domain/models/intervention.dart';

abstract class DashboardRepository {
  Future<DashboardStats> getStats();
  Future<List<Intervention>> getUpcomingInterventions({int days = 7});
  Future<List<Facture>> getFacturesImpayees();
  Future<List<double>> getRevenueByMonth(int year);
  Future<Map<String, double>> getRevenueByClient(int year);
}
