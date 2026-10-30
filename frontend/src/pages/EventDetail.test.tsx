import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { useEvent } from "@/hooks/useEvent";
import { useToggleGo } from "@/hooks/useToggleGo";
import type { ArtEvent } from "@/types/event";
import { EventDetail } from "./EventDetail";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useEvent");
vi.mock("@/hooks/useToggleGo");

const refetch = vi.fn();

const feature = await loadFeature("./event-detail.feature");

const publishedEvent: ArtEvent = {
  _id: "event-1",
  title: "Light & Shadow",
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

function mockEventResult(result: {
  event?: ArtEvent;
  isNotFound?: boolean;
  isError?: boolean;
}) {
  vi.mocked(useEvent).mockReturnValue({
    data: result.event,
    isLoading: false,
    isNotFound: result.isNotFound ?? false,
    isError: result.isError ?? false,
    refetch,
  } as unknown as ReturnType<typeof useEvent>);
}

function mockLoggedIn(isLoggedIn: boolean) {
  vi.mocked(useAuth).mockReturnValue({
    user: isLoggedIn ? { uid: "user-ana" } : null,
    loading: false,
  } as ReturnType<typeof useAuth>);
}

function mockToggleGoError(error: Error | null) {
  vi.mocked(useToggleGo).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error,
  } as unknown as ReturnType<typeof useToggleGo>);
}

function renderEventPage() {
  render(
    <MemoryRouter>
      <EventDetail />
    </MemoryRouter>,
  );
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
    refetch.mockClear();
  });

  Scenario("The event does not exist", ({ Given, When, Then, And }) => {
    Given("the API answers that the event was not found", () => {
      mockEventResult({ isNotFound: true, isError: true });
      mockLoggedIn(false);
      mockToggleGoError(null);
    });
    When("the visitor opens the event page", () => {
      renderEventPage();
    });
    Then('they see the message "Event not found."', () => {
      expect(screen.getByText("Event not found.")).toBeInTheDocument();
    });
    And("they see a link back to the events", () => {
      const backLink = screen.getByRole("link", { name: "Back to events" });
      expect(backLink).toHaveAttribute("href", "/events");
    });
  });

  Scenario(
    "The server or the connection fails",
    ({ Given, When, Then, And }) => {
      Given("the API cannot load the event", () => {
        mockEventResult({ isError: true });
        mockLoggedIn(false);
        mockToggleGoError(null);
      });
      When("the visitor opens the event page", () => {
        renderEventPage();
      });
      Then(
        `they see the message "We couldn't load this event. Check your connection and try again."`,
        () => {
          expect(screen.getByRole("alert")).toHaveTextContent(
            "We couldn't load this event. Check your connection and try again.",
          );
        },
      );
      And("they can try again", async () => {
        await userEvent.click(
          screen.getByRole("button", { name: "Try again" }),
        );
        expect(refetch).toHaveBeenCalled();
      });
    },
  );

  Scenario("Marking Go fails", ({ Given, When, Then, And }) => {
    Given("a published event", () => {
      mockEventResult({ event: publishedEvent });
    });
    And("the visitor is logged in", () => {
      mockLoggedIn(true);
    });
    And(
      'marking Go fails with "Could not reach the server. Check your connection."',
      () => {
        mockToggleGoError(
          new Error("Could not reach the server. Check your connection."),
        );
      },
    );
    When("the visitor opens the event page", () => {
      renderEventPage();
    });
    Then(
      `they see the message "We couldn't update your Go. Could not reach the server. Check your connection."`,
      () => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "We couldn't update your Go. Could not reach the server. Check your connection.",
        );
      },
    );
  });
});
