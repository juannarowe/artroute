import { Button } from "@/components/ui/button";

interface GoButtonProps {
  isGoing: boolean;
  disabled: boolean;
  onClick: () => void;
  size?: "default" | "sm";
}

// "Go" / "Going" toggle, used on the event cards and on the detail page (DRY).
export function GoButton({ isGoing, disabled, onClick, size }: GoButtonProps) {
  return (
    <Button
      type="button"
      size={size}
      variant={isGoing ? "outline" : "default"}
      disabled={disabled}
      // aria-pressed: screen readers announce it as a toggle (on / off)
      aria-pressed={isGoing}
      onClick={onClick}
    >
      {isGoing ? "Going" : "Go"}
    </Button>
  );
}
