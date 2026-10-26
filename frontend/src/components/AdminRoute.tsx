import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Layout route for admin pages (same idea as ProtectedRoute, one step more):
// 1. not logged in → login page
// 2. logged in but not admin → "access denied"
// 3. admin → show the page
// This is only UX: the backend checks the role again on every request.
export function AdminRoute() {
  const { user, loading } = useAuth();
  const { data: currentUser, isLoading: isLoadingRole } = useCurrentUser();

  if (loading || (user && isLoadingRole)) {
    return <p className="py-8 text-center text-muted-foreground">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "admin") {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Access denied: this page is only for admins.
      </p>
    );
  }

  return <Outlet />;
}
