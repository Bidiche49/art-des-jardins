import 'package:freezed_annotation/freezed_annotation.dart';

part 'ligne_devis.freezed.dart';
part 'ligne_devis.g.dart';

@freezed
abstract class LigneDevis with _$LigneDevis {
  const factory LigneDevis({
    required String id,
    required String devisId,
    required String description,
    required double quantite,
    required String unite,
    required double prixUnitaireHT,
    @Default(20.0) double tva,
    required double montantHT,
    required double montantTTC,
    @Default(0) int ordre,
  }) = _LigneDevis;

  factory LigneDevis.fromJson(Map<String, dynamic> json) =>
      _$LigneDevisFromJson(json);
}
