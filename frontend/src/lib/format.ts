// "2026-11-05T18:00:00.000Z" → "Thu 5 Nov · 19:00" (in the user's time zone)
export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

// 0 → "Free", 7.5 → "7.50 €"
export function formatPrice(price: number): string {
  if (price === 0) {
    return "Free";
  }
  return `${price.toFixed(2)} €`;
}

// "mixed media" → "Mixed media" (the database keeps categories in lowercase)
export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
