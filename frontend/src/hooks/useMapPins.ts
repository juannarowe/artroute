import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { useEvents } from "./useEvents";
import type { MapPin } from "@/types/map";

export function useMapPins() {
  const { user } = useAuth();
  const {
    data: events,
    isLoading,
    isError,
  } = useEvents({ status: "published" });

  const pins: MapPin[] = useMemo(() => {
    if (!events) {
      return [];
    }
    return events.map((event) => ({
      id: event._id,
      lat: event.lat,
      lng: event.lng,
      title: event.title,
      isGoing: user ? event.attendees.includes(user.uid) : false,
    }));
  }, [events, user]);

  return { pins, isLoading, isError };
}
