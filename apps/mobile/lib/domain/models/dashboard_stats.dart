import 'package:freezed_annotation/freezed_annotation.dart';

part 'dashboard_stats.freezed.dart';
part 'dashboard_stats.g.dart';

@freezed
abstract class DashboardStats with _$DashboardStats {
  const factory DashboardStats({
    @Default(0) int clientsTotal,
    @Default(0) int chantiersEnCours,
    @Default(0) int devisEnAttente,
    @Default(0) int facturesImpayees,
    @Default(0.0) double caMois,
    @Default(0.0) double caAnnee,
  }) = _DashboardStats;

  factory DashboardStats.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsFromJson(json);
}
