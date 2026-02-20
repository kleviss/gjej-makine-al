export default function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
