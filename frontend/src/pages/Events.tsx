import { EventCard } from "@/components/EventCard";
import { PageTitle } from "@/components/PageTitle";
import { useEvents } from "@/hooks/useEvents";

export function Events() {
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events.</div>;

  return (
    <div>
      <PageTitle>Events</PageTitle>
      <div className="flex flex-col gap-4">
        {events?.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
