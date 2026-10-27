import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyEvents } from "@/hooks/useMyEvents";
import { BottomNav } from "./BottomNav";

vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useMyEvents");

const feature = await loadFeature("./bottom-nav.feature");

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
  });

  function defineSteps(
    Given: (text: string, step: () => void) => void,
    When: (text: string, step: () => void) => void,
    Then: (text: string, step: () => void) => void,
    role: string,
    eventCount: number,
    expectedLinks: string,
  ) {
    Given(`the user is a "${role}" with ${eventCount} events`, () => {
      vi.mocked(useCurrentUser).mockReturnValue({
        data: { _id: "1", firebaseUid: "user-ana", role },
      } as unknown as ReturnType<typeof useCurrentUser>);
      vi.mocked(useMyEvents).mockReturnValue({
        data: new Array(eventCount).fill({}),
      } as unknown as ReturnType<typeof useMyEvents>);
    });
    When("the navigation is shown", () => {
      render(
        <MemoryRouter>
          <BottomNav />
        </MemoryRouter>,
      );
    });
    Then(`they see the links "${expectedLinks}"`, () => {
      const linkNames = screen
        .getAllByRole("link")
        .map((link) => link.textContent)
        .join(", ");
      expect(linkNames).toBe(expectedLinks);
    });
  }

  Scenario(
    "A visitor without events does not see Stats or Manage",
    ({ Given, When, Then }) => {
      defineSteps(
        Given,
        When,
        Then,
        "user",
        0,
        "Events, Map, Calendar, Profile",
      );
    },
  );

  Scenario("An event creator also sees Stats", ({ Given, When, Then }) => {
    defineSteps(
      Given,
      When,
      Then,
      "user",
      2,
      "Events, Map, Calendar, Stats, Profile",
    );
  });

  Scenario("An admin sees Stats and Manage", ({ Given, When, Then }) => {
    defineSteps(
      Given,
      When,
      Then,
      "admin",
      0,
      "Events, Map, Calendar, Stats, Profile, Manage",
    );
  });
});
