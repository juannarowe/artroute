import { useCalendarItems } from "@/hooks/useCalendarItems";
import { PageTitle } from "@/components/PageTitle";
import { EventsCalendar } from "@/components/EventsCalendar";

export function Calendar() {
  const { items, isLoading, isError } = useCalendarItems();

  if (isLoading)
    return (
      <p className="py-8 text-center text-muted-foreground">
        Loading calendar...
      </p>
    );
  if (isError)
    return (
      <p className="py-8 text-center text-destructive">
        Error loading calendar.
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Calendar</PageTitle>
      <EventsCalendar items={items} />
      <p className="text-sm text-muted-foreground">
        ■ Black: events you're going to · □ White: other events
      </p>
    </div>
  );
}
