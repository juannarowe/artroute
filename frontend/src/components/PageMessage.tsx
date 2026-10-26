import { type ReactNode } from "react";

interface PageMessageProps {
  children: ReactNode;
  // loading: "please wait" · error: something failed · info: anything else
  variant?: "loading" | "error" | "info";
}

// One style for every full-page message (DRY), and the right ARIA role so
// screen readers announce it:
// - role="status": polite announcement (loading)
// - role="alert": urgent announcement (errors)
export function PageMessage({ children, variant = "info" }: PageMessageProps) {
  if (variant === "error") {
    return (
      <p role="alert" className="py-8 text-center text-destructive">
        {children}
      </p>
    );
  }

  return (
    <p
      role={variant === "loading" ? "status" : undefined}
      className="py-8 text-center text-muted-foreground"
    >
      {children}
    </p>
  );
}
