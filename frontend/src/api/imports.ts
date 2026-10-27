import { apiFetch } from "@/lib/api";
import type { ImportResult } from "@/types/import";

export function importFromArtBarcelona(): Promise<ImportResult> {
  return apiFetch(`/imports/artbarcelona`, { method: "POST" });
}
