import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { useEvents } from "./useEvents";

// No fetch: filters the published events the current user marked "Go"
export function useGoingEvents() {
  const { user } = useAuth();
  const eventsQuery = useEvents({ status: "published" });

  const goingEvents = useMemo(() => {
    if (!user || !eventsQuery.data) {
      return [];
    }
    return eventsQuery.data.filter((event) =>
      event.attendees.includes(user.uid),
    );
  }, [eventsQuery.data, user]);

  return { ...eventsQuery, data: goingEvents };
}
