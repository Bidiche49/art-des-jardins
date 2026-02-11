import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/devis_statut.dart';

part 'devis.freezed.dart';
part 'devis.g.dart';

@freezed
abstract class Devis with _$Devis {
  const factory Devis({
    required String id,
    required String chantierId,
    required String numero,
    required DateTime dateEmission,
    required DateTime dateValidite,
    required double totalHT,
    required double totalTVA,
    required double totalTTC,
    @Default(DevisStatut.brouillon) DevisStatut statut,
    DateTime? dateAcceptation,
    String? signatureClient,
    String? pdfUrl,
    String? conditionsParticulieres,
    String? notes,
    DateTime? deletedAt,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Devis;

  factory Devis.fromJson(Map<String, dynamic> json) => _$DevisFromJson(json);
}
