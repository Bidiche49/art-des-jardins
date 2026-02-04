import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, SlotInfo, DateHeaderProps } from 'react-big-calendar';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { interventionsApi, absencesApi, calendarApi, type Absence } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { Card, Button, Spinner, Modal } from '@/components/ui';
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar';
import { CalendarEvent } from '@/components/calendar/CalendarEvent';
import { useWeather } from '@/hooks';
import { DailyWeather } from '@/api/weather';
import toast from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop<CalendarEventData>(BigCalendar);

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: {
    intervention?: any;
    absence?: Absence;
    color: string;
    type: 'intervention' | 'absence';
  };
}

const EMPLOYEE_COLORS = [
  '#16a34a', // green
  '#2563eb', // blue
  '#dc2626', // red
  '#ca8a04', // yellow
  '#9333ea', // purple
  '#0891b2', // cyan
  '#c2410c', // orange
  '#4f46e5', // indigo
];

const ABSENCE_COLORS: Record<string, string> = {
  conge: '#f59e0b', // amber
  maladie: '#ef4444', // red
  formation: '#8b5cf6', // violet
  autre: '#6b7280', // gray
};

const ABSENCE_LABELS: Record<string, string> = {
  conge: 'Conge',
  maladie: 'Maladie',
  formation: 'Formation',
  autre: 'Autre',
};

