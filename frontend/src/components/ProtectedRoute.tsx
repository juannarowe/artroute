import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageMessage } from "@/components/PageMessage";

// Layout route: wraps a group of routes in App.tsx and renders the
// matching child route (<Outlet />) only when the user is logged in.
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Wait for Firebase to restore the session, otherwise a logged-in user
  // would be sent to /login on every page refresh.
  if (loading) {
    return <PageMessage variant="loading">Loading...</PageMessage>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
