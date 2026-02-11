// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ligne_devis.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LigneDevis _$LigneDevisFromJson(Map<String, dynamic> json) => _LigneDevis(
  id: json['id'] as String,
  devisId: json['devisId'] as String,
  description: json['description'] as String,
  quantite: (json['quantite'] as num).toDouble(),
  unite: json['unite'] as String,
  prixUnitaireHT: (json['prixUnitaireHT'] as num).toDouble(),
  tva: (json['tva'] as num?)?.toDouble() ?? 20.0,
  montantHT: (json['montantHT'] as num).toDouble(),
  montantTTC: (json['montantTTC'] as num).toDouble(),
  ordre: (json['ordre'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$LigneDevisToJson(_LigneDevis instance) =>
    <String, dynamic>{
      'id': instance.id,
      'devisId': instance.devisId,
      'description': instance.description,
      'quantite': instance.quantite,
      'unite': instance.unite,
      'prixUnitaireHT': instance.prixUnitaireHT,
      'tva': instance.tva,
      'montantHT': instance.montantHT,
      'montantTTC': instance.montantTTC,
      'ordre': instance.ordre,
    };
