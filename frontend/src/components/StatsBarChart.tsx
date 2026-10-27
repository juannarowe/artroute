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

export function StatsBarChart({ title, data }: StatsBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="sr-only">
          {data.map((point) => (
            <li key={point.label}>
              {point.label}: {point.count} events
            </li>
          ))}
        </ul>
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} width={30} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Events" fill="#000000" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
