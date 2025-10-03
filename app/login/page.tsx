"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) setErr(res.error);
    else if (res?.ok) window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl">
        <h1 className="text-xl font-semibold mb-5">Welcome back</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            className="w-full rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-3 font-medium bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-900"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-4">
          No account?{" "}
          <Link href="/register" className="text-cyan-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
