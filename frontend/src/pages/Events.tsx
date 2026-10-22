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
      <ul>
        {events?.map((event) => (
          <li key={event._id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
}
