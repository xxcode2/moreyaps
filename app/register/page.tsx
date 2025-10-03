"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setErr((data as any).error || `Failed (${res.status})`);
    router.push("/login");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl">
        <h1 className="text-xl font-semibold mb-5">Create your account</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-lg bg-slate-800/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-3 font-medium bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-900"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
