// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'devis.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Devis _$DevisFromJson(Map<String, dynamic> json) => _Devis(
  id: json['id'] as String,
  chantierId: json['chantierId'] as String,
  numero: json['numero'] as String,
  dateEmission: DateTime.parse(json['dateEmission'] as String),
  dateValidite: DateTime.parse(json['dateValidite'] as String),
  totalHT: (json['totalHT'] as num).toDouble(),
  totalTVA: (json['totalTVA'] as num).toDouble(),
  totalTTC: (json['totalTTC'] as num).toDouble(),
  statut:
      $enumDecodeNullable(_$DevisStatutEnumMap, json['statut']) ??
      DevisStatut.brouillon,
  dateAcceptation: json['dateAcceptation'] == null
      ? null
      : DateTime.parse(json['dateAcceptation'] as String),
  signatureClient: json['signatureClient'] as String?,
  pdfUrl: json['pdfUrl'] as String?,
  conditionsParticulieres: json['conditionsParticulieres'] as String?,
  notes: json['notes'] as String?,
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$DevisToJson(_Devis instance) => <String, dynamic>{
  'id': instance.id,
  'chantierId': instance.chantierId,
  'numero': instance.numero,
  'dateEmission': instance.dateEmission.toIso8601String(),
  'dateValidite': instance.dateValidite.toIso8601String(),
  'totalHT': instance.totalHT,
  'totalTVA': instance.totalTVA,
  'totalTTC': instance.totalTTC,
  'statut': _$DevisStatutEnumMap[instance.statut]!,
  'dateAcceptation': instance.dateAcceptation?.toIso8601String(),
  'signatureClient': instance.signatureClient,
  'pdfUrl': instance.pdfUrl,
  'conditionsParticulieres': instance.conditionsParticulieres,
  'notes': instance.notes,
  'deletedAt': instance.deletedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$DevisStatutEnumMap = {
  DevisStatut.brouillon: 'brouillon',
  DevisStatut.envoye: 'envoye',
  DevisStatut.signe: 'signe',
  DevisStatut.accepte: 'accepte',
  DevisStatut.refuse: 'refuse',
  DevisStatut.expire: 'expire',
};
