import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, vi } from "vitest";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import type { CreateEventInput } from "@/types/event";
import { CreateEvent } from "./CreateEvent";

// The page sends the form through useCreateEvent().mutate. We replace the
// hook with a fake, so nothing is sent to the backend during the tests.
vi.mock("@/hooks/useCreateEvent");
const mutate = vi.fn();

const feature = await loadFeature("./create-event.feature");

function renderCreatePage(errorMessage?: string) {
  vi.mocked(useCreateEvent).mockReturnValue({
    mutate,
    isPending: false,
    error: errorMessage ? new Error(errorMessage) : null,
  } as unknown as ReturnType<typeof useCreateEvent>);

  render(
    <MemoryRouter initialEntries={["/events/new"]}>
      <Routes>
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/events/:id" element={<p>Event page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
    mutate.mockReset();
  });

  Scenario("A user submits a new event", ({ Given, When, Then, And }) => {
    // Each Gherkin step runs as its own test and the fake's history is
    // cleared between steps, so we save what was sent in the "submit" step.
    let sentValues: CreateEventInput | undefined;

    Given("the user is on the create event page", () => {
      // Fake backend: "it worked", the new event has the id "new-event-1"
      mutate.mockImplementation((_values, options) => {
        options.onSuccess({ _id: "new-event-1" });
      });
      renderCreatePage();
    });

    When(
      'they fill in the form for "Night Lights" at "Galeria Test"',
      async () => {
        await userEvent.type(screen.getByLabelText("Title"), "Night Lights");
        await userEvent.type(
          screen.getByLabelText("Gallery / venue"),
          "Galeria Test",
        );
        await userEvent.type(
          screen.getByLabelText("Address"),
          "Carrer de Test 1, Barcelona",
        );
        await userEvent.type(screen.getByLabelText("Latitude"), "41.38");
        await userEvent.type(screen.getByLabelText("Longitude"), "2.17");
        // Date inputs are easier to fill with a "change" event
        fireEvent.change(screen.getByLabelText("Date and time"), {
          target: { value: "2026-11-20T19:00" },
        });
        await userEvent.type(
          screen.getByLabelText("Description"),
          "A night of light installations.",
        );
      },
    );

    And("they submit the form", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Submit for review" }),
      );
      sentValues = mutate.mock.calls[0]?.[0];
    });

    Then('the event is sent with the title "Night Lights" and price 0', () => {
      expect(sentValues?.title).toBe("Night Lights");
      expect(sentValues?.venue).toBe("Galeria Test");
      expect(sentValues?.price).toBe(0);
      expect(sentValues?.lat).toBe(41.38);
    });

    And("they are taken to the new event's page", async () => {
      expect(await screen.findByText("Event page")).toBeInTheDocument();
    });
  });

  Scenario("The backend rejects the event", ({ Given, Then, And }) => {
    Given("the user is on the create event page", () => {
      // rendered in the next step, with the error from the fake backend
    });

    And(
      'the backend answers with the error "lat must not be greater than 90"',
      () => {
        renderCreatePage("lat must not be greater than 90");
      },
    );

    Then('they see the message "lat must not be greater than 90"', () => {
      expect(
        screen.getByText("lat must not be greater than 90"),
      ).toBeInTheDocument();
    });
  });
});
