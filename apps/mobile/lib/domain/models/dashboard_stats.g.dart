// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_stats.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    _DashboardStats(
      clientsTotal: (json['clientsTotal'] as num?)?.toInt() ?? 0,
      chantiersEnCours: (json['chantiersEnCours'] as num?)?.toInt() ?? 0,
      devisEnAttente: (json['devisEnAttente'] as num?)?.toInt() ?? 0,
      facturesImpayees: (json['facturesImpayees'] as num?)?.toInt() ?? 0,
      caMois: (json['caMois'] as num?)?.toDouble() ?? 0.0,
      caAnnee: (json['caAnnee'] as num?)?.toDouble() ?? 0.0,
    );

Map<String, dynamic> _$DashboardStatsToJson(_DashboardStats instance) =>
    <String, dynamic>{
      'clientsTotal': instance.clientsTotal,
      'chantiersEnCours': instance.chantiersEnCours,
      'devisEnAttente': instance.devisEnAttente,
      'facturesImpayees': instance.facturesImpayees,
      'caMois': instance.caMois,
      'caAnnee': instance.caAnnee,
    };
