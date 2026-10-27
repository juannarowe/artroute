import { importFromArtBarcelona } from "@/api/imports";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useImportArtBarcelona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importFromArtBarcelona,
    onSuccess: () => {
      // New pending events: refresh the lists in the Manage page
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
