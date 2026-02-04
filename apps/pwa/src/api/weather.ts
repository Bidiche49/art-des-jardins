/**
 * Weather API service using Open-Meteo (free, no API key required)
 * Documentation: https://open-meteo.com/en/docs
 */

// Angers coordinates (default location)
const DEFAULT_LATITUDE = 47.47;
const DEFAULT_LONGITUDE = -0.55;

// Cache duration: 3 hours
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000;

export interface WeatherAlert {
  type: 'rain' | 'frost' | 'wind' | 'heat';
  severity: 'warning' | 'danger';
  message: string;
}

export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number; // mm
  windSpeed: number; // km/h
  weatherCode: number; // WMO code
  icon: string;
  description: string;
  alerts: WeatherAlert[];
}

interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

interface CacheEntry {
  data: DailyWeather[];
  timestamp: number;
  key: string;
}

// In-memory cache
let weatherCache: CacheEntry | null = null;

/**
 * WMO Weather interpretation codes
 * https://open-meteo.com/en/docs#weathervariables
 */
const WMO_CODES: Record<number, { icon: string; description: string }> = {
  0: { icon: '☀️', description: 'Ciel dégagé' },
  1: { icon: '🌤️', description: 'Principalement dégagé' },
  2: { icon: '⛅', description: 'Partiellement nuageux' },
  3: { icon: '☁️', description: 'Couvert' },
  45: { icon: '🌫️', description: 'Brouillard' },
  48: { icon: '🌫️', description: 'Brouillard givrant' },
  51: { icon: '🌧️', description: 'Bruine légère' },
  53: { icon: '🌧️', description: 'Bruine modérée' },
  55: { icon: '🌧️', description: 'Bruine dense' },
  56: { icon: '🌧️', description: 'Bruine verglaçante légère' },
  57: { icon: '🌧️', description: 'Bruine verglaçante dense' },
  61: { icon: '🌧️', description: 'Pluie légère' },
  63: { icon: '🌧️', description: 'Pluie modérée' },
  65: { icon: '🌧️', description: 'Pluie forte' },
  66: { icon: '🌧️', description: 'Pluie verglaçante légère' },
  67: { icon: '🌧️', description: 'Pluie verglaçante forte' },
  71: { icon: '🌨️', description: 'Neige légère' },
  73: { icon: '🌨️', description: 'Neige modérée' },
  75: { icon: '🌨️', description: 'Neige forte' },
  77: { icon: '🌨️', description: 'Grains de neige' },
  80: { icon: '🌦️', description: 'Averses légères' },
  81: { icon: '🌦️', description: 'Averses modérées' },
  82: { icon: '🌦️', description: 'Averses violentes' },
  85: { icon: '🌨️', description: 'Averses de neige légères' },
  86: { icon: '🌨️', description: 'Averses de neige fortes' },
  95: { icon: '⛈️', description: 'Orage' },
  96: { icon: '⛈️', description: 'Orage avec grêle légère' },
  99: { icon: '⛈️', description: 'Orage avec grêle forte' },
};

/**
 * Check weather conditions and generate alerts for landscaping work
 */
