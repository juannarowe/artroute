import { Link } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <PageTitle>Page not found</PageTitle>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild variant="outline">
        <Link to="/events">Back to events</Link>
      </Button>
    </div>
  );
}
