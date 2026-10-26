import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface GoogleSignInButtonProps {
  // The page decides how to show the error (it owns the error message)
  onError: (message: string) => void;
}

// "Continue with Google" for both Login and Register (DRY).
// With Google there is no difference: the first time creates the account.
export function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleClick() {
    try {
      await loginWithGoogle();
      navigate("/events");
    } catch {
      onError("Could not sign in with Google. Please try again.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
    >
      Continue with Google
    </Button>
  );
}
