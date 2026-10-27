import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { useCurrentUser } from "./useCurrentUser";
import { useEvents } from "./useEvents";
import { countByLabel } from "@/lib/stats";
import { formatCategory } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/status";

// How many events appear in "Most popular"
const POPULAR_EVENTS_LIMIT = 5;

export function useEventStats() {
  const { user } = useAuth();
  const { data: currentUser, isLoading: isLoadingRole } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Admin: every event of the app. Other users: only the events they created.
  // (Same cache as the Manage page and My Events: no extra requests.)
  const filters = isAdmin ? {} : { owner: user?.uid };
  const { data: events, isLoading, isError } = useEvents(filters);

  const stats = useMemo(() => {
    const allEvents = events ?? [];
    const publishedEvents = allEvents.filter(
      (event) => event.status === "published",
    );
    const pendingEvents = allEvents.filter(
      (event) => event.status === "pending",
    );

    // Total "Go" marks on the published events
    let totalGoing = 0;
    for (const event of publishedEvents) {
      totalGoing += event.attendees.length;
    }

    // [...list] makes a copy first: sort() changes the list it sorts,
    // and we must never change React Query's cached data.
    const popularEvents = [...publishedEvents]
      .filter((event) => event.attendees.length > 0)
      .sort((a, b) => b.attendees.length - a.attendees.length)
      .slice(0, POPULAR_EVENTS_LIMIT);

    return {
      totals: {
        events: allEvents.length,
        published: publishedEvents.length,
        pending: pendingEvents.length,
        going: totalGoing,
      },
      eventsByCategory: countByLabel(
        publishedEvents.map((event) => formatCategory(event.category)),
      ),
      eventsByMonth: countByLabel(
        publishedEvents.map((event) =>
          new Date(event.date).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          }),
        ),
      ),
      eventsByStatus: countByLabel(
        allEvents.map((event) => STATUS_LABELS[event.status]),
      ),
      popularEvents,
    };
  }, [events]);

  return {
    ...stats,
    isAdmin,
    isLoading: isLoading || isLoadingRole,
    isError,
  };
}
