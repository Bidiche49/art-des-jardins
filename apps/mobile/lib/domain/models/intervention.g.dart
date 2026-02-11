// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intervention.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Intervention _$InterventionFromJson(Map<String, dynamic> json) =>
    _Intervention(
      id: json['id'] as String,
      chantierId: json['chantierId'] as String,
      employeId: json['employeId'] as String,
      date: DateTime.parse(json['date'] as String),
      heureDebut: DateTime.parse(json['heureDebut'] as String),
      heureFin: json['heureFin'] == null
          ? null
          : DateTime.parse(json['heureFin'] as String),
      dureeMinutes: (json['dureeMinutes'] as num?)?.toInt(),
      description: json['description'] as String?,
      photos:
          (json['photos'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      notes: json['notes'] as String?,
      valide: json['valide'] as bool? ?? false,
      externalCalendarEventId: json['externalCalendarEventId'] as String?,
      deletedAt: json['deletedAt'] == null
          ? null
          : DateTime.parse(json['deletedAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$InterventionToJson(_Intervention instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chantierId': instance.chantierId,
      'employeId': instance.employeId,
      'date': instance.date.toIso8601String(),
      'heureDebut': instance.heureDebut.toIso8601String(),
      'heureFin': instance.heureFin?.toIso8601String(),
      'dureeMinutes': instance.dureeMinutes,
      'description': instance.description,
      'photos': instance.photos,
      'notes': instance.notes,
      'valide': instance.valide,
      'externalCalendarEventId': instance.externalCalendarEventId,
      'deletedAt': instance.deletedAt?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
