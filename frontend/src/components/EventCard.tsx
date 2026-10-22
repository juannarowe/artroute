import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventDate, formatPrice } from "@/lib/format";
import type { ArtEvent } from "@/types/event";

interface EventCardProps {
  event: ArtEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    // The whole card is a link to the detail page
    <Link to={`/events/${event._id}`} className="block">
      <Card className="overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="h-40 w-full object-cover"
          />
        )}
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="mb-2">{event.venue}</div>
          <div className="mb-2">{formatEventDate(event.date)}</div>
          <div className="mb-2">
            {event.category} · {formatPrice(event.price)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
