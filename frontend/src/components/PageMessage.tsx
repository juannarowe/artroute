import { type ReactNode } from "react";

interface PageMessageProps {
  children: ReactNode;
  variant?: "loading" | "error" | "info";
}

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
