import { Link } from "react-router-dom";
import { useEventStats } from "@/hooks/useEventStats";
import { PageTitle } from "@/components/PageTitle";
import { StatsBarChart } from "@/components/StatsBarChart";
import { PageMessage } from "@/components/PageMessage";
import { StatCard } from "@/components/StatCard";
import { PopularEvents } from "@/components/PopularEvents";

export function Stats() {
  const {
    totals,
    eventsByCategory,
    eventsByMonth,
    eventsByStatus,
    popularEvents,
    isAdmin,
    isLoading,
    isError,
  } = useEventStats();

  if (isLoading) {
    return <PageMessage variant="loading">Loading stats...</PageMessage>;
  }

  if (isError) {
    return <PageMessage variant="error">Error loading stats.</PageMessage>;
  }

  if (totals.events === 0) {
    return (
      <PageMessage variant="info">
        Your stats appear here once you create an event.{" "}
        <Link to="/events/new" className="underline">
          Create event
        </Link>
      </PageMessage>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <PageTitle>Stats</PageTitle>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? "All events on Art Route." : "The events you created."}
        </p>
      </div>

      <section
        aria-label="Totals"
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard label="Events" value={totals.events} />
        <StatCard label="Published" value={totals.published} />
        <StatCard label="Pending review" value={totals.pending} />
        <StatCard label="Going" value={totals.going} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <StatsBarChart title="Published by category" data={eventsByCategory} />
        <StatsBarChart title="Published by month" data={eventsByMonth} />
        <StatsBarChart title="Events by status" data={eventsByStatus} />
        <PopularEvents events={popularEvents} />
      </div>
    </div>
  );
}
