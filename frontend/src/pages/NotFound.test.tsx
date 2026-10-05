import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "./NotFound";

// <Link> needs a router, so the page is rendered inside an in-memory one
function renderNotFound() {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );
}

describe("NotFound page", () => {
    it("shows the page title", () => {
        // Arrange
        renderNotFound();

        // Assert
        const title = screen.getByRole("heading", { name: "Page not found" });
        expect(title).toBeInTheDocument();
    });

    it("has a link back to the events page", () => {
        // Arrange
        renderNotFound();

        // Assert
        const link = screen.getByRole("link", { name: "Back to events" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/events");
    });
});
