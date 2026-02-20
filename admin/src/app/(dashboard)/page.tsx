"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import StatsCard from "@/components/StatsCard";

export default function Dashboard() {
  const { role, profile } = useAuth();
  const [stats, setStats] = useState({ listings: 0, users: 0, pending: 0, messages: 0, myListings: 0, saved: 0 });
  const [recentListings, setRecentListings] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    const isSuperAdmin = role === "super_admin" || role === "admin";

    const queries: PromiseLike<any>[] = [
      supabase.from("vehicles").select("*", { count: "exact", head: true }),
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("messages").select("*", { count: "exact", head: true }),
    ];

    if (!isSuperAdmin) {
      queries.push(
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("user_id", profile?.email),
      );
    }

    Promise.all(queries).then(([l, u, p, m, my]) => {
      setStats({
        listings: l.count ?? 0, users: u.count ?? 0, pending: p.count ?? 0, messages: m.count ?? 0,
        myListings: my?.count ?? 0, saved: 0,
      });
    });

    if (isSuperAdmin) {
      supabase.from("vehicles").select("id, title, status, created_at").order("created_at", { ascending: false }).limit(5)
        .then(({ data }) => setRecentListings(data ?? []));
    }
  }, [role, profile]);

  const isSuperAdmin = role === "super_admin" || role === "admin";

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="mb-8 text-sm text-muted">Role: {role}</p>

      {isSuperAdmin && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Listings" value={stats.listings} icon="🚗" />
            <StatsCard title="Active Users" value={stats.users} icon="👤" />
            <StatsCard title="Pending Reviews" value={stats.pending} icon="⏳" />
            <StatsCard title="Total Messages" value={stats.messages} icon="💬" />
          </div>
          {recentListings.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="mb-4 font-semibold text-foreground">Recent Listings</h2>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted">
                  <tr>
                    <th className="pb-3">Title</th><th className="pb-3">Status</th><th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentListings.map((l) => (
                    <tr key={l.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground">{l.title}</td>
                      <td className="py-3"><StatusBadge status={l.status} /></td>
                      <td className="py-3 text-muted">{l.created_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {role === "dealership" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatsCard title="My Listings" value={stats.myListings} icon="🚗" />
          <StatsCard title="Pending" value={stats.pending} icon="⏳" />
          <StatsCard title="Messages" value={stats.messages} icon="💬" />
        </div>
      )}

      {role === "user" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatsCard title="My Listings" value={stats.myListings} icon="🚗" />
          <StatsCard title="Saved Cars" value={stats.saved} icon="❤️" />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/20 text-green-400", pending: "bg-yellow-500/20 text-yellow-400",
    rejected: "bg-red-500/20 text-red-400", sold: "bg-muted/20 text-muted",
  };
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] ?? "text-muted"}`}>{status}</span>;
}
