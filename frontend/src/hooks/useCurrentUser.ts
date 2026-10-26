import { getCurrentUser } from "@/api/users";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["currentUser", user?.uid],
    queryFn: getCurrentUser,
    enabled: Boolean(user),
  });
}
