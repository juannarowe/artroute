import { Button } from "@/components/ui/button";

interface GoButtonProps {
  isGoing: boolean;
  disabled: boolean;
  onClick: () => void;
  size?: "default" | "sm";
}

export function GoButton({ isGoing, disabled, onClick, size }: GoButtonProps) {
  return (
    <Button
      type="button"
      size={size}
      variant={isGoing ? "outline" : "default"}
      disabled={disabled}
      aria-pressed={isGoing}
      onClick={onClick}
    >
      {isGoing ? "Going" : "Go"}
    </Button>
  );
}
