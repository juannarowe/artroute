// Adds readable checks like expect(element).toBeInTheDocument()
import "@testing-library/jest-dom/vitest";

// Note: there is no global cleanup here. In Gherkin tests every step
// (Given / When / Then) runs as its own test, so a global "clean after each
// test" would erase the page between steps. Each test file cleans up itself:
// - normal tests: afterEach(cleanup)
// - Gherkin tests: AfterEachScenario(cleanup)
