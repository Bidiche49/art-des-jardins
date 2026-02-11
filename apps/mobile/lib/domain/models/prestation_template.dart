import 'package:freezed_annotation/freezed_annotation.dart';

part 'prestation_template.freezed.dart';
part 'prestation_template.g.dart';

@freezed
abstract class PrestationTemplate with _$PrestationTemplate {
  const factory PrestationTemplate({
    required String id,
    required String name,
    String? description,
    required String category,
    required String unit,
    required double unitPriceHT,
    @Default(20.0) double tvaRate,
    @Default(false) bool isGlobal,
    String? createdBy,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _PrestationTemplate;

  factory PrestationTemplate.fromJson(Map<String, dynamic> json) =>
      _$PrestationTemplateFromJson(json);
}
