"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";

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
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .single();
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Access denied. Admin role required.");
      setLoading(false);
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Gjej Makine Admin</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <label className="mb-1 block text-sm text-gray-600">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mb-4 w-full rounded border px-3 py-2 text-sm text-gray-900" />
        <label className="mb-1 block text-sm text-gray-600">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mb-6 w-full rounded border px-3 py-2 text-sm text-gray-900" />
        <button type="submit" disabled={loading}
          className="w-full rounded bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button type="button" onClick={() => window.location.href = "/?demo=1"}
          className="mt-4 w-full rounded border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Try Demo Mode
        </button>
      </form>
    </div>
  );
}
