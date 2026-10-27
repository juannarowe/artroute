import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArtEvent } from "@/types/event";

interface PopularEventsProps {
  events: ArtEvent[];
}

export function PopularEvents({ events }: PopularEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most popular</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nobody has marked Go yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-2 text-sm">
            {events.map((event, index) => (
              <li key={event._id} className="flex justify-between gap-2">
                <Link to={`/events/${event._id}`} className="underline">
                  {index + 1}. {event.title}
                </Link>
                <span className="shrink-0 text-muted-foreground">
                  {event.attendees.length} going
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
