import { useAuth } from "../hooks/useAuth";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Profile() {
  const { logout } = useAuth();

  // No navigate() needed: after logout, `user` becomes null and
  // ProtectedRoute redirects to /login on its own.
  return (
    <div className="flex flex-col items-start gap-4">
      <PageTitle>Profile</PageTitle>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link to="/my-events">My events</Link>
        </Button>
        <Button asChild>
          <Link to="/events/new">Create event</Link>
        </Button>
      </div>
      <Button type="button" variant="outline" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
