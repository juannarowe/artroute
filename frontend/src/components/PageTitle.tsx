import { type ReactNode } from "react";

// Shared page heading, so every page has one <h1> with the same style.
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold">{children}</h1>;
}
