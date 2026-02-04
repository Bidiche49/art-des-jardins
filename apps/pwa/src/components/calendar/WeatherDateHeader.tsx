import { format } from 'date-fns';
import { DailyWeather } from '@/api/weather';

interface WeatherDateHeaderProps {
  date: Date;
  label: string;
  weatherByDate: Map<string, DailyWeather>;
}

export function WeatherDateHeader({
  date,
  label,
  weatherByDate,
}: WeatherDateHeaderProps) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const weather = weatherByDate.get(dateKey);

  return (
    <div className="flex items-center justify-between w-full px-1">
      <span className="rbc-header-label">{label}</span>
      {weather && (
        <span
          className="text-sm cursor-help"
          title={`${weather.description} - ${weather.tempMin}°/${weather.tempMax}°C${weather.alerts.length > 0 ? ` - ${weather.alerts.map((a) => a.message).join(', ')}` : ''}`}
        >
          {weather.icon}
          {weather.alerts.length > 0 && (
            <span className="ml-0.5 text-xs text-red-500">!</span>
          )}
        </span>
      )}
    </div>
  );
}

interface MonthDateCellProps {
  date: Date;
  weatherByDate: Map<string, DailyWeather>;
  children?: React.ReactNode;
}

export function MonthDateCell({
  date,
  weatherByDate,
  children,
}: MonthDateCellProps) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const weather = weatherByDate.get(dateKey);
  const hasAlerts = weather && weather.alerts.length > 0;
  const hasDangerAlert = weather?.alerts.some((a) => a.severity === 'danger');

  return (
    <div
      className={`rbc-day-bg ${hasAlerts ? (hasDangerAlert ? 'bg-red-50' : 'bg-yellow-50') : ''}`}
    >
      {weather && (
        <div
          className="absolute top-0 right-0 p-0.5 text-xs cursor-help z-10"
          title={`${weather.description}\n${weather.tempMin}°/${weather.tempMax}°C\n${weather.precipitation > 0 ? `Pluie: ${weather.precipitation}mm\n` : ''}Vent: ${Math.round(weather.windSpeed)}km/h${weather.alerts.length > 0 ? `\n\n⚠️ ${weather.alerts.map((a) => a.message).join('\n⚠️ ')}` : ''}`}
        >
          <span>{weather.icon}</span>
          {hasAlerts && (
            <span
              className={`ml-0.5 ${hasDangerAlert ? 'text-red-600' : 'text-yellow-600'}`}
            >
              !
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
