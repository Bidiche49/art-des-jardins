import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/facture_statut.dart';
import '../enums/mode_paiement.dart';

part 'facture.freezed.dart';
part 'facture.g.dart';

@freezed
abstract class Facture with _$Facture {
  const factory Facture({
    required String id,
    required String devisId,
    required String numero,
    required DateTime dateEmission,
    required DateTime dateEcheance,
    DateTime? datePaiement,
    required double totalHT,
    required double totalTVA,
    required double totalTTC,
    @Default(FactureStatut.brouillon) FactureStatut statut,
    ModePaiement? modePaiement,
    String? referencePaiement,
    String? pdfUrl,
    String? mentionsLegales,
    String? notes,
    DateTime? deletedAt,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Facture;

  factory Facture.fromJson(Map<String, dynamic> json) =>
      _$FactureFromJson(json);
}
