// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'client.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Client _$ClientFromJson(Map<String, dynamic> json) => _Client(
  id: json['id'] as String,
  type: $enumDecode(_$ClientTypeEnumMap, json['type']),
  nom: json['nom'] as String,
  prenom: json['prenom'] as String?,
  raisonSociale: json['raisonSociale'] as String?,
  email: json['email'] as String,
  telephone: json['telephone'] as String,
  telephoneSecondaire: json['telephoneSecondaire'] as String?,
  adresse: json['adresse'] as String,
  codePostal: json['codePostal'] as String,
  ville: json['ville'] as String,
  notes: json['notes'] as String?,
  tags:
      (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ClientToJson(_Client instance) => <String, dynamic>{
  'id': instance.id,
  'type': _$ClientTypeEnumMap[instance.type]!,
  'nom': instance.nom,
  'prenom': instance.prenom,
  'raisonSociale': instance.raisonSociale,
  'email': instance.email,
  'telephone': instance.telephone,
  'telephoneSecondaire': instance.telephoneSecondaire,
  'adresse': instance.adresse,
  'codePostal': instance.codePostal,
  'ville': instance.ville,
  'notes': instance.notes,
  'tags': instance.tags,
  'deletedAt': instance.deletedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$ClientTypeEnumMap = {
  ClientType.particulier: 'particulier',
  ClientType.professionnel: 'professionnel',
  ClientType.syndic: 'syndic',
};
