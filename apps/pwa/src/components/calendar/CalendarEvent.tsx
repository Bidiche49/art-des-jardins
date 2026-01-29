import { EventProps } from 'react-big-calendar';
import type { Absence } from '@/api';

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

export function CalendarEvent({ event }: EventProps<CalendarEventData>) {
  const isAbsence = event.resource?.type === 'absence';

  if (isAbsence) {
    return (
      <div className="px-1 py-0.5 overflow-hidden text-xs leading-tight">
        <div className="font-medium truncate">{event.title}</div>
      </div>
    );
  }

  const intervention = event.resource?.intervention;
  const location = intervention?.chantier?.ville || '';

  return (
    <div className="px-1 py-0.5 overflow-hidden text-xs leading-tight">
      <div className="font-medium truncate">{event.title}</div>
      {location && <div className="truncate opacity-80">{location}</div>}
    </div>
  );
}
