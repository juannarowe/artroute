import { importFromArtBarcelona } from "@/api/imports";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useImportArtBarcelona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importFromArtBarcelona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
