import { apiFetch } from "@/lib/api";
import type { AppUser } from "@/types/user";

export function getCurrentUser(): Promise<AppUser> {
  return apiFetch("/users/me");
}
