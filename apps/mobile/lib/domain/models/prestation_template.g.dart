// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prestation_template.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PrestationTemplate _$PrestationTemplateFromJson(Map<String, dynamic> json) =>
    _PrestationTemplate(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      category: json['category'] as String,
      unit: json['unit'] as String,
      unitPriceHT: (json['unitPriceHT'] as num).toDouble(),
      tvaRate: (json['tvaRate'] as num?)?.toDouble() ?? 20.0,
      isGlobal: json['isGlobal'] as bool? ?? false,
      createdBy: json['createdBy'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$PrestationTemplateToJson(_PrestationTemplate instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'category': instance.category,
      'unit': instance.unit,
      'unitPriceHT': instance.unitPriceHT,
      'tvaRate': instance.tvaRate,
      'isGlobal': instance.isGlobal,
      'createdBy': instance.createdBy,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
