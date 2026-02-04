import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchWeatherForecast,
  getWeatherForDate,
  getWeatherMap,
  hasWeatherAlerts,
  clearWeatherCache,
  DailyWeather,
} from './weather';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockOpenMeteoResponse = {
  daily: {
    time: ['2026-02-04', '2026-02-05', '2026-02-06'],
    temperature_2m_max: [15, 8, 20],
    temperature_2m_min: [5, -2, 12],
    precipitation_sum: [0, 15, 0],
    wind_speed_10m_max: [20, 60, 10],
    weather_code: [0, 63, 1],
  },
};

describe('Weather API', () => {
  beforeEach(() => {
    clearWeatherCache();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchWeatherForecast', () => {
    it('should fetch weather data from Open-Meteo API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const forecast = await fetchWeatherForecast();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain('api.open-meteo.com');
      expect(forecast).toHaveLength(3);
    });

    it('should parse weather data correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const forecast = await fetchWeatherForecast();

      expect(forecast[0]).toEqual({
        date: '2026-02-04',
        tempMax: 15,
        tempMin: 5,
        precipitation: 0,
        windSpeed: 20,
        weatherCode: 0,
        icon: '☀️',
        description: 'Ciel dégagé',
        alerts: [],
      });
    });

    it('should generate frost alert when temp < 0', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const forecast = await fetchWeatherForecast();
      const frostyDay = forecast[1];

      expect(frostyDay.alerts).toContainEqual({
        type: 'frost',
        severity: 'warning',
        message: 'Gel prévu (-2°C)',
      });
    });

    it('should generate rain alert when precipitation > 5mm', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const forecast = await fetchWeatherForecast();
      const rainyDay = forecast[1];

      expect(rainyDay.alerts).toContainEqual({
        type: 'rain',
        severity: 'danger',
        message: 'Fortes pluies (15mm)',
      });
    });

    it('should generate wind alert when wind > 50km/h', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const forecast = await fetchWeatherForecast();
      const windyDay = forecast[1];

      expect(windyDay.alerts).toContainEqual({
        type: 'wind',
        severity: 'warning',
        message: 'Vent fort (60km/h)',
      });
    });

    it('should cache results for 3 hours', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      // First call
      await fetchWeatherForecast();
      // Second call (should use cache)
      await fetchWeatherForecast();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache after clearWeatherCache', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      await fetchWeatherForecast();
      clearWeatherCache();
      await fetchWeatherForecast();

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchWeatherForecast()).rejects.toThrow('Weather API error: 500');
    });

    it('should use custom coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      await fetchWeatherForecast(48.8566, 2.3522); // Paris

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('latitude=48.8566');
      expect(url).toContain('longitude=2.3522');
    });
  });

  describe('getWeatherForDate', () => {
    it('should return weather for a specific date', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const weather = await getWeatherForDate('2026-02-04');

      expect(weather).not.toBeNull();
      expect(weather?.date).toBe('2026-02-04');
      expect(weather?.tempMax).toBe(15);
    });

    it('should return null for date not in forecast', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const weather = await getWeatherForDate('2026-02-20');

      expect(weather).toBeNull();
    });
  });

  describe('getWeatherMap', () => {
    it('should return a Map of weather by date', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const weatherMap = await getWeatherMap();

      expect(weatherMap).toBeInstanceOf(Map);
      expect(weatherMap.size).toBe(3);
      expect(weatherMap.has('2026-02-04')).toBe(true);
      expect(weatherMap.get('2026-02-04')?.icon).toBe('☀️');
    });
  });

  describe('hasWeatherAlerts', () => {
    it('should return true when date has alerts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const hasAlerts = await hasWeatherAlerts('2026-02-05');

      expect(hasAlerts).toBe(true);
    });

    it('should return false when date has no alerts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const hasAlerts = await hasWeatherAlerts('2026-02-04');

      expect(hasAlerts).toBe(false);
    });

    it('should return false when date is not in forecast', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      });

      const hasAlerts = await hasWeatherAlerts('2026-02-20');

      expect(hasAlerts).toBe(false);
    });
  });

  describe('Alert generation thresholds', () => {
    it('should generate danger alert for heavy rain > 10mm', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [15],
              temperature_2m_min: [10],
              precipitation_sum: [12],
              wind_speed_10m_max: [10],
              weather_code: [65],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const rainAlert = forecast[0].alerts.find((a) => a.type === 'rain');

      expect(rainAlert?.severity).toBe('danger');
    });

    it('should generate warning alert for moderate rain 5-10mm', async () => {
      clearWeatherCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [15],
              temperature_2m_min: [10],
              precipitation_sum: [7],
              wind_speed_10m_max: [10],
              weather_code: [61],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const rainAlert = forecast[0].alerts.find((a) => a.type === 'rain');

      expect(rainAlert?.severity).toBe('warning');
    });

    it('should generate danger alert for severe frost < -5°C', async () => {
      clearWeatherCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [5],
              temperature_2m_min: [-8],
              precipitation_sum: [0],
              wind_speed_10m_max: [10],
              weather_code: [0],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const frostAlert = forecast[0].alerts.find((a) => a.type === 'frost');

      expect(frostAlert?.severity).toBe('danger');
    });

    it('should generate danger alert for very strong wind > 70km/h', async () => {
      clearWeatherCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [15],
              temperature_2m_min: [10],
              precipitation_sum: [0],
              wind_speed_10m_max: [80],
              weather_code: [0],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const windAlert = forecast[0].alerts.find((a) => a.type === 'wind');

      expect(windAlert?.severity).toBe('danger');
    });

    it('should generate heat alert for temp > 33°C', async () => {
      clearWeatherCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [36],
              temperature_2m_min: [25],
              precipitation_sum: [0],
              wind_speed_10m_max: [10],
              weather_code: [0],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const heatAlert = forecast[0].alerts.find((a) => a.type === 'heat');

      expect(heatAlert?.severity).toBe('warning');
      expect(heatAlert?.message).toContain('36');
    });

    it('should generate danger heat alert for temp > 38°C', async () => {
      clearWeatherCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            daily: {
              time: ['2026-02-04'],
              temperature_2m_max: [40],
              temperature_2m_min: [28],
              precipitation_sum: [0],
              wind_speed_10m_max: [10],
              weather_code: [0],
            },
          }),
      });

      const forecast = await fetchWeatherForecast();
      const heatAlert = forecast[0].alerts.find((a) => a.type === 'heat');

      expect(heatAlert?.severity).toBe('danger');
    });
  });
});
