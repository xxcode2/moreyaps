"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) {
    return (
      <button onClick={() => signIn()} className="w-full bg-cyan-500 text-slate-900 font-semibold rounded-xl px-4 py-2">
        Login
      </button>
    );
  }

  const u = session.user;
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
        <img
  src={u.image ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.email}`}
  className="w-10 h-10 rounded-full border border-white/20 ring-2 ring-transparent group-hover:ring-cyan-400/40 transition"
/>

        <div className="text-left">
          <div className="text-sm font-semibold">{u.name ?? u.email}</div>
          <div className="text-xs text-slate-400">{u.email}</div>
        </div>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl bg-slate-900 border border-white/10 shadow-xl overflow-hidden">
          <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-white/5">Profile</Link>
          <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/5">Logout</button>
        </div>
      )}
    </div>
  );
}
