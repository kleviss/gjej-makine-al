export default function StatsCard({ title, value, icon, trend }: {
  title: string; value: string | number; icon: string; trend?: { value: number; up: boolean };
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      {trend && (
        <p className={`mt-1 text-xs ${trend.up ? "text-green-400" : "text-red-400"}`}>
          {trend.up ? "↑" : "↓"} {trend.value}%
        </p>
      )}
    </div>
  );
}
