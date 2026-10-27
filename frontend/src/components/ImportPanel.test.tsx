import { describeFeature, loadFeature } from "@amiceli/vitest-cucumber";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import { ImportPanel } from "./ImportPanel";

const feature = await loadFeature("./import-panel.feature");

describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => {
    cleanup();
  });

  Scenario("The admin starts an import", ({ Given, When, Then }) => {
    const onImport = vi.fn();
    // The fake's history is cleared between steps, so we save it in the click step
    let importCalls = 0;

    Given("the import panel is ready", () => {
      render(<ImportPanel isImporting={false} onImport={onImport} />);
    });
    When('the admin clicks "Import from ArtBarcelona"', async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Import from ArtBarcelona" }),
      );
      importCalls = onImport.mock.calls.length;
    });
    Then("the import starts", () => {
      expect(importCalls).toBe(1);
    });
  });

  Scenario("The admin waits while the import runs", ({ Given, Then }) => {
    Given("an import is running", () => {
      render(<ImportPanel isImporting={true} onImport={vi.fn()} />);
    });
    Then('the button says "Importing... (about 30 s)" and is disabled', () => {
      expect(
        screen.getByRole("button", { name: "Importing... (about 30 s)" }),
      ).toBeDisabled();
    });
  });

  Scenario("The admin sees the result of the import", ({ Given, Then }) => {
    Given("an import finished with 3 imported and 7 skipped", () => {
      render(
        <ImportPanel
          isImporting={false}
          result={{ imported: 3, skipped: 7 }}
          onImport={vi.fn()}
        />,
      );
    });
    Then('they see the message "3 imported, 7 skipped."', () => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "3 imported, 7 skipped.",
      );
    });
  });
});
