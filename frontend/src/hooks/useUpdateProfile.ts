import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyName } from "@/api/users";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => updateMyName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
