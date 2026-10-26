import { EventsMap } from "@/components/EventsMap";
import { PageTitle } from "@/components/PageTitle";
import { useMapPins } from "@/hooks/useMapPins";
import { PageMessage } from "@/components/PageMessage";

export function MapPage() {
  const { pins, isLoading, isError } = useMapPins();

  if (isLoading)
    return <PageMessage variant="loading">Loading map...</PageMessage>;
  if (isError)
    return <PageMessage variant="error">Error loading map.</PageMessage>;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Map</PageTitle>
      <section aria-label="Map of published events">
        <p className="sr-only">
          The same events are listed as text on the Events page.
        </p>
        <EventsMap pins={pins} />
      </section>
      <p className="text-sm text-muted-foreground">
        ● Filled: events you're going to · ○ Empty: other events
      </p>
    </div>
  );
}
