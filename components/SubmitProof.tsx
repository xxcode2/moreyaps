"use client";
import { useState } from "react";

export default function SubmitProof({ reward }: { reward: number }) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const res = await fetch("/api/tasks/GLOBAL_FOLLOW_10K/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofUrl: url }),
    });

    if (res.ok) {
      setUrl("");
      setOpen(true);
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-2 text-white">Submit Proof</h3>
      <p className="text-sm text-slate-400 mb-4">
        Kirim link bukti (post X, screenshot link, dsb).  
        Tidak menyimpan klaim — hanya notifikasi ke admin, poin otomatis ditambahkan.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          placeholder="https://x.com/your_post/status/…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
        >
          Kirim Proof
        </button>
      </form>

      <p className="mt-2 text-xs text-slate-500">
        Tip: pastikan postingan publik. Reward: +{reward.toLocaleString()} pts
      </p>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-slate-800 mb-2">🎉 Proof terkirim!</h2>
            <p className="text-slate-600 text-sm mb-4">
              Claim received (not saved). Points berhasil ditambahkan ke akunmu.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
