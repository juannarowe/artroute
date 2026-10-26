import { updateEventStatus } from "@/api/events";
import type { UpdateStatusInput } from "@/types/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      input,
    }: {
      eventId: string;
      input: UpdateStatusInput;
    }) => updateEventStatus(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
