import { useParams, Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { useEvent } from "@/hooks/useEvent";
import { formatCategory, formatEventDate, formatPrice } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useToggleGo } from "@/hooks/useToggleGo";
import { GoButton } from "@/components/GoButton";
import { PageMessage } from "@/components/PageMessage";
import { GoErrorMessage } from "@/components/GoErrorMessage";
import { Button } from "@/components/ui/button";

export function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading, isNotFound, isError, refetch } = useEvent(id);
  const { user } = useAuth();
  const toggleGoMutation = useToggleGo();

  if (isLoading) {
    return <PageMessage variant="loading">Loading event...</PageMessage>;
  }
  if (isNotFound) {
    return (
      <div className="flex flex-col items-center">
        <PageMessage variant="info">Event not found.</PageMessage>
        <Link to="/events" className="underline">
          Back to events
        </Link>
      </div>
    );
  }
  if (isError || !event) {
    return (
      <div className="flex flex-col items-center">
        <PageMessage variant="error">
          We couldn't load this event. Check your connection and try again.
        </PageMessage>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const isGoing = user ? event.attendees.includes(user.uid) : false;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-4">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="h-56 w-full rounded-lg object-cover md:h-80"
        />
      )}

      <PageTitle>{event.title}</PageTitle>

      <div className="text-sm text-muted-foreground">
        <p>{event.venue}</p>
        <p>{event.address}</p>
        <p>Opening on {formatEventDate(event.date)}</p>
        <p>
          {formatCategory(event.category)} · {formatPrice(event.price)}
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
        <div className="flex flex-col gap-2">
          <GoButton
            isGoing={isGoing}
            disabled={toggleGoMutation.isPending}
            onClick={() => toggleGoMutation.mutate(event._id)}
          />
          <GoErrorMessage error={toggleGoMutation.error} />
        </div>
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
