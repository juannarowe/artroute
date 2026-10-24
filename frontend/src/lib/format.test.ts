import { describe, it, expect } from "vitest";
import { formatEventDate, formatPrice } from "./format";

describe("formatPrice", () => {
  it("shows Free when the price is 0", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("shows the price with two decimals and the euro sign", () => {
    expect(formatPrice(7.5)).toBe("7.50 €");
    expect(formatPrice(10)).toBe("10.00 €");
  });
});

describe("formatEventDate", () => {
  it("shows the weekday, day and month, then the time", () => {
    // Midday UTC, so the day is the same in any European time zone
    const formatted = formatEventDate("2026-11-05T12:00:00.000Z");

    expect(formatted.startsWith("Thu 5 Nov")).toBe(true);
    // Ends with " · HH:MM" (the hour depends on the computer's time zone)
    expect(formatted).toMatch(/ · \d{2}:\d{2}$/);
  });
});
