import { Link } from "react-router-dom";
import { EventList } from "@/components/EventList";
import { PageTitle } from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useGoingEvents } from "@/hooks/useGoingEvents";
import { useToggleGo } from "@/hooks/useToggleGo";
import { PageMessage } from "@/components/PageMessage";

export function Events() {
  const { user } = useAuth();
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });
  const { data: goingEvents } = useGoingEvents();
  const toggleGoMutation = useToggleGo();

  if (isLoading)
    return <PageMessage variant="loading">Loading events...</PageMessage>;
  if (isError)
    return <PageMessage variant="error">Error loading events.</PageMessage>;

  const goProps = user
    ? {
        userId: user.uid,
        isTogglingGo: toggleGoMutation.isPending,
        onToggleGo: (eventId: string) => toggleGoMutation.mutate(eventId),
      }
    : {};

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Events</PageTitle>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="going">Going</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EventList
            events={events ?? []}
            emptyMessage="No events yet."
            {...goProps}
          />
        </TabsContent>

        <TabsContent value="going">
          {user ? (
            <EventList
              events={goingEvents}
              emptyMessage="You haven't marked any event as Go yet."
              {...goProps}
            />
          ) : (
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