function checkAlerts(weather: Omit<DailyWeather, 'alerts'>): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Rain alert: precipitation > 5mm makes outdoor work difficult
  if (weather.precipitation > 10) {
    alerts.push({
      type: 'rain',
      severity: 'danger',
      message: `Fortes pluies (${weather.precipitation}mm)`,
    });
  } else if (weather.precipitation > 5) {
    alerts.push({
      type: 'rain',
      severity: 'warning',
      message: `Pluie prévue (${weather.precipitation}mm)`,
    });
  }

  // Frost alert: temperatures below 0°C affect plantations
  if (weather.tempMin < -5) {
    alerts.push({
      type: 'frost',
      severity: 'danger',
      message: `Gel sévère (${weather.tempMin}°C)`,
    });
  } else if (weather.tempMin < 0) {
    alerts.push({
      type: 'frost',
      severity: 'warning',
      message: `Gel prévu (${weather.tempMin}°C)`,
    });
  }

  // Wind alert: strong winds are dangerous for tree work
  if (weather.windSpeed > 70) {
    alerts.push({
      type: 'wind',
      severity: 'danger',
      message: `Vent très fort (${Math.round(weather.windSpeed)}km/h)`,
    });
  } else if (weather.windSpeed > 50) {
    alerts.push({
      type: 'wind',
      severity: 'warning',
      message: `Vent fort (${Math.round(weather.windSpeed)}km/h)`,
    });
  }

  // Heat alert: extreme heat requires precautions
  if (weather.tempMax > 38) {
    alerts.push({
      type: 'heat',
      severity: 'danger',
      message: `Canicule (${weather.tempMax}°C)`,
    });
  } else if (weather.tempMax > 33) {
    alerts.push({
      type: 'heat',
      severity: 'warning',
      message: `Forte chaleur (${weather.tempMax}°C)`,
    });
  }

  return alerts;
}

/**
 * Get weather icon and description from WMO code
 */
function getWeatherInfo(code: number): { icon: string; description: string } {
  return WMO_CODES[code] || { icon: '❓', description: 'Inconnu' };
}

/**
 * Fetch weather forecast for a location
 */
export async function fetchWeatherForecast(
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): Promise<DailyWeather[]> {
  const cacheKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

  // Check cache
  if (
    weatherCache &&
    weatherCache.key === cacheKey &&
    Date.now() - weatherCache.timestamp < CACHE_DURATION_MS
  ) {
    return weatherCache.data;
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code');
  url.searchParams.set('timezone', 'Europe/Paris');
  url.searchParams.set('forecast_days', '7');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();

  const forecast: DailyWeather[] = data.daily.time.map((date, index) => {
    const weatherInfo = getWeatherInfo(data.daily.weather_code[index]);

    const dayWeather = {
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[index]),
      tempMin: Math.round(data.daily.temperature_2m_min[index]),
      precipitation: Math.round(data.daily.precipitation_sum[index] * 10) / 10,
      windSpeed: data.daily.wind_speed_10m_max[index],
      weatherCode: data.daily.weather_code[index],
      icon: weatherInfo.icon,
      description: weatherInfo.description,
    };

    return {
      ...dayWeather,
      alerts: checkAlerts(dayWeather),
    };
  });

  // Update cache
  weatherCache = {
    data: forecast,
    timestamp: Date.now(),
    key: cacheKey,
  };

  return forecast;
}

/**
 * Get weather for a specific date
 */
export async function getWeatherForDate(
  date: string,
  latitude?: number,
  longitude?: number
): Promise<DailyWeather | null> {
  const forecast = await fetchWeatherForecast(latitude, longitude);
  return forecast.find((day) => day.date === date) || null;
}

/**
 * Get weather forecast as a map by date for quick lookup
 */
export async function getWeatherMap(
  latitude?: number,
  longitude?: number
): Promise<Map<string, DailyWeather>> {
  const forecast = await fetchWeatherForecast(latitude, longitude);
  return new Map(forecast.map((day) => [day.date, day]));
}

/**
 * Check if there are any alerts for a specific date
 */
export async function hasWeatherAlerts(
  date: string,
  latitude?: number,
  longitude?: number
): Promise<boolean> {
  const weather = await getWeatherForDate(date, latitude, longitude);
  return weather ? weather.alerts.length > 0 : false;
}

/**
 * Clear the weather cache (useful for testing or forcing refresh)
 */
export function clearWeatherCache(): void {
  weatherCache = null;
}

export const weatherApi = {
  fetchForecast: fetchWeatherForecast,
  getForDate: getWeatherForDate,
  getMap: getWeatherMap,
  hasAlerts: hasWeatherAlerts,
  clearCache: clearWeatherCache,
};
