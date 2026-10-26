import type { StatPoint } from "@/types/stats";

// ["painting", "sculpture", "painting"] → [{ label: "painting", count: 2 }, { label: "sculpture", count: 1 }]
export function countByLabel(labels: string[]): StatPoint[] {
  const counts: Record<string, number> = {};

  for (const label of labels) {
    counts[label] = (counts[label] ?? 0) + 1;
  }

  // Turn the object into the list the chart needs:
  // { painting: 2, sculpture: 1 } → [{ label: "painting", count: 2 }, ...]
  return Object.entries(counts).map(([label, count]) => ({ label, count }));
}
