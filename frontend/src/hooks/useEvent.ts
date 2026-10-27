import { getEvent } from "@/api/events";
import { useQuery } from "@tanstack/react-query";

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id),
  });
}
