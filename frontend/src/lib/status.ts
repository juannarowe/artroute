import type { EventStatus } from "@/types/event";

export const STATUS_LABELS: Record<EventStatus, string> = {
  pending: "Pending review",
  published: "Published",
  rejected: "Rejected",
};
