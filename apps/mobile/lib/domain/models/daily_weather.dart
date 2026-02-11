import 'package:freezed_annotation/freezed_annotation.dart';

part 'daily_weather.freezed.dart';
part 'daily_weather.g.dart';

@freezed
abstract class DailyWeather with _$DailyWeather {
  const factory DailyWeather({
    required String date,
    required double tempMax,
    required double tempMin,
    @Default(0.0) double precipitation,
    @Default(0.0) double windSpeed,
    @Default(0) int weatherCode,
    @Default('') String icon,
    @Default('') String description,
  }) = _DailyWeather;

  factory DailyWeather.fromJson(Map<String, dynamic> json) =>
      _$DailyWeatherFromJson(json);
}
