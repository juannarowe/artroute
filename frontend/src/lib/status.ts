import type { EventStatus } from "@/types/event";

// Text for each status, in one place (badges and stats)
export const STATUS_LABELS: Record<EventStatus, string> = {
  pending: "Pending review",
  published: "Published",
  rejected: "Rejected",
};
