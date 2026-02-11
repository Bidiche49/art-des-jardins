import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/chantier_statut.dart';
import '../enums/type_prestation.dart';

part 'chantier.freezed.dart';
part 'chantier.g.dart';

@freezed
abstract class Chantier with _$Chantier {
  const factory Chantier({
    required String id,
    required String clientId,
    required String adresse,
    required String codePostal,
    required String ville,
    double? latitude,
    double? longitude,
    @Default([]) List<TypePrestation> typePrestation,
    required String description,
    double? surface,
    @Default(ChantierStatut.lead) ChantierStatut statut,
    DateTime? dateVisite,
    DateTime? dateDebut,
    DateTime? dateFin,
    String? responsableId,
    String? notes,
    @Default([]) List<String> photos,
    DateTime? deletedAt,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Chantier;

  factory Chantier.fromJson(Map<String, dynamic> json) =>
      _$ChantierFromJson(json);
}
