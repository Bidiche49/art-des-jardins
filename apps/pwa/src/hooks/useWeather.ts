import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeatherForecast, DailyWeather, clearWeatherCache } from '@/api/weather';

interface UseWeatherOptions {
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
}

interface UseWeatherResult {
  forecast: DailyWeather[];
  weatherByDate: Map<string, DailyWeather>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getWeatherForDate: (date: string) => DailyWeather | undefined;
  hasAlertsForDate: (date: string) => boolean;
}

// Angers coordinates (default)
const DEFAULT_LATITUDE = 47.47;
const DEFAULT_LONGITUDE = -0.55;

export function useWeather(options: UseWeatherOptions = {}): UseWeatherResult {
  const {
    latitude = DEFAULT_LATITUDE,
    longitude = DEFAULT_LONGITUDE,
    enabled = true,
  } = options;

  const [forecast, setForecast] = useState<DailyWeather[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherForecast(latitude, longitude);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    clearWeatherCache();
    await fetchData();
  }, [fetchData]);

  const weatherByDate = useMemo(() => {
    return new Map(forecast.map((day) => [day.date, day]));
  }, [forecast]);

  const getWeatherForDate = useCallback(
    (date: string): DailyWeather | undefined => {
      return weatherByDate.get(date);
    },
    [weatherByDate]
  );

  const hasAlertsForDate = useCallback(
    (date: string): boolean => {
      const weather = weatherByDate.get(date);
      return weather ? weather.alerts.length > 0 : false;
    },
    [weatherByDate]
  );

  return {
    forecast,
    weatherByDate,
    isLoading,
    error,
    refetch,
    getWeatherForDate,
    hasAlertsForDate,
  };
}
