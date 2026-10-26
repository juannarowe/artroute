import { useCalendarItems } from "@/hooks/useCalendarItems";
import { PageTitle } from "@/components/PageTitle";
import { EventsCalendar } from "@/components/EventsCalendar";
import { PageMessage } from "@/components/PageMessage";

export function Calendar() {
  const { items, isLoading, isError } = useCalendarItems();

  if (isLoading) {
    return <PageMessage variant="loading">Loading calendar...</PageMessage>;
  }
  if (isError) {
    return <PageMessage variant="error">Error loading calendar.</PageMessage>;
  }
  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Calendar</PageTitle>
      <section aria-label="Calendar of published events">
        <EventsCalendar items={items} />
      </section>
      <p className="text-sm text-muted-foreground">
        ■ Black: events you're going to · □ White: other events
      </p>
    </div>
  );
}
