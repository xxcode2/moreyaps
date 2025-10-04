"use client";

import { useMemo, useState } from "react";

type Props = { taskId: string; reward: number };

function validUrl(u: string) {
  try { const x = new URL(u); return /^https?:/.test(x.protocol); } catch { return false; }
}

export default function ClaimFormClient({ taskId, reward }: Props) {
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; title: string; desc?: string; ok?: boolean }>({
    open: false, title: "", desc: "", ok: false,
  });

  const isValid = useMemo(() => proofUrl.length === 0 || validUrl(proofUrl), [proofUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/claim`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ proofUrl }),
      });
      const json = await res.json();

      if (json?.ok) {
        // Update angka points pada halaman (dan sidebar jika ada id-nya)
        const inc = Number(json?.data?.reward ?? reward);
        const pv = document.getElementById("points-value");
        if (pv) {
          const cur = Number(pv.textContent || "0");
          pv.textContent = String(Number.isFinite(cur) ? cur + inc : inc);
        }
        const sb = document.getElementById("sidebar-balance"); // kalau sidebar kamu punya id ini
        if (sb) {
          const cur = Number(sb.textContent?.replace(/\D/g, "") || "0");
          sb.textContent = `${(Number.isFinite(cur) ? cur + inc : inc).toLocaleString()} pts`;
        }
      }

      setModal({
        open: true,
        ok: !!json.ok,
        title: json.ok ? "Proof terkirim 🎉" : "Gagal mengirim",
        desc: json.message || json.error || "",
      });
      if (json.ok) setProofUrl("");
    } catch (err: any) {
      setModal({ open: true, ok: false, title: "Gagal mengirim", desc: err?.message ?? "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="p-6 md:p-8 border-t bg-white">
        <div className="rounded-2xl border bg-gradient-to-br from-slate-50 to-white">
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Submit Proof</h2>
                <p className="text-sm text-slate-500">Kirim URL bukti (post X, screenshot link, dsb). Tidak menyimpan klaim — hanya notifikasi & points langsung ditambahkan.</p>
              </div>
              <div className="hidden md:flex text-xs px-2.5 py-1 rounded-full border bg-white shadow-sm">
                +{reward.toLocaleString()} pts
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div className={`rounded-xl border px-3.5 py-2.5 bg-white flex items-center gap-2 ${!isValid && proofUrl ? "border-rose-300 ring-1 ring-rose-200" : "focus-within:ring-2 focus-within:ring-slate-300"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-60">
                  <path d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5Zm7-3h3a5 5 0 1 1 0 10h-3v-2h3a3 3 0 1 0 0-6h-3V9Z" fill="currentColor"/>
                </svg>
                <input
                  type="url"
                  placeholder="https://x.com/your_post/status/…"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full outline-none bg-transparent text-[15px]"
                />
              </div>
              {!isValid && proofUrl && (
                <p className="text-xs text-rose-600">URL tidak valid.</p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Tip: pastikan postingan publik.</p>
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-black text-white disabled:opacity-60 shadow-lg"
                >
                  {loading ? (
                    <span className="inline-block animate-pulse">Mengirim…</span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 12h13m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Kirim Proof
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(m => ({ ...m, open: false }))}/>
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl border">
            <div className="p-6">
              <div className="mb-2 text-xl font-semibold">{modal.title}</div>
              {modal.desc && <p className="text-sm text-slate-600">{modal.desc}</p>}
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModal(m => ({ ...m, open: false }))} className="rounded-lg px-4 py-2 border">Tutup</button>
              </div>
            </div>
            <div className={`h-1 w-full rounded-b-2xl ${modal.ok ? "bg-emerald-500" : "bg-rose-500"}`} />
          </div>
        </div>
      )}
    </>
  );
}
