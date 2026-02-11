import 'package:dio/dio.dart';

import '../../../domain/models/daily_weather.dart';
import '../domain/weather_service.dart';

class WeatherServiceImpl implements WeatherService {
  WeatherServiceImpl({Dio? dio}) : _dio = dio ?? Dio();

  final Dio _dio;

  static const String _baseUrl = 'https://api.open-meteo.com/v1/forecast';
  static const Duration _cacheDuration = Duration(hours: 3);

  List<DailyWeather>? _cache;
  DateTime? _cacheTime;

  bool get _isCacheValid =>
      _cache != null &&
      _cacheTime != null &&
      DateTime.now().difference(_cacheTime!) < _cacheDuration;

  @override
  Future<List<DailyWeather>> get7DayForecast({
    required double latitude,
    required double longitude,
  }) async {
    if (_isCacheValid) return _cache!;

    try {
      final response = await _dio.get(
        _baseUrl,
        queryParameters: {
          'latitude': latitude,
          'longitude': longitude,
          'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code',
          'timezone': 'Europe/Paris',
          'forecast_days': 7,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final daily = data['daily'] as Map<String, dynamic>;

      final dates = (daily['time'] as List).cast<String>();
      final tempMax = (daily['temperature_2m_max'] as List).cast<num>();
      final tempMin = (daily['temperature_2m_min'] as List).cast<num>();
      final precipitation = (daily['precipitation_sum'] as List).cast<num>();
      final windSpeed = (daily['wind_speed_10m_max'] as List).cast<num>();
      final weatherCodes = (daily['weather_code'] as List).cast<int>();

      final forecasts = <DailyWeather>[];
      for (var i = 0; i < dates.length; i++) {
        final code = weatherCodes[i];
        forecasts.add(DailyWeather(
          date: dates[i],
          tempMax: tempMax[i].toDouble(),
          tempMin: tempMin[i].toDouble(),
          precipitation: precipitation[i].toDouble(),
          windSpeed: windSpeed[i].toDouble(),
          weatherCode: code,
          icon: _weatherIcon(code),
          description: _weatherDescription(code),
        ));
      }

      _cache = forecasts;
      _cacheTime = DateTime.now();
      return forecasts;
    } catch (_) {
      if (_cache != null) return _cache!;
      return [];
    }
  }

  static String _weatherIcon(int code) {
    if (code == 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '☁️';
  }

  static String _weatherDescription(int code) {
    if (code == 0) return 'Ensoleillé';
    if (code <= 3) return 'Partiellement nuageux';
    if (code <= 48) return 'Brouillard';
    if (code <= 57) return 'Bruine';
    if (code <= 67) return 'Pluie';
    if (code <= 77) return 'Neige';
    if (code <= 82) return 'Averses';
    if (code <= 86) return 'Averses de neige';
    if (code >= 95) return 'Orage';
    return 'Nuageux';
  }
}
