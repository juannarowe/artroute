import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleGo } from "@/api/events";

export function useToggleGo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => toggleGo(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
