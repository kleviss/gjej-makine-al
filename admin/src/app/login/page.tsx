"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

const allowedRoles = ["admin", "super_admin", "dealership", "user"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createBrowserSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const { data: profile } = await supabase.from("user_profiles").select("role").single();
    if (!profile || !allowedRoles.includes(profile.role)) {
      await supabase.auth.signOut();
      setError("Access denied. You don't have permission to access this dashboard.");
      setLoading(false);
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f1115] via-[#1e1b4b] to-[#0f1115]">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <h1 className="mb-1 text-xl font-bold text-primary">Gjej Makine</h1>
        <p className="mb-6 text-sm text-muted">Sign in to your dashboard</p>
        {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        <label className="mb-1 block text-sm text-muted">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mb-4 w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
        <label className="mb-1 block text-sm text-muted">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mb-6 w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-black hover:bg-primary/90 disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button type="button" onClick={() => (window.location.href = "/?demo=1")}
          className="mt-3 w-full rounded-lg border border-border py-2 text-sm text-muted hover:bg-surface-light">
          Try Demo Mode
        </button>
      </form>
    </div>
  );
}
