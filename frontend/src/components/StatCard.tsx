import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
}

// One big number with its name, e.g. "12 · Published"
export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <p className="text-3xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
