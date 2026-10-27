import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageMessage } from "@/components/PageMessage";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageMessage variant="loading">Loading...</PageMessage>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
