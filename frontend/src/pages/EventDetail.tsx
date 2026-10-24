import { useParams } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { useEvent } from "@/hooks/useEvent";
import { formatEventDate, formatPrice } from "@/lib/format";

export function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading, isError } = useEvent(id);

  if (isLoading) {
    return (
      <p className="py-8 text-center text-muted-foreground">Loading event...</p>
    );
  }
  // The backend answers 404 for unknown or invalid ids → apiFetch throws → isError
  if (isError || !event) {
    return (
      <p className="py-8 text-center text-muted-foreground">Event not found.</p>
    );
  }

  return (
    <article className="flex flex-col gap-4">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="h-56 w-full rounded-lg object-cover"
        />
      )}

      <PageTitle>{event.title}</PageTitle>

      <div className="text-sm text-muted-foreground">
        <div>
          <p>{event.venue}</p>
          <p>{event.address}</p>
          <p>{formatEventDate(event.date)}</p>
          <p>
            {event.category} · {formatPrice(event.price)}
          </p>
        </div>
      </div>

      <p>{event.description}</p>

      <div>
        {event.externalLink && (
          <a
            href={event.externalLink}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            More info
          </a>
        )}
      </div>

      <p className="text-sm">{event.attendees.length} going</p>
    </article>
  );
}
