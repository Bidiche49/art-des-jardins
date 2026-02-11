// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facture.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Facture _$FactureFromJson(Map<String, dynamic> json) => _Facture(
  id: json['id'] as String,
  devisId: json['devisId'] as String,
  numero: json['numero'] as String,
  dateEmission: DateTime.parse(json['dateEmission'] as String),
  dateEcheance: DateTime.parse(json['dateEcheance'] as String),
  datePaiement: json['datePaiement'] == null
      ? null
      : DateTime.parse(json['datePaiement'] as String),
  totalHT: (json['totalHT'] as num).toDouble(),
  totalTVA: (json['totalTVA'] as num).toDouble(),
  totalTTC: (json['totalTTC'] as num).toDouble(),
  statut:
      $enumDecodeNullable(_$FactureStatutEnumMap, json['statut']) ??
      FactureStatut.brouillon,
  modePaiement: $enumDecodeNullable(
    _$ModePaiementEnumMap,
    json['modePaiement'],
  ),
  referencePaiement: json['referencePaiement'] as String?,
  pdfUrl: json['pdfUrl'] as String?,
  mentionsLegales: json['mentionsLegales'] as String?,
  notes: json['notes'] as String?,
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$FactureToJson(_Facture instance) => <String, dynamic>{
  'id': instance.id,
  'devisId': instance.devisId,
  'numero': instance.numero,
  'dateEmission': instance.dateEmission.toIso8601String(),
  'dateEcheance': instance.dateEcheance.toIso8601String(),
  'datePaiement': instance.datePaiement?.toIso8601String(),
  'totalHT': instance.totalHT,
  'totalTVA': instance.totalTVA,
  'totalTTC': instance.totalTTC,
  'statut': _$FactureStatutEnumMap[instance.statut]!,
  'modePaiement': _$ModePaiementEnumMap[instance.modePaiement],
  'referencePaiement': instance.referencePaiement,
  'pdfUrl': instance.pdfUrl,
  'mentionsLegales': instance.mentionsLegales,
  'notes': instance.notes,
  'deletedAt': instance.deletedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$FactureStatutEnumMap = {
  FactureStatut.brouillon: 'brouillon',
  FactureStatut.envoyee: 'envoyee',
  FactureStatut.payee: 'payee',
  FactureStatut.annulee: 'annulee',
};

const _$ModePaiementEnumMap = {
  ModePaiement.virement: 'virement',
  ModePaiement.cheque: 'cheque',
  ModePaiement.especes: 'especes',
  ModePaiement.carte: 'carte',
};
