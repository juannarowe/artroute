// Public API of GRAF (the Barcelona galleries association), used by artbarcelona.es
const GRAF_EVENTS_URL =
  'https://www.graf.cat/wp-json/wp/v2/events/?per_page=100&_fields=title,link,start,end,acf,abe_event_venue,abe_event_category';

// One event as GRAF sends it (only the fields we use)
export interface GrafEvent {
  link: string;
  title: { rendered: string };
  acf: { _event_free?: boolean };
  abe_event_venue: string;
  abe_event_category: string;
  start: string; // ISO date with time zone, e.g. "2026-11-05T19:30:00+02:00"
}

// Upcoming openings ("Inauguració") from the GRAF agenda, the soonest first
export async function fetchUpcomingOpenings(): Promise<GrafEvent[]> {
  const response = await fetch(GRAF_EVENTS_URL);
  if (!response.ok) {
    throw new Error('GRAF API error: ' + response.status);
  }
  const events = (await response.json()) as GrafEvent[];
  const openings = events
    .filter(
      (event) =>
        event.abe_event_category === 'Inauguració' &&
        new Date(event.start) > new Date(),
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  return openings;
}
