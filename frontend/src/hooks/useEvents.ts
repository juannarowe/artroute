import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/api/events";
import type { EventFilters } from "@/types/event";

// Single source of truth: Events, Map, Calendar and stats all read this cache
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => getEvents(filters),
  });
}
