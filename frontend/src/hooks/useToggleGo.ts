import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleGo } from "@/api/events";

export function useToggleGo() {
  const queryClient = useQueryClient();

  return useMutation({
    // What to run when we call mutate(eventId).
    mutationFn: (eventId: string) => toggleGo(eventId),
    // After it worked: mark the cached events as old, so React Query refetches them.
    // For that we should use invalidateQueries.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
