"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400", pending: "bg-yellow-500/20 text-yellow-400",
  rejected: "bg-red-500/20 text-red-400", sold: "bg-muted/20 text-muted",
};

export default function ListingsPage() {
  const { role } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 20;
  const supabase = createBrowserSupabase();
  const isSuperAdmin = role === "super_admin" || role === "admin";

  const load = () => {
    let q = supabase.from("vehicles")
      .select("id, title, price, status, created_at, image_urls, user_id, user_profiles(display_name)")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    if (!isSuperAdmin) q = q.eq("user_id", (undefined as any)); // filtered server-side by RLS
    if (search) q = q.ilike("title", `%${search}%`);
    q.then(({ data }) => setListings(data ?? []));
  };

  useEffect(load, [page, search, role]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("vehicles").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{isSuperAdmin ? "Listings" : "My Listings"}</h1>
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search listings..." className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-6 py-3">Listing</th><th className="px-6 py-3">Price</th>
              {isSuperAdmin && <th className="px-6 py-3">User</th>}
              <th className="px-6 py-3">Date</th><th className="px-6 py-3">Status</th>
              {isSuperAdmin && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {l.image_urls?.[0] && (
                      <img src={l.image_urls[0]} alt="" className="h-10 w-14 rounded object-cover" />
                    )}
                    <span className="font-medium text-foreground">{l.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground">€{l.price?.toLocaleString()}</td>
                {isSuperAdmin && <td className="px-6 py-4 text-muted">{(l.user_profiles as any)?.display_name ?? "—"}</td>}
                <td className="px-6 py-4 text-muted">{l.created_at?.slice(0, 10)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[l.status] ?? ""}`}>{l.status}</span>
                </td>
                {isSuperAdmin && (
                  <td className="px-6 py-4">
                    {l.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(l.id, "active")} className="mr-2 text-green-400 hover:underline">Approve</button>
                        <button onClick={() => updateStatus(l.id, "rejected")} className="text-red-400 hover:underline">Reject</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {listings.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted">No listings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-surface disabled:opacity-30">Prev</button>
        <span className="text-sm text-muted">Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={listings.length < limit}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-surface disabled:opacity-30">Next</button>
      </div>
    </div>
  );
}
