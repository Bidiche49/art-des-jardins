// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'absence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Absence _$AbsenceFromJson(Map<String, dynamic> json) => _Absence(
  id: json['id'] as String,
  userId: json['userId'] as String,
  dateDebut: DateTime.parse(json['dateDebut'] as String),
  dateFin: DateTime.parse(json['dateFin'] as String),
  type: $enumDecode(_$AbsenceTypeEnumMap, json['type']),
  motif: json['motif'] as String?,
  validee: json['validee'] as bool? ?? false,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$AbsenceToJson(_Absence instance) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'dateDebut': instance.dateDebut.toIso8601String(),
  'dateFin': instance.dateFin.toIso8601String(),
  'type': _$AbsenceTypeEnumMap[instance.type]!,
  'motif': instance.motif,
  'validee': instance.validee,
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$AbsenceTypeEnumMap = {
  AbsenceType.conge: 'conge',
  AbsenceType.maladie: 'maladie',
  AbsenceType.formation: 'formation',
  AbsenceType.autre: 'autre',
};
