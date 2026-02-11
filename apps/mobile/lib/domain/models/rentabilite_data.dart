import 'package:freezed_annotation/freezed_annotation.dart';

part 'rentabilite_data.freezed.dart';
part 'rentabilite_data.g.dart';

@freezed
abstract class RentabiliteData with _$RentabiliteData {
  const factory RentabiliteData({
    required String chantierId,
    @Default(0.0) double totalHeures,
    @Default(0.0) double coutMainOeuvre,
    @Default(0.0) double totalMateriel,
    @Default(0.0) double totalDevis,
    @Default(0.0) double marge,
    @Default(0.0) double margePercent,
  }) = _RentabiliteData;

  factory RentabiliteData.fromJson(Map<String, dynamic> json) =>
      _$RentabiliteDataFromJson(json);
}
