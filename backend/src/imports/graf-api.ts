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
  start: string; // e.g. "2026-11-05T19:30:00+02:00" (the offset can be wrong, see below)
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

// GRAF sends the right Barcelona time ("18:30") but sometimes the wrong offset:
// "+02:00" (summer time) even after the clocks changed to winter time (+01:00).
// So we ignore its offset and read the time as Barcelona time.
// "2026-10-29T18:30:00+02:00" → 2026-10-29 17:30 UTC (= 18:30 in Barcelona)
export function parseBarcelonaTime(start: string): Date {
  const localTime = start.slice(0, 16); // "2026-10-29T18:30"
  const timeAsUtc = new Date(localTime + ':00Z');

  // Barcelona's offset on that day, e.g. "GMT+01:00" in winter
  const offsetText = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  })
    .formatToParts(timeAsUtc)
    .find((part) => part.type === 'timeZoneName')?.value;
  const offsetHours = Number(offsetText?.slice(3, 6)); // "GMT+01:00" → 1

  return new Date(timeAsUtc.getTime() - offsetHours * 60 * 60 * 1000);
}
