import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/types/event";

// Text and badge style for each status, in one place
const statusLabels: Record<EventStatus, string> = {
  pending: "Pending review",
  published: "Published",
  rejected: "Rejected",
};

const statusVariants: Record<
  EventStatus,
  "secondary" | "default" | "destructive"
> = {
  pending: "secondary",
  published: "default",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
