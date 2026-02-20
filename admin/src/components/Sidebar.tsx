"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "□" },
  { href: "/listings", label: "Listings", icon: "☰" },
  { href: "/users", label: "Users", icon: "◉" },
  { href: "/analytics", label: "Analytics", icon: "▤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-xl font-bold">Gjej Makine</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
              pathname === link.href
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
