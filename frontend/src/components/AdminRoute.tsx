import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PageMessage } from "@/components/PageMessage";

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
