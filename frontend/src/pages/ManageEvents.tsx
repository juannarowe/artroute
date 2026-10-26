import { Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { RejectEventDialog } from "@/components/RejectEventDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEvents } from "@/hooks/useEvents";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";
import { formatEventDate } from "@/lib/format";
import { PageMessage } from "@/components/PageMessage";

// Admin panel: approve or reject pending events, and see every event.
export function ManageEvents() {
  // Two lists from the backend: the pending ones, and all events (any status)
  const pendingQuery = useEvents({ status: "pending" });
  const allQuery = useEvents();
  const updateStatusMutation = useUpdateStatus();

  if (pendingQuery.isLoading || allQuery.isLoading) {
    return <PageMessage variant="loading">Loading events...</PageMessage>;
  }
  if (pendingQuery.isError || allQuery.isError) {
    return <PageMessage variant="error">Could not load events.</PageMessage>;
  }

  const pendingEvents = pendingQuery.data ?? [];
  const allEvents = allQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle>Manage Events</PageTitle>

      {updateStatusMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {updateStatusMutation.error.message}
        </p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">
          Pending review ({pendingEvents.length})
        </h2>

        {pendingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing to review. 🎉</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>
                    <Link to={`/events/${event._id}`} className="underline">
                      {event.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {event.venue}
                    </p>
                  </TableCell>
                  <TableCell>{formatEventDate(event.date)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() =>
                          updateStatusMutation.mutate({
                            eventId: event._id,
                            input: { status: "published" },
                          })
                        }
                      >
                        Approve
                      </Button>
                      <RejectEventDialog
                        eventTitle={event.title}
                        disabled={updateStatusMutation.isPending}
                        onConfirm={(note) =>
                          updateStatusMutation.mutate({
                            eventId: event._id,
                            // An empty note is not sent
                            input: {
                              status: "rejected",
                              rejectionNote: note || undefined,
                            },
                          })
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">
          All events ({allEvents.length})
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>
                  <Link to={`/events/${event._id}`} className="underline">
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell>{formatEventDate(event.date)}</TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
