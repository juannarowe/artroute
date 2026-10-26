import { useMyEvents } from "@/hooks/useMyEvents";
import { PageTitle } from "@/components/PageTitle";
import { EventList } from "@/components/EventList";
import { PageMessage } from "@/components/PageMessage";

export function MyEvents() {
  const { data: events, isLoading, isError } = useMyEvents();

  if (isLoading) {
    return <PageMessage variant="loading">Loading...</PageMessage>;
  }

  if (isError) {
    return <PageMessage variant="error">Error loading events.</PageMessage>;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>My Events</PageTitle>
      <EventList
        events={events ?? []}
        emptyMessage="You haven't created any event yet."
        showStatus={true}
      />
    </div>
  );
}
