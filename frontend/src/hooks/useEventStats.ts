import { useMemo } from "react";
import { useEvents } from "./useEvents";
import { countByLabel } from "@/lib/stats";

export function useEventStats() {
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });

  const eventsByCategory = useMemo(() => {
    if (!events) {
      return [];
    }
    return countByLabel(events.map((event) => event.category));
  }, [events]);

  const eventsByMonth = useMemo(() => {
    if (!events) {
      return [];
    }
    return countByLabel(
      events.map((event) => {
        return new Date(event.date).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
      }),
    );
  }, [events]);

  return { eventsByCategory, eventsByMonth, isLoading, isError };
}
