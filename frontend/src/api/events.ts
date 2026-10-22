import { apiFetch } from "@/lib/api";
import type { ArtEvent, EventFilters } from "@/types/event";

export function getEvents(filters: EventFilters = {}): Promise<ArtEvent[]> {
  const params = new URLSearchParams();
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.owner) {
    params.set("owner", filters.owner);
  }
  return apiFetch(`/events?${params.toString()}`);
}

export function getEvent(id: string): Promise<ArtEvent> {
  return apiFetch(`/events/${id}`);
}
