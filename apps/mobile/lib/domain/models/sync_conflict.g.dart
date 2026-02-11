// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_conflict.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SyncConflict _$SyncConflictFromJson(Map<String, dynamic> json) =>
    _SyncConflict(
      id: json['id'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      entityLabel: json['entityLabel'] as String,
      localVersion: json['localVersion'] as Map<String, dynamic>,
      serverVersion: json['serverVersion'] as Map<String, dynamic>,
      localTimestamp: DateTime.parse(json['localTimestamp'] as String),
      serverTimestamp: DateTime.parse(json['serverTimestamp'] as String),
      conflictingFields:
          (json['conflictingFields'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      resolvedAt: json['resolvedAt'] == null
          ? null
          : DateTime.parse(json['resolvedAt'] as String),
    );

Map<String, dynamic> _$SyncConflictToJson(_SyncConflict instance) =>
    <String, dynamic>{
      'id': instance.id,
      'entityType': instance.entityType,
      'entityId': instance.entityId,
      'entityLabel': instance.entityLabel,
      'localVersion': instance.localVersion,
      'serverVersion': instance.serverVersion,
      'localTimestamp': instance.localTimestamp.toIso8601String(),
      'serverTimestamp': instance.serverTimestamp.toIso8601String(),
      'conflictingFields': instance.conflictingFields,
      'resolvedAt': instance.resolvedAt?.toIso8601String(),
    };
