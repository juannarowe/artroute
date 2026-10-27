import { EventCard } from "@/components/EventCard";
import type { ArtEvent } from "@/types/event";

interface EventListProps {
  events: ArtEvent[];
  emptyMessage: string;
  showStatus?: boolean;
  // For the Go buttons (logged-in users only)
  userId?: string;
  isTogglingGo?: boolean;
  onToggleGo?: (eventId: string) => void;
}

export function EventList({
  events,
  emptyMessage,
  showStatus,
  userId,
  isTogglingGo,
  onToggleGo,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    // 1 column on mobile, 2 on tablet (md), 3 on desktop (lg)
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          showStatus={showStatus}
          isGoing={userId ? event.attendees.includes(userId) : false}
          isTogglingGo={isTogglingGo}
          onToggleGo={onToggleGo ? () => onToggleGo(event._id) : undefined}
        />
      ))}
    </div>
  );
}
