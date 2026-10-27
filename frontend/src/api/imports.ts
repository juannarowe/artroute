import { apiFetch } from "@/lib/api";
import type { ImportResult } from "@/types/import";

// Admin only: creates pending events from the ArtBarcelona agenda (takes ~30 s)
export function importFromArtBarcelona(): Promise<ImportResult> {
  return apiFetch(`/imports/artbarcelona`, { method: "POST" });
}
