import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { Profile } from "./Profile";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useCurrentUser");
vi.mock("@/hooks/useUpdateProfile");
const mutate = vi.fn();

const feature = await loadFeature("./profile.feature");

function mockLoggedInUser(name: string, email: string, role: string) {
  vi.mocked(useAuth).mockReturnValue({
    logout: vi.fn(),
  } as unknown as ReturnType<typeof useAuth>);
  vi.mocked(useCurrentUser).mockReturnValue({
    data: { _id: "1", firebaseUid: "user-ana", name, email, role },
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useCurrentUser>);
  vi.mocked(useUpdateProfile).mockReturnValue({
    mutate,
    isPending: false,
    isSuccess: false,
    isError: false,
  } as unknown as ReturnType<typeof useUpdateProfile>);
}

function renderProfile() {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
    mutate.mockReset();
  });

  Scenario(
    "The user sees their personal data",
    ({ Given, When, Then, And }) => {
      Given(
        'the logged-in user is "Ana" with the email "ana@test.dev" and the role "user"',
        () => {
          mockLoggedInUser("Ana", "ana@test.dev", "user");
        },
      );
      When("they open their profile", () => {
        renderProfile();
      });
      Then('they see the email "ana@test.dev"', () => {
        expect(screen.getByText("ana@test.dev")).toBeInTheDocument();
      });
      And('they see the role "user"', () => {
        expect(screen.getByText("user")).toBeInTheDocument();
      });
      And('the name field shows "Ana"', () => {
        expect(screen.getByLabelText("Name")).toHaveValue("Ana");
      });
    },
  );

  Scenario("The user changes their name", ({ Given, When, Then, And }) => {
    let sentName: string | undefined;

    Given(
      'the logged-in user is "Ana" with the email "ana@test.dev" and the role "user"',
      () => {
        mockLoggedInUser("Ana", "ana@test.dev", "user");
      },
    );
    When("they open their profile", () => {
      renderProfile();
    });
    And('they change the name to "Ana García" and save', async () => {
      const nameField = screen.getByLabelText("Name");
      await userEvent.clear(nameField);
      await userEvent.type(nameField, "Ana García");
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
      sentName = mutate.mock.calls[0]?.[0];
    });
    Then('the new name "Ana García" is sent', () => {
      expect(sentName).toBe("Ana García");
    });
  });
});
