import { Link } from "react-router-dom";
import { EventList } from "@/components/EventList";
import { PageTitle } from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useGoingEvents } from "@/hooks/useGoingEvents";

export function Events() {
  const { user } = useAuth();
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });
  const { data: goingEvents } = useGoingEvents();

  if (isLoading)
    return (
      <p className="py-8 text-center text-muted-foreground">
        Loading events...
      </p>
    );
  if (isError)
    return (
      <p className="py-8 text-center text-destructive">Error loading events.</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Events</PageTitle>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="going">Going</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EventList events={events ?? []} emptyMessage="No events yet." />
        </TabsContent>

        <TabsContent value="going">
          {user ? (
            // A: what logged-in users see.
            <EventList
              events={goingEvents}
              emptyMessage="You haven't marked any event as Go yet."
            />
          ) : (
            // B: what logged-out users see.
            <p className="py-8 text-center text-muted-foreground">
              <Link to="/login" className="underline">
                Log in
              </Link>{" "}
              to see the events you're going to.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
