"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
         method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name, email, password }),
});
const data = await res.json().catch(() => ({}));
if (!res.ok) return setErr((data as any).error || `Failed (${res.status})`);

      if (!res.ok) {
        setErr((data as any)?.error || `Failed (${res.status})`);
        return;
      }

      router.push("/login");
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl max-w-md">
      <h2 className="text-lg font-semibold mb-3">Create your account</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Display name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button className="btn-cta btn w-full justify-center disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <div className="text-sm text-slate-400 mt-3">
        Already have an account? <Link href="/login" className="text-cyan-300">Sign in</Link>
      </div>
    </div>
  );
}
