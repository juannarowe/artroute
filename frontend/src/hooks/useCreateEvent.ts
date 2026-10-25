import { createEvent } from "@/api/events";
import type { CreateEventInput } from "@/types/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
