import { PageTitle } from "@/components/PageTitle";
import { useNavigate } from "react-router-dom";
import { EventForm } from "@/components/EventForm";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import type { CreateEventInput } from "@/types/event";

export function CreateEvent() {
  const navigate = useNavigate();
  const createEventMutation = useCreateEvent();

  function handleSubmit(values: CreateEventInput) {
    createEventMutation.mutate(values, {
      onSuccess: (createdEvent) => {
        navigate(`/events/${createdEvent._id}`);
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Create Event</PageTitle>
      <p className="text-sm text-muted-foreground">
        New events are reviewed by an admin before they are published.
      </p>
      <EventForm
        onSubmit={handleSubmit}
        isSubmitting={createEventMutation.isPending}
        errorMessage={createEventMutation.error?.message}
      />
    </div>
  );
}
