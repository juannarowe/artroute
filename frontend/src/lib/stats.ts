import type { StatPoint } from "@/types/stats";

export function countByLabel(labels: string[]): StatPoint[] {
  const counts: Record<string, number> = {};

  for (const label of labels) {
    counts[label] = (counts[label] ?? 0) + 1;
  }

  return Object.entries(counts).map(([label, count]) => ({ label, count }));
}
