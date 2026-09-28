import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    // Wait for Firebase to restore the session, otherwise a logged-in user
    // would be sent to /login on every page refresh.
    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children;
}
