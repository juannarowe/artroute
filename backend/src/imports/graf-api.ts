const GRAF_EVENTS_URL =
  'https://www.graf.cat/wp-json/wp/v2/events/?per_page=100&_fields=title,link,start,end,acf,abe_event_venue,abe_event_category';

export interface GrafEvent {
  link: string;
  title: { rendered: string };
  acf: { _event_free?: boolean };
  abe_event_venue: string;
  abe_event_category: string;
  start: string;
}

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

export function parseBarcelonaTime(start: string): Date {
  const localTime = start.slice(0, 16);
  const timeAsUtc = new Date(localTime + ':00Z');

  const offsetText = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  })
    .formatToParts(timeAsUtc)
    .find((part) => part.type === 'timeZoneName')?.value;
  const offsetHours = Number(offsetText?.slice(3, 6));

  return new Date(timeAsUtc.getTime() - offsetHours * 60 * 60 * 1000);
}
