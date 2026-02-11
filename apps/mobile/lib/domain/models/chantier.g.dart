// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chantier.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Chantier _$ChantierFromJson(Map<String, dynamic> json) => _Chantier(
  id: json['id'] as String,
  clientId: json['clientId'] as String,
  adresse: json['adresse'] as String,
  codePostal: json['codePostal'] as String,
  ville: json['ville'] as String,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  typePrestation:
      (json['typePrestation'] as List<dynamic>?)
          ?.map((e) => $enumDecode(_$TypePrestationEnumMap, e))
          .toList() ??
      const [],
  description: json['description'] as String,
  surface: (json['surface'] as num?)?.toDouble(),
  statut:
      $enumDecodeNullable(_$ChantierStatutEnumMap, json['statut']) ??
      ChantierStatut.lead,
  dateVisite: json['dateVisite'] == null
      ? null
      : DateTime.parse(json['dateVisite'] as String),
  dateDebut: json['dateDebut'] == null
      ? null
      : DateTime.parse(json['dateDebut'] as String),
  dateFin: json['dateFin'] == null
      ? null
      : DateTime.parse(json['dateFin'] as String),
  responsableId: json['responsableId'] as String?,
  notes: json['notes'] as String?,
  photos:
      (json['photos'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$ChantierToJson(_Chantier instance) => <String, dynamic>{
  'id': instance.id,
  'clientId': instance.clientId,
  'adresse': instance.adresse,
  'codePostal': instance.codePostal,
  'ville': instance.ville,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'typePrestation': instance.typePrestation
      .map((e) => _$TypePrestationEnumMap[e]!)
      .toList(),
  'description': instance.description,
  'surface': instance.surface,
  'statut': _$ChantierStatutEnumMap[instance.statut]!,
  'dateVisite': instance.dateVisite?.toIso8601String(),
  'dateDebut': instance.dateDebut?.toIso8601String(),
  'dateFin': instance.dateFin?.toIso8601String(),
  'responsableId': instance.responsableId,
  'notes': instance.notes,
  'photos': instance.photos,
  'deletedAt': instance.deletedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};

const _$TypePrestationEnumMap = {
  TypePrestation.paysagisme: 'paysagisme',
  TypePrestation.entretien: 'entretien',
  TypePrestation.elagage: 'elagage',
  TypePrestation.abattage: 'abattage',
  TypePrestation.tonte: 'tonte',
  TypePrestation.taille: 'taille',
  TypePrestation.autre: 'autre',
};

const _$ChantierStatutEnumMap = {
  ChantierStatut.lead: 'lead',
  ChantierStatut.visitePlanifiee: 'visite_planifiee',
  ChantierStatut.devisEnvoye: 'devis_envoye',
  ChantierStatut.accepte: 'accepte',
  ChantierStatut.planifie: 'planifie',
  ChantierStatut.enCours: 'en_cours',
  ChantierStatut.termine: 'termine',
  ChantierStatut.facture: 'facture',
  ChantierStatut.annule: 'annule',
};
