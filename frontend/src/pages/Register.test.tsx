import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { Register } from "./Register";

// The page uses useAuth().register. We replace it with a fake, so no Firebase
// account is created during the tests.
vi.mock("@/hooks/useAuth");
const register = vi.fn();

const feature = await loadFeature("./register.feature");

// The register page plus a fake "/events" page, to check the redirect
function renderRegisterPage() {
  vi.mocked(useAuth).mockReturnValue({
    register,
  } as unknown as ReturnType<typeof useAuth>);

  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<p>Events page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillInForm(name: string, email: string, password: string) {
  await userEvent.type(screen.getByLabelText("Name"), name);
  await userEvent.type(screen.getByLabelText("Email"), email);
  await userEvent.type(screen.getByLabelText("Password"), password);
}

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  // Clean the page and the fake after each scenario (not after each step)
  AfterEachScenario(() => {
    cleanup();
    register.mockReset();
  });

  Scenario("A visitor creates an account", ({ Given, When, Then, And }) => {
    // Each Gherkin step runs as its own test, and the fake's call history is
    // cleared between them. So we save what register() received in the
    // "submit" step and check it in the "Then" step.
    let registerArguments: unknown[] = [];

    Given("the visitor is on the register page", () => {
      register.mockResolvedValue(undefined); // Firebase says: OK
      renderRegisterPage();
    });
    When('they fill in "Ana", "ana@test.dev" and "secret123"', async () => {
      await fillInForm("Ana", "ana@test.dev", "secret123");
    });
    And("they submit the form", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Create account" }),
      );
      registerArguments = register.mock.calls[0] ?? [];
    });
    Then("their account is created with those details", () => {
      expect(registerArguments).toEqual(["Ana", "ana@test.dev", "secret123"]);
    });
    And("they are taken to the events page", async () => {
      expect(await screen.findByText("Events page")).toBeInTheDocument();
    });
  });

  Scenario("The email already has an account", ({ Given, When, Then, And }) => {
    Given("the visitor is on the register page", () => {
      renderRegisterPage();
    });
    And('the email "ana@test.dev" is already registered', () => {
      // Firebase answers with an error that has this code
      register.mockRejectedValue({ code: "auth/email-already-in-use" });
    });
    When('they fill in "Ana", "ana@test.dev" and "secret123"', async () => {
      await fillInForm("Ana", "ana@test.dev", "secret123");
    });
    And("they submit the form", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Create account" }),
      );
    });
    Then(
      'they see the message "This email already has an account. Try logging in."',
      async () => {
        expect(
          await screen.findByText(
            "This email already has an account. Try logging in.",
          ),
        ).toBeInTheDocument();
      },
    );
    And("they stay on the register page", () => {
      expect(screen.queryByText("Events page")).not.toBeInTheDocument();
    });
  });
});
