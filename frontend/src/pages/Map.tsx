import { EventsMap } from "@/components/EventsMap";
import { PageTitle } from "@/components/PageTitle";
import { useMapPins } from "@/hooks/useMapPins";

export function MapPage() {
  const { pins, isLoading, isError } = useMapPins();

  if (isLoading)
    return (
      <p className="py-8 text-center text-muted-foreground">Loading map...</p>
    );
  if (isError)
    return (
      <p className="py-8 text-center text-destructive">Error loading map.</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Map</PageTitle>
      <EventsMap pins={pins} />
      <p className="text-sm text-muted-foreground">
        ● Filled: events you're going to · ○ Empty: other events
      </p>
    </div>
  );
}
