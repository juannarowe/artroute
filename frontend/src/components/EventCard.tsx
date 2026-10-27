import { Link } from "react-router-dom";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCategory, formatEventDate, formatPrice } from "@/lib/format";
import type { ArtEvent } from "@/types/event";
import { GoButton } from "./GoButton";
import { StatusBadge } from "./StatusBadge";

interface EventCardProps {
  event: ArtEvent;
  showStatus?: boolean;
  isGoing?: boolean;
  isTogglingGo?: boolean;
  onToggleGo?: () => void;
}

export function EventCard({
  event,
  showStatus,
  isGoing = false,
  isTogglingGo = false,
  onToggleGo,
}: EventCardProps) {
  return (
    <Card className="relative h-full overflow-hidden transition-shadow hover:shadow-md">
      {event.image ? (
        <img src={event.image} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-40 w-full items-center justify-center bg-muted text-muted-foreground"
        >
          <ImageIcon className="size-8" />
        </div>
      )}
      <CardHeader>
        <p className="text-sm font-medium">
          Opening on {formatEventDate(event.date)}
        </p>
        <CardTitle>
          <Link
            to={`/events/${event._id}`}
            className="after:absolute after:inset-0"
          >
            {event.title}
          </Link>
        </CardTitle>
        {showStatus && <StatusBadge status={event.status} />}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>{event.venue}</p>
        <div className="flex items-center justify-between gap-2">
          <p>
            {formatCategory(event.category)} · {formatPrice(event.price)}
          </p>
          {onToggleGo && (
            <div className="relative z-10">
              <GoButton
                size="sm"
                isGoing={isGoing}
                disabled={isTogglingGo}
                onClick={onToggleGo}
              />
            </div>
          )}
        </div>
        {showStatus && event.status === "rejected" && event.rejectionNote && (
          <p className="text-destructive">Admin note: {event.rejectionNote}</p>
        )}
      </CardContent>
    </Card>
  );
}
