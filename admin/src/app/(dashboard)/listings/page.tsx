"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  sold: "bg-gray-100 text-gray-800",
};

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const supabase = createBrowserSupabase();

  const load = () => {
    supabase
      .from("vehicles")
      .select("id, title, price, status, created_at, user_profiles(display_name)")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setListings(data ?? []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("vehicles").update({ status }).eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Listings</h1>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{l.title}</td>
                <td className="px-6 py-4">€{l.price?.toLocaleString()}</td>
                <td className="px-6 py-4">{(l.user_profiles as any)?.display_name ?? "—"}</td>
                <td className="px-6 py-4">{l.created_at?.slice(0, 10)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[l.status] ?? ""}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {l.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(l.id, "active")} className="mr-2 text-green-600 hover:underline">Approve</button>
                      <button onClick={() => updateStatus(l.id, "rejected")} className="text-red-600 hover:underline">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No listings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
