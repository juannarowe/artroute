import { useAuth } from "../hooks/useAuth";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";

export function Profile() {
  const { logout } = useAuth();

  // No navigate() needed: after logout, `user` becomes null and
  // ProtectedRoute redirects to /login on its own.
  return (
    <div className="flex flex-col items-start gap-4">
      <PageTitle>Profile</PageTitle>
      <Button type="button" variant="outline" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
