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

export function formatPrice(price: number): string {
  if (price === 0) {
    return "Free";
  }
  return `${price.toFixed(2)} €`;
}

export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
