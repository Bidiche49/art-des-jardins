import { ToolbarProps, Navigate, View } from 'react-big-calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function CalendarToolbar<TEvent extends object = object, TResource extends object = object>({
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<TEvent, TResource>) {
  const goToBack = () => onNavigate(Navigate.PREVIOUS);
  const goToNext = () => onNavigate(Navigate.NEXT);
  const goToToday = () => onNavigate(Navigate.TODAY);

  const viewButtons: { key: View; label: string }[] = [
    { key: 'month', label: 'Mois' },
    { key: 'week', label: 'Semaine' },
    { key: 'day', label: 'Jour' },
    { key: 'agenda', label: 'Liste' },
  ];

  const getLabel = () => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy', { locale: fr });
    }
    if (view === 'week') {
      return `Semaine du ${format(date, 'd MMMM yyyy', { locale: fr })}`;
    }
    if (view === 'day') {
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }
    return format(date, 'MMMM yyyy', { locale: fr });
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-gray-50">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
        >
          Aujourd'hui
        </button>
        <div className="flex items-center">
          <button
            onClick={goToBack}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 capitalize">{getLabel()}</h2>

      <div className="flex items-center bg-white border rounded-md overflow-hidden">
        {viewButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onView(key)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              view === key
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
