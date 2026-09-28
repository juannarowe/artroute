import { useAuth } from "../hooks/useAuth";

export function Profile() {
  const { logout } = useAuth();

  // No navigate() needed: after logout, `user` becomes null and
  // ProtectedRoute redirects to /login on its own.
  return (
    <>
      <h2>Profile Page</h2>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </>
  );
}
