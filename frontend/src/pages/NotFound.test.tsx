import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "./NotFound";

function renderNotFound() {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe("NotFound page", () => {
  it("shows the page title", () => {
    renderNotFound();

    const title = screen.getByRole("heading", { name: "Page not found" });
    expect(title).toBeInTheDocument();
  });

  it("has a link back to the events page", () => {
    renderNotFound();

    const link = screen.getByRole("link", { name: "Back to events" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/events");
  });
});
