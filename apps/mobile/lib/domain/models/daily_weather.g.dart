// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_weather.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DailyWeather _$DailyWeatherFromJson(Map<String, dynamic> json) =>
    _DailyWeather(
      date: json['date'] as String,
      tempMax: (json['tempMax'] as num).toDouble(),
      tempMin: (json['tempMin'] as num).toDouble(),
      precipitation: (json['precipitation'] as num?)?.toDouble() ?? 0.0,
      windSpeed: (json['windSpeed'] as num?)?.toDouble() ?? 0.0,
      weatherCode: (json['weatherCode'] as num?)?.toInt() ?? 0,
      icon: json['icon'] as String? ?? '',
      description: json['description'] as String? ?? '',
    );

Map<String, dynamic> _$DailyWeatherToJson(_DailyWeather instance) =>
    <String, dynamic>{
      'date': instance.date,
      'tempMax': instance.tempMax,
      'tempMin': instance.tempMin,
      'precipitation': instance.precipitation,
      'windSpeed': instance.windSpeed,
      'weatherCode': instance.weatherCode,
      'icon': instance.icon,
      'description': instance.description,
    };
