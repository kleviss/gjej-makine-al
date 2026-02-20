"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  user: "bg-gray-100 text-gray-800",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const supabase = createBrowserSupabase();

  const load = () => {
    supabase
      .from("user_profiles")
      .select("id, display_name, phone, role, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setUsers(data ?? []));
  };

  useEffect(load, []);

  const updateRole = async (id: string, role: string) => {
    await supabase.from("user_profiles").update({ role }).eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Users</h1>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{u.display_name ?? "—"}</td>
                <td className="px-6 py-4">{u.phone ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[u.role] ?? "bg-gray-100 text-gray-800"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">{u.created_at?.slice(0, 10)}</td>
                <td className="px-6 py-4">
                  {u.role !== "admin" && (
                    <button onClick={() => updateRole(u.id, "admin")} className="text-purple-600 hover:underline">Make Admin</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