// Weather DateHeader component for month view
function WeatherDateHeader({
  date,
  label,
  weatherByDate,
}: DateHeaderProps & { weatherByDate: Map<string, DailyWeather> }) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const weather = weatherByDate.get(dateKey);
  const hasAlerts = weather && weather.alerts.length > 0;
  const hasDangerAlert = weather?.alerts.some((a) => a.severity === 'danger');

  return (
    <div className="flex items-center justify-between w-full">
      <span>{label}</span>
      {weather && (
        <span
          className="text-sm cursor-help flex items-center"
          title={`${weather.description}\n${weather.tempMin}°/${weather.tempMax}°C\n${weather.precipitation > 0 ? `Pluie: ${weather.precipitation}mm\n` : ''}Vent: ${Math.round(weather.windSpeed)}km/h${hasAlerts ? `\n\n⚠️ ${weather.alerts.map((a) => a.message).join('\n⚠️ ')}` : ''}`}
        >
          {weather.icon}
          {hasAlerts && (
            <span
              className={`ml-0.5 text-xs font-bold ${hasDangerAlert ? 'text-red-600' : 'text-yellow-600'}`}
            >
              !
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export function Calendar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [absenceEvents, setAbsenceEvents] = useState<CalendarEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Array<{ id: string; nom: string; prenom: string }>>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [showAbsences, setShowAbsences] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [icalToken, setIcalToken] = useState<string | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  // Weather data for 7-day forecast
  const { weatherByDate, isLoading: weatherLoading } = useWeather();

  const employeeColorMap = useMemo(() => {
    const map = new Map<string, string>();
    employees.forEach((emp, index) => {
      map.set(emp.id, EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length]);
    });
    map.set('unassigned', '#6b7280'); // gray for unassigned
    return map;
  }, [employees]);

  const loadInterventions = useCallback(async () => {
    setIsLoading(true);
    try {
      const start = startOfMonth(subMonths(date, 1));
      const end = endOfMonth(addMonths(date, 1));

      // Load interventions and absences in parallel
      const [interventionsResponse, absencesData] = await Promise.all([
        interventionsApi.getAll({
          dateDebut: start.toISOString(),
          dateFin: end.toISOString(),
          limit: 500,
        } as any),
        absencesApi.getForCalendar(start.toISOString(), end.toISOString()).catch(() => []),
      ]);

      const interventions = interventionsResponse.data || [];

      // Extract unique employees from interventions and absences
      const employeeMap = new Map<string, { id: string; nom: string; prenom: string }>();
      interventions.forEach((intervention: any) => {
        if (intervention.employe) {
          employeeMap.set(intervention.employe.id, intervention.employe);
        }
      });
      absencesData.forEach((absence) => {
        if (absence.user) {
          employeeMap.set(absence.user.id, absence.user);
        }
      });
      setEmployees(Array.from(employeeMap.values()));

      // Convert interventions to calendar events
      const calendarEvents: CalendarEventData[] = interventions.map((intervention: any) => {
        const startDate = new Date(intervention.heureDebut || intervention.date);
        const endDate = intervention.heureFin
          ? new Date(intervention.heureFin)
          : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2h

        const employeeId = intervention.employeId || 'unassigned';
        const color = employeeColorMap.get(employeeId) || '#6b7280';

        const clientName = intervention.chantier?.client
          ? `${intervention.chantier.client.nom}`
          : 'Client inconnu';

        return {
          id: intervention.id,
          title: `${clientName} - ${intervention.description || 'Intervention'}`,
          start: startDate,
          end: endDate,
          resource: {
            intervention,
            color,
            type: 'intervention' as const,
          },
        };
      });

      // Convert absences to calendar events
      const absenceCalendarEvents: CalendarEventData[] = absencesData.map((absence) => {
        const employeeName = absence.user
          ? `${absence.user.prenom} ${absence.user.nom.charAt(0)}.`
          : 'Employe';

        return {
          id: `absence-${absence.id}`,
          title: `${ABSENCE_LABELS[absence.type]} - ${employeeName}`,
          start: new Date(absence.dateDebut),
          end: new Date(absence.dateFin),
          allDay: true,
          resource: {
            absence,
            color: ABSENCE_COLORS[absence.type] || '#6b7280',
            type: 'absence' as const,
          },
        };
      });

      setEvents(calendarEvents);
      setAbsenceEvents(absenceCalendarEvents);
    } catch (error) {
      console.error('Failed to load interventions:', error);
      toast.error('Erreur lors du chargement des interventions');
    } finally {
      setIsLoading(false);
    }
  }, [date, employeeColorMap]);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedEmployee !== 'all') {
      filtered = events.filter(
        (event) =>
          event.resource.intervention?.employeId === selectedEmployee ||
          (selectedEmployee === 'unassigned' && !event.resource.intervention?.employeId)
      );
    }

    // Add absences if shown
    if (showAbsences) {
      let filteredAbsences = absenceEvents;
      if (selectedEmployee !== 'all' && selectedEmployee !== 'unassigned') {
        filteredAbsences = absenceEvents.filter(
          (event) => event.resource.absence?.userId === selectedEmployee
        );
      }
      return [...filtered, ...filteredAbsences];
    }

    return filtered;
  }, [events, absenceEvents, selectedEmployee, showAbsences]);

  const handleSelectEvent = useCallback(
    (event: CalendarEventData) => {
      if (event.resource.type === 'absence') {
        // Navigate to absences page
        navigate('/absences');
      } else {
        navigate(`/interventions/${event.id}`);
      }
    },
    [navigate]
  );

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (user?.role !== 'patron') return;
      // Could open a modal to create intervention
      const dateStr = format(slotInfo.start, 'yyyy-MM-dd');
      navigate(`/interventions?date=${dateStr}`);
    },
    [navigate, user]
  );

  // Ref to track pending undo operations
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user can drag (only patron)
  const canDrag = user?.role === 'patron';

  const draggableAccessor = useCallback(
    (event: CalendarEventData) => canDrag && event.resource.type === 'intervention',
    [canDrag]
  );

  const resizableAccessor = useCallback(
    (event: CalendarEventData) => canDrag && event.resource.type === 'intervention',
    [canDrag]
  );

  // Handle event drop (date/time change)
  const handleEventDrop = useCallback(
    async ({ event, start, end }: EventInteractionArgs<CalendarEventData>) => {
      if (!canDrag) return;

      const originalEvent = events.find((e) => e.id === event.id);
      if (!originalEvent) return;

      // Store original for rollback
      const originalStart = originalEvent.start;
      const originalEnd = originalEvent.end;

      // Optimistic update
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: start as Date, end: end as Date }
            : e
        )
      );

      // Clear any pending undo
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Show toast with undo option
      const toastId = toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <span>Intervention deplacee</span>
            <button
              onClick={() => {
                // Rollback
                setEvents((prev) =>
                  prev.map((e) =>
                    e.id === event.id
                      ? { ...e, start: originalStart, end: originalEnd }
                      : e
                  )
                );
                toast.dismiss(t.id);
                if (undoTimeoutRef.current) {
                  clearTimeout(undoTimeoutRef.current);
                }
              }}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              Annuler
            </button>
          </div>
        ),
        { duration: 5000 }
      );

      // Call API after delay (allows undo)
      undoTimeoutRef.current = setTimeout(async () => {
        try {
          await interventionsApi.update(event.id, {
            date: start as Date,
            heureDebut: format(start as Date, "yyyy-MM-dd'T'HH:mm:ss"),
            heureFin: format(end as Date, "yyyy-MM-dd'T'HH:mm:ss"),
          });
          toast.dismiss(toastId);
          toast.success('Modification enregistree');
        } catch (error) {
          console.error('Failed to update intervention:', error);
          // Rollback on error
          setEvents((prev) =>
            prev.map((e) =>
              e.id === event.id
                ? { ...e, start: originalStart, end: originalEnd }
                : e
            )
          );
          toast.dismiss(toastId);
          toast.error('Erreur lors de la modification');
        }
      }, 3000);
    },
    [canDrag, events]
  );

  // Handle event resize (duration change)
  const handleEventResize = useCallback(
    async ({ event, start, end }: EventInteractionArgs<CalendarEventData>) => {
      if (!canDrag) return;

      const originalEvent = events.find((e) => e.id === event.id);
      if (!originalEvent) return;

      // Store original for rollback
      const originalStart = originalEvent.start;
      const originalEnd = originalEvent.end;

      // Optimistic update
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: start as Date, end: end as Date }
            : e
        )
      );

      // Clear any pending undo
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Show toast with undo option
      const toastId = toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <span>Duree modifiee</span>
            <button
              onClick={() => {
                // Rollback
                setEvents((prev) =>
                  prev.map((e) =>
                    e.id === event.id
                      ? { ...e, start: originalStart, end: originalEnd }
                      : e
                  )
                );
                toast.dismiss(t.id);
                if (undoTimeoutRef.current) {
                  clearTimeout(undoTimeoutRef.current);
                }
              }}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              Annuler
            </button>
          </div>
        ),
        { duration: 5000 }
      );

      // Call API after delay (allows undo)
      undoTimeoutRef.current = setTimeout(async () => {
        try {
          await interventionsApi.update(event.id, {
            heureDebut: format(start as Date, "yyyy-MM-dd'T'HH:mm:ss"),
            heureFin: format(end as Date, "yyyy-MM-dd'T'HH:mm:ss"),
          });
          toast.dismiss(toastId);
          toast.success('Modification enregistree');
        } catch (error) {
          console.error('Failed to update intervention:', error);
          // Rollback on error
          setEvents((prev) =>
            prev.map((e) =>
              e.id === event.id
                ? { ...e, start: originalStart, end: originalEnd }
                : e
            )
          );
          toast.dismiss(toastId);
          toast.error('Erreur lors de la modification');
        }
      }, 3000);
    },
    [canDrag, events]
  );

  const eventStyleGetter = useCallback((event: CalendarEventData) => {
    if (event.resource.type === 'absence') {
      return {
        style: {
          backgroundColor: event.resource.color,
          borderRadius: '4px',
          opacity: 0.6,
          color: 'white',
          border: '2px dashed white',
          display: 'block',
          fontSize: '0.75rem',
        },
      };
    }
    return {
      style: {
        backgroundColor: event.resource.color,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  }, []);

  // iCal export functions
  const loadIcalToken = useCallback(async () => {
    try {
      const response = await calendarApi.getIcalToken();
      setIcalToken(response.token);
    } catch {
      setIcalToken(null);
    }
  }, []);

  const handleGenerateToken = async () => {
    setIsGeneratingToken(true);
    try {
      const response = await calendarApi.generateIcalToken();
      setIcalToken(response.token);
      toast.success('Lien d\'abonnement genere');
    } catch {
      toast.error('Erreur lors de la generation');
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const handleRevokeToken = async () => {
    try {
      await calendarApi.revokeIcalToken();
      setIcalToken(null);
      toast.success('Lien d\'abonnement revoque');
    } catch {
      toast.error('Erreur lors de la revocation');
    }
  };

  const handleCopyUrl = () => {
    if (icalToken) {
      const url = calendarApi.getIcalSubscriptionUrl(icalToken);
      navigator.clipboard.writeText(url);
      toast.success('URL copiee dans le presse-papier');
    }
  };

  const handleOpenExportModal = () => {
    setShowExportModal(true);
    loadIcalToken();
  };

  const messages = {
    today: "Aujourd'hui",
    previous: 'Precedent',
    next: 'Suivant',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Intervention',
    noEventsInRange: 'Aucune intervention sur cette periode',
    showMore: (total: number) => `+${total} autres`,
  };

  return (
    <div className="h-full flex flex-col -m-4">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Calendrier</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showAbsences}
              onChange={(e) => setShowAbsences(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Absences
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tous les employes</option>
            <option value="unassigned">Non assignees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.prenom} {emp.nom}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" onClick={handleOpenExportModal}>
            Exporter
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/absences')}>
            Absences
          </Button>
          {user?.role === 'patron' && (
            <Button size="sm" onClick={() => navigate('/interventions')}>
              + Intervention
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : (
          <Card className="h-full p-0 overflow-hidden">
            <DnDCalendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={user?.role === 'patron'}
              eventPropGetter={eventStyleGetter}
              messages={messages}
              culture="fr"
              // Drag & Drop props
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              draggableAccessor={draggableAccessor}
              resizableAccessor={resizableAccessor}
              resizable
              components={{
                toolbar: CalendarToolbar,
                event: CalendarEvent,
                month: {
                  dateHeader: (props: DateHeaderProps) => (
                    <WeatherDateHeader {...props} weatherByDate={weatherByDate} />
                  ),
                },
              }}
              formats={{
                monthHeaderFormat: (date) => format(date, 'MMMM yyyy', { locale: fr }),
                weekdayFormat: (date) => format(date, 'EEE', { locale: fr }),
                dayHeaderFormat: (date) => format(date, 'EEEE d MMMM', { locale: fr }),
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${format(start, 'd MMM', { locale: fr })} - ${format(end, 'd MMM yyyy', { locale: fr })}`,
                agendaDateFormat: (date) => format(date, 'EEE d MMM', { locale: fr }),
                agendaTimeFormat: (date) => format(date, 'HH:mm', { locale: fr }),
                agendaTimeRangeFormat: ({ start, end }) =>
                  `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
                eventTimeRangeFormat: ({ start, end }) =>
                  `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
              }}
              style={{ height: '100%' }}
            />
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t px-4 py-2 flex items-center gap-4 overflow-x-auto">
        <span className="text-sm text-gray-500 whitespace-nowrap">Employes:</span>
        {employees.map((emp) => (
          <div key={emp.id} className="flex items-center gap-1 whitespace-nowrap">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: employeeColorMap.get(emp.id) }}
            />
            <span className="text-sm text-gray-700">
              {emp.prenom} {emp.nom.charAt(0)}.
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="w-3 h-3 rounded bg-gray-500" />
          <span className="text-sm text-gray-700">Non assigne</span>
        </div>
        {showAbsences && (
          <>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">Absences:</span>
            {Object.entries(ABSENCE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1 whitespace-nowrap">
                <div
                  className="w-3 h-3 rounded border border-dashed border-white"
                  style={{ backgroundColor: color, opacity: 0.6 }}
                />
                <span className="text-sm text-gray-700">{ABSENCE_LABELS[type]}</span>
              </div>
            ))}
          </>
        )}
        {/* Weather legend */}
        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">Meteo:</span>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-yellow-600 font-bold">!</span>
          <span className="text-sm text-gray-700">Attention</span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-red-600 font-bold">!</span>
          <span className="text-sm text-gray-700">Danger</span>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Exporter le calendrier"
        size="md"
      >
        <div className="space-y-6">
          {/* Download section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Telechargement ponctuel
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Telecharge un fichier .ics avec vos interventions des 6 prochains mois.
            </p>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/calendar/ical/download`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
              download
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Telecharger .ics
            </a>
          </div>

          <hr />

          {/* Subscription section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Abonnement automatique
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Ajoutez cette URL a votre agenda (Google Calendar, Outlook, Apple Calendar) pour une synchronisation automatique.
            </p>

            {icalToken ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={calendarApi.getIcalSubscriptionUrl(icalToken)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
                  />
                  <Button size="sm" onClick={handleCopyUrl}>
                    Copier
                  </Button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Comment ajouter a votre agenda:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Google Calendar: Parametres &gt; Ajouter un agenda &gt; A partir de l'URL</li>
                    <li>Apple Calendar: Fichier &gt; Nouvel abonnement</li>
                    <li>Outlook: Ajouter un calendrier &gt; S'abonner depuis le web</li>
                  </ul>
                </div>
                <button
                  onClick={handleRevokeToken}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Revoquer ce lien
                </button>
              </div>
            ) : (
              <Button
                onClick={handleGenerateToken}
                disabled={isGeneratingToken}
                variant="outline"
              >
                {isGeneratingToken ? 'Generation...' : 'Generer un lien d\'abonnement'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
