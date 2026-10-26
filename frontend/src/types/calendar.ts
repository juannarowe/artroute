// One entry in the calendar: only what the calendar needs to know about an event
export interface CalendarItem {
  id: string;
  title: string;
  start: string; // ISO date string, e.g. "2026-11-05T18:00:00.000Z"
  isGoing: boolean;
}
