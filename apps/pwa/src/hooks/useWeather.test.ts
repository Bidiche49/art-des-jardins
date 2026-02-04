import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeather } from './useWeather';
import * as weatherApi from '@/api/weather';

// Mock the weather API
vi.mock('@/api/weather', () => ({
  fetchWeatherForecast: vi.fn(),
  clearWeatherCache: vi.fn(),
}));

const mockWeatherData = [
  {
    date: '2026-02-04',
    tempMax: 15,
    tempMin: 5,
    precipitation: 0,
    windSpeed: 20,
    weatherCode: 0,
    icon: '☀️',
    description: 'Ciel dégagé',
    alerts: [],
  },
  {
    date: '2026-02-05',
    tempMax: 8,
    tempMin: -2,
    precipitation: 15,
    windSpeed: 60,
    weatherCode: 63,
    icon: '🌧️',
    description: 'Pluie modérée',
    alerts: [
      { type: 'frost', severity: 'warning', message: 'Gel prévu (-2°C)' },
      { type: 'rain', severity: 'danger', message: 'Fortes pluies (15mm)' },
    ],
  },
];

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (weatherApi.fetchWeatherForecast as any).mockResolvedValue(mockWeatherData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch weather data on mount', async () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(weatherApi.fetchWeatherForecast).toHaveBeenCalledTimes(1);
    expect(result.current.forecast).toEqual(mockWeatherData);
  });

  it('should not fetch when disabled', async () => {
    const { result } = renderHook(() => useWeather({ enabled: false }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(weatherApi.fetchWeatherForecast).not.toHaveBeenCalled();
    expect(result.current.forecast).toEqual([]);
  });

  it('should provide weatherByDate Map', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weatherByDate).toBeInstanceOf(Map);
    expect(result.current.weatherByDate.size).toBe(2);
    expect(result.current.weatherByDate.get('2026-02-04')?.icon).toBe('☀️');
  });

  it('should provide getWeatherForDate helper', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const weather = result.current.getWeatherForDate('2026-02-05');
    expect(weather?.tempMax).toBe(8);
    expect(weather?.alerts).toHaveLength(2);
  });

  it('should return undefined for unknown date', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const weather = result.current.getWeatherForDate('2026-12-25');
    expect(weather).toBeUndefined();
  });

  it('should provide hasAlertsForDate helper', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasAlertsForDate('2026-02-04')).toBe(false);
    expect(result.current.hasAlertsForDate('2026-02-05')).toBe(true);
    expect(result.current.hasAlertsForDate('2026-12-25')).toBe(false);
  });

  it('should handle fetch error', async () => {
    const error = new Error('Network error');
    (weatherApi.fetchWeatherForecast as any).mockRejectedValue(error);

    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.forecast).toEqual([]);
  });

  it('should refetch and clear cache', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(weatherApi.fetchWeatherForecast).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(weatherApi.clearWeatherCache).toHaveBeenCalled();
    expect(weatherApi.fetchWeatherForecast).toHaveBeenCalledTimes(2);
  });

  it('should use custom coordinates', async () => {
    renderHook(() => useWeather({ latitude: 48.8566, longitude: 2.3522 }));

    await waitFor(() => {
      expect(weatherApi.fetchWeatherForecast).toHaveBeenCalledWith(48.8566, 2.3522);
    });
  });

  it('should use default Angers coordinates', async () => {
    renderHook(() => useWeather());

    await waitFor(() => {
      expect(weatherApi.fetchWeatherForecast).toHaveBeenCalledWith(47.47, -0.55);
    });
  });
});
