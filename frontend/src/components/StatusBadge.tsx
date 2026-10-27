import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/status";
import type { EventStatus } from "@/types/event";

const statusVariants: Record<
  EventStatus,
  "secondary" | "default" | "destructive"
> = {
  pending: "secondary",
  published: "default",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge variant={statusVariants[status]}>{STATUS_LABELS[status]}</Badge>
  );
}
