// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'photo.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Photo _$PhotoFromJson(Map<String, dynamic> json) => _Photo(
  id: json['id'] as String,
  interventionId: json['interventionId'] as String,
  type: $enumDecode(_$PhotoTypeEnumMap, json['type']),
  filename: json['filename'] as String,
  s3Key: json['s3Key'] as String,
  mimeType: json['mimeType'] as String,
  size: (json['size'] as num).toInt(),
  width: (json['width'] as num).toInt(),
  height: (json['height'] as num).toInt(),
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  takenAt: DateTime.parse(json['takenAt'] as String),
  uploadedAt: DateTime.parse(json['uploadedAt'] as String),
  uploadedBy: json['uploadedBy'] as String,
);

Map<String, dynamic> _$PhotoToJson(_Photo instance) => <String, dynamic>{
  'id': instance.id,
  'interventionId': instance.interventionId,
  'type': _$PhotoTypeEnumMap[instance.type]!,
  'filename': instance.filename,
  's3Key': instance.s3Key,
  'mimeType': instance.mimeType,
  'size': instance.size,
  'width': instance.width,
  'height': instance.height,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'takenAt': instance.takenAt.toIso8601String(),
  'uploadedAt': instance.uploadedAt.toIso8601String(),
  'uploadedBy': instance.uploadedBy,
};

const _$PhotoTypeEnumMap = {
  PhotoType.before: 'BEFORE',
  PhotoType.during: 'DURING',
  PhotoType.after: 'AFTER',
};
