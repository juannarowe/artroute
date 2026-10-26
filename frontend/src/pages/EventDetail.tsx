import { useParams, Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { useEvent } from "@/hooks/useEvent";
import { formatEventDate, formatPrice } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useToggleGo } from "@/hooks/useToggleGo";
import { Button } from "@/components/ui/button";

export function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading, isError } = useEvent(id);
  const { user } = useAuth();
  const toggleGoMutation = useToggleGo();

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

  const isGoing = user ? event.attendees.includes(user.uid) : false;

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
        <p>{event.venue}</p>
        <p>{event.address}</p>
        <p>{formatEventDate(event.date)}</p>
        <p>
          {event.category} · {formatPrice(event.price)}
        </p>
      </div>

      <p>{event.description}</p>

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

      <p className="text-sm">{event.attendees.length} going</p>

      {user ? (
        <Button
          variant={isGoing ? "outline" : "default"}
          disabled={toggleGoMutation.isPending}
          onClick={() => toggleGoMutation.mutate(event._id)}
        >
          {isGoing ? "Going" : "Go"}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="underline">
            Log in{" "}
          </Link>
          to mark go.
        </p>
      )}
    </article>
  );
}
