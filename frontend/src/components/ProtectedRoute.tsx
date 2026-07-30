import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    // TODO: replace with real `useAuth()` check once merged with feature/auth-firebase
    const isAuthenticated = false;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children;
}