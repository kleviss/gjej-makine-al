"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const allLinks = [
  { href: "/", label: "Dashboard", icon: "□", roles: ["super_admin", "admin", "dealership", "user"] },
  { href: "/listings", label: "Listings", icon: "☰", roles: ["super_admin", "admin"] },
  { href: "/listings", label: "My Listings", icon: "☰", roles: ["dealership", "user"] },
  { href: "/users", label: "Users", icon: "◉", roles: ["super_admin", "admin"] },
  { href: "/analytics", label: "Analytics", icon: "▤", roles: ["super_admin", "admin", "dealership"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, profile, signOut } = useAuth();

  const links = allLinks.filter((l) => role && l.roles.includes(role));

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] text-white">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-xl font-bold text-primary">Gjej Makine</h1>
        <p className="text-sm text-white/50">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link, i) => (
          <Link key={`${link.href}-${i}`} href={link.href}
            className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
              pathname === link.href ? "bg-primary/20 text-primary" : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}>
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="mb-2 truncate text-xs text-white/50">{profile?.email ?? profile?.display_name ?? ""}</p>
        <button onClick={signOut}
          className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/20">
          Logout
        </button>
      </div>
    </aside>
  );
}
