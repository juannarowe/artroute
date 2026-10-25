import { useMemo } from "react";
import { useAuth } from "./useAuth";
import type { CalendarItem } from "@/types/calendar";
import { useEvents } from "./useEvents";

export function useCalendarItems() {
  const { user } = useAuth();
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });

  const items: CalendarItem[] = useMemo(() => {
    if (!events) {
      return [];
    }
    return events.map((event) => ({
      id: event._id,
      title: event.title,
      start: event.date,
      isGoing: user ? event.attendees.includes(user.uid) : false,
    }));
  }, [events, user]);

  return { items, isLoading, isError };
}
