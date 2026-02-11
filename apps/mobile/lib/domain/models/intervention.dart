import 'package:freezed_annotation/freezed_annotation.dart';

part 'intervention.freezed.dart';
part 'intervention.g.dart';

@freezed
abstract class Intervention with _$Intervention {
  const factory Intervention({
    required String id,
    required String chantierId,
    required String employeId,
    required DateTime date,
    required DateTime heureDebut,
    DateTime? heureFin,
    int? dureeMinutes,
    String? description,
    @Default([]) List<String> photos,
    String? notes,
    @Default(false) bool valide,
    String? externalCalendarEventId,
    DateTime? deletedAt,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Intervention;

  factory Intervention.fromJson(Map<String, dynamic> json) =>
      _$InterventionFromJson(json);
}
