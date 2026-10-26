import { useEventStats } from "@/hooks/useEventStats";
import { PageTitle } from "@/components/PageTitle";
import { StatsBarChart } from "@/components/StatsBarChart";
import { PageMessage } from "@/components/PageMessage";

export function Stats() {
  const { eventsByCategory, eventsByMonth, isLoading, isError } =
    useEventStats();

  if (isLoading) {
    return <PageMessage variant="loading">Loading stats...</PageMessage>;
  }

  if (isError) {
    return <PageMessage variant="error">Error loading stats.</PageMessage>;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle>Stats</PageTitle>
      <StatsBarChart title="Events by category" data={eventsByCategory} />
      <StatsBarChart title="Events by month" data={eventsByMonth} />
    </div>
  );
}
