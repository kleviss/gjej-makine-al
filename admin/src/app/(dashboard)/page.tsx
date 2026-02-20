"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import StatsCard from "@/components/StatsCard";

export default function Dashboard() {
  const [stats, setStats] = useState({ listings: 0, users: 0, pending: 0, messages: 0 });

  useEffect(() => {
    const supabase = createBrowserSupabase();
    Promise.all([
      supabase.from("vehicles").select("*", { count: "exact", head: true }),
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("messages").select("*", { count: "exact", head: true }),
    ]).then(([l, u, p, m]) => {
      setStats({
        listings: l.count ?? 0,
        users: u.count ?? 0,
        pending: p.count ?? 0,
        messages: m.count ?? 0,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Listings" value={stats.listings} icon="🚗" />
        <StatsCard title="Active Users" value={stats.users} icon="👤" />
        <StatsCard title="Pending Reviews" value={stats.pending} icon="⏳" />
        <StatsCard title="Total Messages" value={stats.messages} icon="💬" />
      </div>
    </div>
  );
}
