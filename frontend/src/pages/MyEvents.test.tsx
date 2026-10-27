import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useMyEvents } from "@/hooks/useMyEvents";
import type { ArtEvent, EventStatus } from "@/types/event";
import { MyEvents } from "./MyEvents";

// The page gets the user's events from useMyEvents. We replace it with a fake.
vi.mock("@/hooks/useMyEvents");

const feature = await loadFeature("./my-events.feature");

function createEvent(
  id: string,
  title: string,
  status: EventStatus,
  rejectionNote?: string,
): ArtEvent {
  return {
    _id: id,
    title,
    venue: "Galeria Test",
    address: "Carrer de Test 1, Barcelona",
    lat: 41.38,
    lng: 2.17,
    date: "2026-11-05T18:00:00.000Z",
    category: "painting",
    description: "A test event.",
    price: 0,
    createdBy: "user-ana",
    status,
    rejectionNote,
    attendees: [],
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
}

function mockMyEvents(events: ArtEvent[]) {
  vi.mocked(useMyEvents).mockReturnValue({
    data: events,
    isLoading: false,
    isError: false,
  } as ReturnType<typeof useMyEvents>);
}

function renderMyEvents() {
  render(
    <MemoryRouter>
      <MyEvents />
    </MemoryRouter>,
  );
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
  });

  Scenario(
    "The user sees the status of each of their events",
    ({ Given, When, Then, And }) => {
      Given("the user has a pending, a published and a rejected event", () => {
        mockMyEvents([
          createEvent("event-1", "Waiting Show", "pending"),
          createEvent("event-2", "Live Show", "published"),
          createEvent("event-3", "Untitled", "rejected", "Please add an image"),
        ]);
      });
      When("they open My Events", () => {
        renderMyEvents();
      });
      Then(
        'they see the badges "Pending review", "Published" and "Rejected"',
        () => {
          expect(screen.getByText("Pending review")).toBeInTheDocument();
          expect(screen.getByText("Published")).toBeInTheDocument();
          expect(screen.getByText("Rejected")).toBeInTheDocument();
        },
      );
      And('they see the admin note "Please add an image"', () => {
        expect(
          screen.getByText("Admin note: Please add an image"),
        ).toBeInTheDocument();
      });
    },
  );

  Scenario(
    "The user has not created any event yet",
    ({ Given, When, Then }) => {
      Given("the user has no events", () => {
        mockMyEvents([]);
      });
      When("they open My Events", () => {
        renderMyEvents();
      });
      Then(`they see the message "You haven't created any event yet."`, () => {
        expect(
          screen.getByText("You haven't created any event yet."),
        ).toBeInTheDocument();
      });
    },
  );
});
