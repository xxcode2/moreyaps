"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/", label: "Global Tasks" },
  { href: "/create", label: "Create Task" },
  { href: "/my", label: "My Tasks" },
  { href: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const points = (session?.user as any)?.points ?? 0;

  return (
    <aside className="hidden md:flex flex-col w-72 border-r border-white/10 bg-slate-900/40 backdrop-blur">
      {/* Brand */}
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-300/30 grid place-content-center">✨</div>
          <div>
            <div className="font-semibold">YapTasks</div>
            <div className="text-xs text-slate-400">Promote on X (Twitter)</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-2">
        {nav.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`group block px-4 py-2.5 rounded-2xl transition border
                ${active
                  ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-900 font-semibold border-transparent"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"}`}
            >
              <span className="inline-flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-slate-900" : "bg-white/40 group-hover:bg-white/70"}`} />
                {i.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: balance + single CTA */}
      <div className="mt-auto p-4">
        <div className="rounded-2xl p-4 glow">
          <div className="text-xs text-slate-400">Balance</div>
          <div className="text-2xl font-bold tracking-tight">
            <span className="star">⭐</span> {points.toLocaleString()} pts
          </div>
        </div>

        {!session?.user ? (
          <Link href="/login" className="w-full mt-3 btn btn-cta justify-center">
            Login
          </Link>
        ) : (
          <button
            onClick={() => import("next-auth/react").then((m) => m.signOut({ callbackUrl: "/login" }))}
            className="w-full mt-3 btn hover:bg-red-500/10 border-red-500/30 text-red-300"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
