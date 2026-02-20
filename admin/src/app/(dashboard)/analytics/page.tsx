"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Period = "7" | "30" | "90";

export default function AnalyticsPage() {
  const { role } = useAuth();
  const [period, setPeriod] = useState<Period>("7");
  const [data, setData] = useState({ byMake: [] as [string, number][], byStatus: [] as [string, number][], recent: 0 });

  useEffect(() => {
    const supabase = createBrowserSupabase();
    const since = new Date(Date.now() - Number(period) * 86400000).toISOString();

    Promise.all([
      supabase.from("vehicles").select("make"),
      supabase.from("vehicles").select("status"),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).gte("created_at", since),
    ]).then(([makes, statuses, recent]) => {
      const makeCounts: Record<string, number> = {};
      makes.data?.forEach((v) => { makeCounts[v.make] = (makeCounts[v.make] || 0) + 1; });
      const statusCounts: Record<string, number> = {};
      statuses.data?.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
      setData({
        byMake: Object.entries(makeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10) as [string, number][],
        byStatus: Object.entries(statusCounts) as [string, number][],
        recent: recent.count ?? 0,
      });
    });
  }, [period, role]);

  const maxMake = Math.max(...data.byMake.map(([, c]) => c), 1);
  const maxStatus = Math.max(...data.byStatus.map(([, c]) => c), 1);

  const statusBarColors: Record<string, string> = {
    active: "bg-green-500", pending: "bg-yellow-500", rejected: "bg-red-500", sold: "bg-gray-500",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {(["7", "30", "90"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${period === p ? "bg-primary text-black" : "text-muted hover:text-foreground"}`}>
              {p}d
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-surface p-6">
        <p className="text-sm text-muted">New listings (last {period} days)</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{data.recent}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 font-semibold text-foreground">Listings by Make</h2>
          {data.byMake.map(([make, count]) => (
            <div key={make} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground">{make}</span>
                <span className="text-muted">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-light">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / maxMake) * 100}%` }} />
              </div>
            </div>
          ))}
          {data.byMake.length === 0 && <p className="text-sm text-muted">No data</p>}
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 font-semibold text-foreground">Listings by Status</h2>
          {data.byStatus.map(([status, count]) => (
            <div key={status} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize text-foreground">{status}</span>
                <span className="text-muted">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-light">
                <div className={`h-2 rounded-full ${statusBarColors[status] ?? "bg-accent"}`} style={{ width: `${(count / maxStatus) * 100}%` }} />
              </div>
            </div>
          ))}
          {data.byStatus.length === 0 && <p className="text-sm text-muted">No data</p>}
        </div>
      </div>
    </div>
  );
}
