import '../../../domain/models/daily_weather.dart';

abstract class WeatherService {
  Future<List<DailyWeather>> get7DayForecast({
    required double latitude,
    required double longitude,
  });
}
