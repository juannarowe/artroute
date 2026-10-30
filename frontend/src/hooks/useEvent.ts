import { getEvent } from "@/api/events";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { isNotFoundError } from "@/lib/api";

const MAX_RETRIES = 3;

export function useEvent(id: string | undefined) {
  const { user, loading } = useAuth();

  const eventQuery = useQuery({
    queryKey: ["event", id, user?.uid],
    queryFn: () => getEvent(id as string),
    enabled: Boolean(id) && !loading,
    retry: (failureCount, error) => {
      if (isNotFoundError(error)) {
        return false;
      }
      return failureCount < MAX_RETRIES;
    },
  });

  return {
    ...eventQuery,
    isNotFound: isNotFoundError(eventQuery.error),
  };
}
