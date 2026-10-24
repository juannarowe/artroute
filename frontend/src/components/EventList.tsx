import { EventCard } from "@/components/EventCard";
import type { ArtEvent } from "@/types/event";

interface EventListProps {
  events: ArtEvent[];
  emptyMessage: string;
}

export function EventList({ events, emptyMessage }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
