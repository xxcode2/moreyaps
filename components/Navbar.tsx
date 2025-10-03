
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const points = (session?.user as any)?.points ?? 0;
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">YapTasks</Link>
        <div className="flex items-center gap-3">
          <Link href="/create" className="btn">Create Task</Link>
          <Link href="/my" className="btn">My Tasks</Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">⭐ {points} pts</span>
              <img src={session.user?.image ?? ""} alt="avatar" className="w-8 h-8 rounded-full border" />
            </div>
          ) : (
            <Link href="/login" className="btn-primary btn">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}
