import { Link } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventDate, formatPrice } from "@/lib/format";
import type { ArtEvent } from "@/types/event";
import { StatusBadge } from "./StatusBadge";

interface EventCardProps {
  event: ArtEvent;
  showStatus?: boolean;
}

export function EventCard({ event, showStatus }: EventCardProps) {
  return (
    // The whole card is a link to the detail page
    <Link
      to={`/events/${event._id}`}
      className="block h-full rounded-xl transition-shadow hover:shadow-md"
    >
      <Card className="h-full overflow-hidden">
        {/* No image → a grey box of the same size, so every card lines up */}
        {event.image ? (
          <img
            src={event.image}
            // Empty alt: the image is decorative here, the title is read just below
            alt=""
            className="h-40 w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-40 w-full items-center justify-center bg-muted text-muted-foreground"
          >
            <ImageIcon className="size-8" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          {showStatus && <StatusBadge status={event.status} />}
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="mb-2">{event.venue}</div>
          <div className="mb-2">{formatEventDate(event.date)}</div>
          <div className="mb-2">
            {event.category} · {formatPrice(event.price)}
          </div>
          {showStatus && event.status === "rejected" && event.rejectionNote && (
            <p className="text-destructive">
              Admin note: {event.rejectionNote}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
