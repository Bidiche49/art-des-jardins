import { DailyWeather, WeatherAlert } from '@/api/weather';

interface WeatherBadgeProps {
  weather: DailyWeather;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const alertSeverityClasses = {
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  danger: 'bg-red-100 text-red-800 border-red-300',
};

const alertIconMap: Record<WeatherAlert['type'], string> = {
  rain: '🌧️',
  frost: '❄️',
  wind: '💨',
  heat: '🔥',
};

export function WeatherBadge({
  weather,
  size = 'sm',
  showDetails = false,
  className = '',
}: WeatherBadgeProps) {
  const hasAlerts = weather.alerts.length > 0;
  const maxSeverity = weather.alerts.some((a) => a.severity === 'danger')
    ? 'danger'
    : weather.alerts.length > 0
      ? 'warning'
      : null;

  return (
    <div
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${className}`}
      title={`${weather.description} - ${weather.tempMin}°/${weather.tempMax}°C`}
    >
      <span className="flex-shrink-0">{weather.icon}</span>
      {showDetails && (
        <>
          <span className="text-gray-600">
            {weather.tempMin}°/{weather.tempMax}°
          </span>
          {weather.precipitation > 0 && (
            <span className="text-blue-600 text-xs">
              {weather.precipitation}mm
            </span>
          )}
        </>
      )}
      {hasAlerts && maxSeverity && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded text-xs border ${alertSeverityClasses[maxSeverity]}`}
          title={weather.alerts.map((a) => a.message).join(', ')}
        >
          {weather.alerts.length > 1
            ? `${weather.alerts.length} alertes`
            : weather.alerts[0].message}
        </span>
      )}
    </div>
  );
}

interface WeatherAlertBadgeProps {
  alert: WeatherAlert;
  className?: string;
}

export function WeatherAlertBadge({ alert, className = '' }: WeatherAlertBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${alertSeverityClasses[alert.severity]} ${className}`}
    >
      <span>{alertIconMap[alert.type]}</span>
      <span>{alert.message}</span>
    </span>
  );
}

interface WeatherSummaryProps {
  weather: DailyWeather;
  className?: string;
}

export function WeatherSummary({ weather, className = '' }: WeatherSummaryProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{weather.icon}</span>
        <div>
          <p className="font-medium text-gray-900">{weather.description}</p>
          <p className="text-sm text-gray-500">
            {weather.tempMin}° / {weather.tempMax}°C
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        {weather.precipitation > 0 && (
          <span className="flex items-center gap-1">
            <span>💧</span>
            {weather.precipitation}mm
          </span>
        )}
        <span className="flex items-center gap-1">
          <span>💨</span>
          {Math.round(weather.windSpeed)}km/h
        </span>
      </div>

      {weather.alerts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {weather.alerts.map((alert, index) => (
            <WeatherAlertBadge key={index} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

interface WeatherTooltipContentProps {
  weather: DailyWeather;
}

export function WeatherTooltipContent({ weather }: WeatherTooltipContentProps) {
  return (
    <div className="p-2 min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{weather.icon}</span>
        <span className="font-medium">{weather.description}</span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Température:</span>
          <span>
            {weather.tempMin}° / {weather.tempMax}°C
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Précipitations:</span>
          <span>{weather.precipitation}mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Vent max:</span>
          <span>{Math.round(weather.windSpeed)}km/h</span>
        </div>
      </div>

      {weather.alerts.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-1">Alertes:</p>
          <div className="space-y-1">
            {weather.alerts.map((alert, index) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${alertSeverityClasses[alert.severity]}`}
              >
                {alertIconMap[alert.type]} {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
