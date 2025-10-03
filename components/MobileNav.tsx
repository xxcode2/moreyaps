"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function MobileNav() {
  const { data: session } = useSession();
  const points = (session?.user as any)?.points ?? 0;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar (mobile only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur border-b border-white/10">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-xl px-2 py-1.5 bg-white/5 border border-white/10 active:scale-[0.98]"
          >
            {/* menu icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" className="text-slate-200">
              <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full grid place-content-center bg-cyan-400/20 border border-cyan-300/30">
              ✨
            </div>
            <div className="font-semibold">YapTasks</div>
          </Link>

          {/* Right slot */}
          {session?.user ? (
            <Link href="/profile" className="rounded-full border border-white/10 overflow-hidden">
              <div className="w-8 h-8 grid place-content-center bg-white/10 text-xs">👤</div>
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-cyan-300">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Slide-in menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-[82%] max-w-[360px] bg-slate-900 border-r border-white/10 shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full grid place-content-center bg-cyan-400/20 border border-cyan-300/30">✨</div>
                <div>
                  <div className="font-semibold">YapTasks</div>
                  <div className="text-xs text-slate-400">Promote on X (Twitter)</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-1.5 bg-white/5 border border-white/10"
                aria-label="Close menu"
              >
                {/* close icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-200">
                  <path fill="currentColor" d="M18.3 5.71L12 12.01l-6.3-6.3l-1.4 1.41l6.29 6.29l-6.3 6.3l1.41 1.41l6.3-6.3l6.29 6.29l1.41-1.41l-6.3-6.3l6.3-6.29z"/>
                </svg>
              </button>
            </div>

            <nav className="mt-6 space-y-2">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 active:scale-[0.99]">
                Dashboard
              </Link>
              <Link href="/" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 active:scale-[0.99]">
                Global Tasks
              </Link>
              <Link href="/create" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 active:scale-[0.99]">
                Create Task
              </Link>
              <Link href="/my" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 active:scale-[0.99]">
                My Tasks
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-slate-200 active:scale-[0.99]">
                Profile
              </Link>
            </nav>

            <div className="mt-auto">
              <div className="rounded-2xl p-4 glow">
                <div className="text-xs text-slate-400">Balance</div>
                <div className="text-xl font-bold">
                  <span className="star">⭐</span> {points.toLocaleString()} pts
                </div>
              </div>

              {!session?.user ? (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-cta btn w-full mt-3 justify-center"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="btn w-full mt-3 hover:bg-red-500/10 border border-red-500/30 text-red-300"
                >
                  Logout
                </button>
              )}

              <div className="h-6 safe-bottom" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
