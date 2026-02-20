"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";

const roleColors: Record<string, string> = {
  super_admin: "bg-red-500/20 text-red-400", admin: "bg-purple-500/20 text-purple-400",
  dealership: "bg-blue-500/20 text-blue-400", user: "bg-muted/20 text-muted",
};

const roles = ["user", "admin", "super_admin", "dealership"];

function UsersContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const supabase = createBrowserSupabase();

  const load = () => {
    let q = supabase.from("user_profiles")
      .select("id, display_name, phone, role, created_at")
      .order("created_at", { ascending: false }).limit(50);
    if (search) q = q.or(`display_name.ilike.%${search}%,phone.ilike.%${search}%`);
    q.then(({ data }) => setUsers(data ?? []));
  };

  useEffect(load, [search]);

  const updateRole = async (id: string, role: string) => {
    await supabase.from("user_profiles").update({ role }).eq("id", id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..." className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-6 py-3">Name</th><th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th><th className="px-6 py-3">Joined</th><th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4 font-medium text-foreground">{u.display_name ?? "—"}</td>
                <td className="px-6 py-4 text-muted">{u.phone ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[u.role] ?? "text-muted"}`}>{u.role}</span>
                </td>
                <td className="px-6 py-4 text-muted">{u.created_at?.slice(0, 10)}</td>
                <td className="px-6 py-4">
                  <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}
                    className="rounded border border-border bg-surface-light px-2 py-1 text-xs text-foreground">
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AuthGuard allowedRoles={["super_admin", "admin"]}>
      <UsersContent />
    </AuthGuard>
  );
}
