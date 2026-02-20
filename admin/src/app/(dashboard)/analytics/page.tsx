"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [data, setData] = useState({ byMake: [] as any[], byStatus: [] as any[], recent: 0 });

  useEffect(() => {
    const supabase = createBrowserSupabase();
    Promise.all([
      supabase.from("vehicles").select("make"),
      supabase.from("vehicles").select("status"),
      supabase.from("vehicles").select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]).then(([makes, statuses, recent]) => {
      const makeCounts: Record<string, number> = {};
      makes.data?.forEach((v) => { makeCounts[v.make] = (makeCounts[v.make] || 0) + 1; });
      const statusCounts: Record<string, number> = {};
      statuses.data?.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
      setData({
        byMake: Object.entries(makeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
        byStatus: Object.entries(statusCounts),
        recent: recent.count ?? 0,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="mb-4 rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">New listings (last 7 days)</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{data.recent}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Listings by Make</h2>
          {data.byMake.map(([make, count]) => (
            <div key={make} className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-700">{make}</span>
              <span className="font-medium text-gray-900">{count}</span>
            </div>
          ))}
          {data.byMake.length === 0 && <p className="text-sm text-gray-400">No data</p>}
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Listings by Status</h2>
          {data.byStatus.map(([status, count]) => (
            <div key={status} className="mb-2 flex items-center justify-between text-sm">
              <span className="capitalize text-gray-700">{status}</span>
              <span className="font-medium text-gray-900">{count}</span>
            </div>
          ))}
          {data.byStatus.length === 0 && <p className="text-sm text-gray-400">No data</p>}
        </div>
      </div>
    </div>
  );
}
