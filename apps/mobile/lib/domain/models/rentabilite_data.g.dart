// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'rentabilite_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RentabiliteData _$RentabiliteDataFromJson(Map<String, dynamic> json) =>
    _RentabiliteData(
      chantierId: json['chantierId'] as String,
      totalHeures: (json['totalHeures'] as num?)?.toDouble() ?? 0.0,
      coutMainOeuvre: (json['coutMainOeuvre'] as num?)?.toDouble() ?? 0.0,
      totalMateriel: (json['totalMateriel'] as num?)?.toDouble() ?? 0.0,
      totalDevis: (json['totalDevis'] as num?)?.toDouble() ?? 0.0,
      marge: (json['marge'] as num?)?.toDouble() ?? 0.0,
      margePercent: (json['margePercent'] as num?)?.toDouble() ?? 0.0,
    );

Map<String, dynamic> _$RentabiliteDataToJson(_RentabiliteData instance) =>
    <String, dynamic>{
      'chantierId': instance.chantierId,
      'totalHeures': instance.totalHeures,
      'coutMainOeuvre': instance.coutMainOeuvre,
      'totalMateriel': instance.totalMateriel,
      'totalDevis': instance.totalDevis,
      'marge': instance.marge,
      'margePercent': instance.margePercent,
    };
