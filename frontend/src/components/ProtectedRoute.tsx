import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layout route: wraps a group of routes in App.tsx and renders the
// matching child route (<Outlet />) only when the user is logged in.
export function ProtectedRoute() {
    const { user, loading } = useAuth();

    // Wait for Firebase to restore the session, otherwise a logged-in user
    // would be sent to /login on every page refresh.
    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}
