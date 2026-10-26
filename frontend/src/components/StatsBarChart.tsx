import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatPoint } from "@/types/stats";

interface StatsBarChartProps {
  title: string;
  data: StatPoint[];
}

// "Dumb" chart: it only draws the numbers it receives.
// The same component is used for every chart on the stats page (DRY).
export function StatsBarChart({ title, data }: StatsBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ResponsiveContainer makes the chart as wide as the card */}
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            {/* interval={0}: show EVERY label, even when space is tight.
                The labels are tilted so long ones ("mixed media") still fit. */}
            <XAxis
              dataKey="label"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11 }}
            />
            {/* allowDecimals={false}: you can't have 2.5 events */}
            <YAxis allowDecimals={false} width={30} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" name="Events" fill="#000000" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
