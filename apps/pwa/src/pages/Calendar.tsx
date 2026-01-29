import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { interventionsApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { Card, Button, Spinner } from '@/components/ui';
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar';
import { CalendarEvent } from '@/components/calendar/CalendarEvent';
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
  resource: {
    intervention: any;
    color: string;
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

export function Calendar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Array<{ id: string; nom: string; prenom: string }>>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

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

      const response = await interventionsApi.getAll({
        dateDebut: start.toISOString(),
        dateFin: end.toISOString(),
        limit: 500,
      } as any);

      const interventions = response.data || [];

      // Extract unique employees
      const employeeMap = new Map<string, { id: string; nom: string; prenom: string }>();
      interventions.forEach((intervention: any) => {
        if (intervention.employe) {
          employeeMap.set(intervention.employe.id, intervention.employe);
        }
      });
      setEmployees(Array.from(employeeMap.values()));

      // Convert to calendar events
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
          },
        };
      });

      setEvents(calendarEvents);
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
    if (selectedEmployee === 'all') return events;
    return events.filter(
      (event) =>
        event.resource.intervention.employeId === selectedEmployee ||
        (selectedEmployee === 'unassigned' && !event.resource.intervention.employeId)
    );
  }, [events, selectedEmployee]);

  const handleSelectEvent = useCallback(
    (event: CalendarEventData) => {
      navigate(`/interventions/${event.id}`);
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
    () => canDrag,
    [canDrag]
  );

  const resizableAccessor = useCallback(
    () => canDrag,
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
        <span className="text-sm text-gray-500 whitespace-nowrap">Legende:</span>
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
      </div>
    </div>
  );
}
