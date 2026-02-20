"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Role = "user" | "admin" | "super_admin" | "dealership";
type Profile = { role: Role; display_name: string | null; email: string | null };
type AuthCtx = {
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  isLoading: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  session: null, profile: null, role: null, isLoading: true, isDemo: false, signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_demo") === "1") {
      setIsDemo(true);
      setProfile({ role: "super_admin", display_name: "Demo Admin", email: "demo@gjejmakine.al" });
      setIsLoading(false);
      return;
    }
    const supabase = createBrowserSupabase();
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        const { data } = await supabase
          .from("user_profiles")
          .select("role, display_name")
          .eq("id", s.user.id)
          .single();
        if (data) setProfile({ ...data, email: s.user.email ?? null } as Profile);
      }
      setIsLoading(false);
    });
  }, []);

  const signOut = async () => {
    localStorage.removeItem("admin_demo");
    if (!isDemo) await createBrowserSupabase().auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ session, profile, role: profile?.role ?? null, isLoading, isDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
