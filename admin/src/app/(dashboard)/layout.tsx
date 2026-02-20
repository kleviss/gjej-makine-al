"use client";

import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted">Loading...</div>}>
      <AuthGuard>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-background p-8">{children}</main>
        </div>
      </AuthGuard>
    </Suspense>
  );
}
