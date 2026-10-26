import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyName } from "@/api/users";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => updateMyName(name),
    // The profile (and the role in the nav) comes from ["currentUser"]: refresh it
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
