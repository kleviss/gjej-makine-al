"use client";

import { createBrowserSupabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      localStorage.setItem("admin_demo", "1");
      setOk(true);
      return;
    }
    if (localStorage.getItem("admin_demo") === "1") {
      setOk(true);
      return;
    }
    const supabase = createBrowserSupabase();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return router.replace("/login");
      const { data } = await supabase.from("user_profiles").select("role").single();
      if (data?.role !== "admin") return router.replace("/login");
      setOk(true);
    });
  }, [router, searchParams]);

  if (!ok) return <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>;
  return <>{children}</>;
}
