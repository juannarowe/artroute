import { apiFetch } from "@/lib/api";
import type { AppUser } from "@/types/user";

export function getCurrentUser(): Promise<AppUser> {
  return apiFetch("/users/me");
}

// The user can only change their own name (role and email are not editable)
export function updateMyName(name: string): Promise<AppUser> {
  return apiFetch("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}
