import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useToggleGo } from "@/hooks/useToggleGo";
import type { ArtEvent } from "@/types/event";
import { Events } from "./Events";

// The page gets its data from hooks. In the test we replace (mock) the hooks,
// so no backend and no Firebase are needed. useGoingEvents is NOT mocked:
// it runs for real on top of the mocked useEvents.
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEvents");
vi.mock("@/hooks/useToggleGo");
const toggleGo = vi.fn();
vi.mocked(useToggleGo).mockReturnValue({
  mutate: toggleGo,
  isPending: false,
} as unknown as ReturnType<typeof useToggleGo>);

const feature = await loadFeature("./events-page.feature");

// Builds a fake published event with only a title and an id
function createEvent(id: string, title: string): ArtEvent {
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
    createdBy: "seed-user-1",
    status: "published",
    attendees: [],
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
}

const twoEvents = [
  createEvent("event-1", "Light & Shadow"),
  createEvent("event-2", "Blue Hours"),
];

// What useEvents returns once the data has arrived
function mockPublishedEvents(events: ArtEvent[]) {
  vi.mocked(useEvents).mockReturnValue({
    data: events,
    isLoading: false,
    isError: false,
  } as ReturnType<typeof useEvents>);
}

// What useAuth returns: a user object when logged in, null when logged out
function mockLoggedIn(isLoggedIn: boolean) {
  vi.mocked(useAuth).mockReturnValue({
    user: isLoggedIn ? { uid: "user-ana" } : null,
    loading: false,
  } as ReturnType<typeof useAuth>);
}

// <Link> needs a router, like in the NotFound test
function renderEventsPage() {
  render(
    <MemoryRouter>
      <Events />
    </MemoryRouter>,
  );
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  // Clean the page after each scenario (not after each step)
  AfterEachScenario(() => {
    cleanup();
    toggleGo.mockClear();
  });

  Scenario(
    "A visitor sees the published events as cards",
    ({ Given, When, Then, And }) => {
      Given("there are 2 published events", () => {
        mockPublishedEvents(twoEvents);
        mockLoggedIn(false);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      Then('they see the event "Light & Shadow"', () => {
        expect(screen.getByText("Light & Shadow")).toBeInTheDocument();
      });
      And('they see the event "Blue Hours"', () => {
        expect(screen.getByText("Blue Hours")).toBeInTheDocument();
      });
      And("each event links to its detail page", () => {
        const firstCard = screen.getByRole("link", { name: /Light & Shadow/ });
        expect(firstCard).toHaveAttribute("href", "/events/event-1");
      });
      And("each card says when the opening is", () => {
        expect(screen.getAllByText(/^Opening on Thu 5 Nov/)).toHaveLength(2);
      });
    },
  );

  Scenario(
    "The page explains when there are no events",
    ({ Given, When, Then }) => {
      Given("there are 0 published events", () => {
        mockPublishedEvents([]);
        mockLoggedIn(false);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      Then('they see the message "No events yet."', () => {
        expect(screen.getByText("No events yet.")).toBeInTheDocument();
      });
    },
  );

  Scenario(
    "A logged-out visitor is invited to log in in the Going tab",
    ({ Given, When, Then, And }) => {
      Given("there are 2 published events", () => {
        mockPublishedEvents(twoEvents);
      });
      And("the visitor is logged out", () => {
        mockLoggedIn(false);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      And('they open the "Going" tab', async () => {
        await userEvent.click(screen.getByRole("tab", { name: "Going" }));
      });
      Then("they see a link to log in", () => {
        const loginLink = screen.getByRole("link", { name: "Log in" });
        expect(loginLink).toHaveAttribute("href", "/login");
      });
    },
  );

  Scenario(
    'A logged-in user with no "Go" events sees an empty message',
    ({ Given, When, Then, And }) => {
      Given("there are 2 published events", () => {
        mockPublishedEvents(twoEvents);
      });
      And("the visitor is logged in", () => {
        mockLoggedIn(true);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      And('they open the "Going" tab', async () => {
        await userEvent.click(screen.getByRole("tab", { name: "Going" }));
      });
      Then(
        `they see the message "You haven't marked any event as Go yet."`,
        () => {
          expect(
            screen.getByText("You haven't marked any event as Go yet."),
          ).toBeInTheDocument();
        },
      );
    },
  );

  Scenario(
    "A logged-out visitor sees no Go buttons on the cards",
    ({ Given, When, Then, And }) => {
      Given("there are 2 published events", () => {
        mockPublishedEvents(twoEvents);
      });
      And("the visitor is logged out", () => {
        mockLoggedIn(false);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      Then("there are no Go buttons", () => {
        expect(screen.queryByRole("button", { name: "Go" })).toBeNull();
      });
    },
  );

  Scenario(
    "A logged-in user marks Go from a card",
    ({ Given, When, Then, And }) => {
      // The fake's history is cleared between steps, so we save it in the click step
      let markedEventId: string | undefined;

      Given("there are 2 published events", () => {
        mockPublishedEvents(twoEvents);
      });
      And("the visitor is logged in", () => {
        mockLoggedIn(true);
      });
      When("the visitor opens the events page", () => {
        renderEventsPage();
      });
      And("they click Go on the first card", async () => {
        const goButtons = screen.getAllByRole("button", { name: "Go" });
        await userEvent.click(goButtons[0]);
        markedEventId = toggleGo.mock.calls[0]?.[0];
      });
      Then('the event "event-1" is marked as Go', () => {
        expect(markedEventId).toBe("event-1");
      });
    },
  );
});
