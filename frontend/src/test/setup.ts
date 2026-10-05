import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// Adds readable checks like expect(element).toBeInTheDocument()
import "@testing-library/jest-dom/vitest";

// Remove what each test rendered, so tests don't affect each other
afterEach(() => {
  cleanup();
});
