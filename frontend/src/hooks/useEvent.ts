import { getEvent } from "@/api/events";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useEvent(id: string | undefined) {
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ["event", id, user?.uid],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id) && !loading,
  });
}
