"use client";
import { useRouter, useSearchParams } from "next/navigation";

const TYPES = ["ALL","FOLLOW","LIKE","RETWEET","REPLY"] as const;

export default function FilterBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const active = (sp.get("type") || "ALL").toUpperCase();

  function setType(t: string) {
    const url = new URL(window.location.href);
    if (t === "ALL") url.searchParams.delete("type");
    else url.searchParams.set("type", t);
    router.push(url.pathname + "?" + url.searchParams.toString());
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {TYPES.map(t => (
    <button
  key={t}
  onClick={() => setType(t)}
  className={`relative overflow-hidden px-3 py-1.5 rounded-2xl border text-sm
    ${active===t ? "bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-900 border-transparent"
                 : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
>
  <span className="relative z-10">{t === "REPLY" ? "COMMENT" : t}</span>
  <span className="absolute inset-0 opacity-0 hover:opacity-20 transition bg-white" />
</button>

      ))}
    </div>
  );
}
