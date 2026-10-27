import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEvents } from "@/hooks/useEvents";
import type { ArtEvent, EventStatus } from "@/types/event";
import { Stats } from "./Stats";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useEvents");

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const feature = await loadFeature("./stats.feature");

function createEvent(
  id: string,
  title: string,
  status: EventStatus,
  goingCount: number,
): ArtEvent {
  const attendees: string[] = [];
  for (let n = 1; n <= goingCount; n++) {
    attendees.push(`user-${n}`);
  }
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
    attendees,
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };
}

function mockLoggedInUser(role: "user" | "admin") {
  vi.mocked(useAuth).mockReturnValue({
    user: { uid: "user-ana" },
    loading: false,
  } as ReturnType<typeof useAuth>);
  vi.mocked(useCurrentUser).mockReturnValue({
    data: { _id: "1", firebaseUid: "user-ana", role },
    isLoading: false,
  } as unknown as ReturnType<typeof useCurrentUser>);
}

function mockEvents(events: ArtEvent[]) {
  vi.mocked(useEvents).mockReturnValue({
    data: events,
    isLoading: false,
    isError: false,
  } as ReturnType<typeof useEvents>);
}

function renderStats() {
  render(
    <MemoryRouter>
      <Stats />
    </MemoryRouter>,
  );
}

function valueOf(label: string) {
  const totals = screen.getByRole("region", { name: "Totals" });
  return within(totals).getByText(label).previousElementSibling?.textContent;
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
  });

  Scenario(
    "An admin sees the totals and the most popular event",
    ({ Given, When, Then, And }) => {
      Given("the logged-in user is an admin", () => {
        mockLoggedInUser("admin");
      });
      And(
        "there are 2 published events with 3 and 1 going, and 1 pending event",
        () => {
          mockEvents([
            createEvent("event-1", "Light & Shadow", "published", 1),
            createEvent("event-2", "Blue Hours", "published", 3),
            createEvent("event-3", "New Studio", "pending", 0),
          ]);
        },
      );
      When("they open the stats page", () => {
        renderStats();
      });
      Then(
        'they see 3 "Events", 2 "Published", 1 "Pending review" and 4 "Going"',
        () => {
          expect(valueOf("Events")).toBe("3");
          expect(valueOf("Published")).toBe("2");
          expect(valueOf("Pending review")).toBe("1");
          expect(valueOf("Going")).toBe("4");
        },
      );
      And('the most popular event is "Blue Hours"', () => {
        const firstPlace = screen
          .getAllByRole("listitem")
          .find((item) => item.textContent?.startsWith("1."));
        expect(firstPlace).toHaveTextContent("1. Blue Hours");
      });
    },
  );

  Scenario(
    "A user who has not created events is invited to create one",
    ({ Given, When, Then, And }) => {
      Given("the logged-in user is a normal user", () => {
        mockLoggedInUser("user");
      });
      And("they have not created any event", () => {
        mockEvents([]);
      });
      When("they open the stats page", () => {
        renderStats();
      });
      Then("they see a link to create an event", () => {
        const createLink = screen.getByRole("link", { name: "Create event" });
        expect(createLink).toHaveAttribute("href", "/events/new");
      });
    },
  );
});
