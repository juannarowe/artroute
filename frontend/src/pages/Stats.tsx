import { useEventStats } from "@/hooks/useEventStats";
import { PageTitle } from "@/components/PageTitle";
import { StatsBarChart } from "@/components/StatsBarChart";

export function Stats() {
  const { eventsByCategory, eventsByMonth, isLoading, isError } =
    useEventStats();

  if (isLoading) {
    return (
      <p className="py-8 text-center text-muted-foreground">Loading stats...</p>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-destructive">Error loading stats.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Stats</PageTitle>
      <StatsBarChart title="Events by category" data={eventsByCategory} />
      <StatsBarChart title="Events by month" data={eventsByMonth} />
    </div>
  );
}
