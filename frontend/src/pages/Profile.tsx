import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { PageTitle } from "@/components/PageTitle";
import { PageMessage } from "@/components/PageMessage";
import { ProfileForm } from "@/components/ProfileForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Profile() {
  const { logout } = useAuth();
  const { data: currentUser, isLoading, isError } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  if (isLoading) {
    return <PageMessage variant="loading">Loading profile...</PageMessage>;
  }
  if (isError || !currentUser) {
    return (
      <PageMessage variant="error">Could not load your profile.</PageMessage>
    );
  }

  // No navigate() needed after logout: `user` becomes null and
  // ProtectedRoute redirects to /login on its own.
  return (
    <div className="flex flex-col items-start gap-6">
      <PageTitle>Profile</PageTitle>

      <section
        aria-labelledby="personal-data"
        className="flex w-full flex-col gap-3"
      >
        <h2 id="personal-data" className="text-lg font-semibold">
          Personal data
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd>{currentUser.email ?? "—"}</dd>
          <dt className="text-muted-foreground">Role</dt>
          <dd>
            <Badge variant="secondary">{currentUser.role}</Badge>
          </dd>
        </dl>

        <ProfileForm
          initialName={currentUser.name ?? ""}
          isSaving={updateProfileMutation.isPending}
          onSave={(name) => updateProfileMutation.mutate(name)}
        />
        {updateProfileMutation.isSuccess && (
          <p role="status" className="text-sm text-muted-foreground">
            Name saved.
          </p>
        )}
        {updateProfileMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {updateProfileMutation.error.message}
          </p>
        )}
      </section>

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
