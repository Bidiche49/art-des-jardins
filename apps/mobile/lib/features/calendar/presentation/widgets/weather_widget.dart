import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/daily_weather.dart';
import '../providers/calendar_providers.dart';

class WeatherBanner extends ConsumerWidget {
  const WeatherBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherState = ref.watch(weatherNotifierProvider);

    return weatherState.when(
      loading: () => const SizedBox(
        height: 80,
        child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
      ),
      error: (_, _) => const SizedBox.shrink(),
      data: (forecasts) {
        if (forecasts.isEmpty) return const SizedBox.shrink();
        return SizedBox(
          height: 90,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            itemCount: forecasts.length,
            itemBuilder: (context, index) {
              return WeatherDayCard(weather: forecasts[index]);
            },
          ),
        );
      },
    );
  }
}

class WeatherDayCard extends StatelessWidget {
  const WeatherDayCard({super.key, required this.weather});

  final DailyWeather weather;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasAlert = weather.precipitation > 5;

    return Container(
      width: 72,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      decoration: BoxDecoration(
        color: hasAlert
            ? Colors.blue.shade50
            : theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(12),
        border: hasAlert
            ? Border.all(color: Colors.blue.shade200)
            : null,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            _shortDay(weather.date),
            style: theme.textTheme.labelSmall,
          ),
          const SizedBox(height: 2),
          Text(
            weather.icon,
            style: const TextStyle(fontSize: 20),
          ),
          const SizedBox(height: 2),
          Text(
            '${weather.tempMax.round()}°',
            style: theme.textTheme.labelMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            '${weather.tempMin.round()}°',
            style: theme.textTheme.labelSmall?.copyWith(
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  String _shortDay(String dateStr) {
    try {
      final parts = dateStr.split('-');
      final date = DateTime(
        int.parse(parts[0]),
        int.parse(parts[1]),
        int.parse(parts[2]),
      );
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      return days[date.weekday - 1];
    } catch (_) {
      return dateStr;
    }
  }
}

class WeatherAlertBadge extends StatelessWidget {
  const WeatherAlertBadge({super.key, required this.weather});

  final DailyWeather weather;

  @override
  Widget build(BuildContext context) {
    if (weather.precipitation <= 5) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.blue.shade100,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.water_drop, size: 12, color: Colors.blue),
          const SizedBox(width: 2),
          Text(
            '${weather.precipitation.round()}mm',
            style: const TextStyle(fontSize: 10, color: Colors.blue),
          ),
        ],
      ),
    );
  }
}
