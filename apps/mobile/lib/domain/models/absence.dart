import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/absence_type.dart';

part 'absence.freezed.dart';
part 'absence.g.dart';

@freezed
abstract class Absence with _$Absence {
  const factory Absence({
    required String id,
    required String userId,
    required DateTime dateDebut,
    required DateTime dateFin,
    required AbsenceType type,
    String? motif,
    @Default(false) bool validee,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Absence;

  factory Absence.fromJson(Map<String, dynamic> json) =>
      _$AbsenceFromJson(json);
}
