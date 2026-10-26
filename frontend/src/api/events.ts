import { apiFetch } from "@/lib/api";
import type {
  ArtEvent,
  CreateEventInput,
  EventFilters,
  UpdateStatusInput,
} from "@/types/event";

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

export function toggleGo(id: string): Promise<ArtEvent> {
  return apiFetch(`/events/${id}/go`, { method: "POST" });
}

export function createEvent(input: CreateEventInput): Promise<ArtEvent> {
  return apiFetch(`/events`, { method: "POST", body: JSON.stringify(input) });
}

export function updateEventStatus(
  id: string,
  input: UpdateStatusInput,
): Promise<ArtEvent> {
  return apiFetch(`/events/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
