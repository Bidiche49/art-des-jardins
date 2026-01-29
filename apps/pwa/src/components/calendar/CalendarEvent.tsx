import { EventProps } from 'react-big-calendar';

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

export function CalendarEvent({ event }: EventProps<CalendarEventData>) {
  const intervention = event.resource?.intervention;
  const location = intervention?.chantier?.ville || '';

  return (
    <div className="px-1 py-0.5 overflow-hidden text-xs leading-tight">
      <div className="font-medium truncate">{event.title}</div>
      {location && <div className="truncate opacity-80">{location}</div>}
    </div>
  );
}
