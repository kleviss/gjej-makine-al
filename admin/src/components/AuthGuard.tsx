"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = { children: React.ReactNode; allowedRoles?: string[] };

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { isLoading, role, isDemo } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      localStorage.setItem("admin_demo", "1");
      window.location.reload();
      return;
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoading) return;
    if (!role && !isDemo) { router.replace("/login"); return; }
    if (allowedRoles && role && !allowedRoles.includes(role)) { router.replace("/"); }
  }, [isLoading, role, isDemo, allowedRoles, router]);

  if (isLoading) return <div className="flex h-screen items-center justify-center text-muted">Loading...</div>;
  if (!role && !isDemo) return null;
  if (allowedRoles && role && !allowedRoles.includes(role)) return null;
  return <>{children}</>;
}
