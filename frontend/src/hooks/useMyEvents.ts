import type { EventFilters } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getEvents } from "@/api/events";

export function useMyEvents(filters: EventFilters = {}) {
  const { user } = useAuth();
  const myFilters = { ...filters, owner: user?.uid };
  return useQuery({
    queryKey: ["events", myFilters],
    queryFn: () => getEvents(myFilters),
    enabled: Boolean(user),
  });
}
