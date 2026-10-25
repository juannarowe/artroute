import { useMyEvents } from "@/hooks/useMyEvents";
import { PageTitle } from "@/components/PageTitle";
import { EventList } from "@/components/EventList";

export function MyEvents() {
  const { data: events, isLoading, isError } = useMyEvents();

  if (isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-destructive">Error loading events.</p>
    );
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
