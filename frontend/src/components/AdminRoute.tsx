import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PageMessage } from "@/components/PageMessage";

// Layout route for admin pages (same idea as ProtectedRoute, one step more):
// 1. not logged in → login page
// 2. logged in but not admin → "access denied"
// 3. admin → show the page
// This is only UX: the backend checks the role again on every request.
export function AdminRoute() {
  const { user, loading } = useAuth();
  const { data: currentUser, isLoading: isLoadingRole } = useCurrentUser();

  if (loading || (user && isLoadingRole)) {
    return <PageMessage variant="loading">Loading...</PageMessage>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "admin") {
    return (
      <PageMessage variant="info">
        Access denied: this page is only for admins.
      </PageMessage>
    );
  }

  return <Outlet />;
}
