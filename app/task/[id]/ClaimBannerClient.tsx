"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClaimBannerClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  const notify = sp.get("notify"); // claimed | full | inactive | error
  const proof = sp.get("proof") || "";
  const user = sp.get("u") || "";

  useEffect(() => {
    // auto-hide after 4s
    if (!notify) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [notify]);

  if (!notify || !visible) return null;

  let bg = "bg-green-50 border-green-200 text-green-700";
  let msg = "Claim submitted!";
  if (notify === "full") {
    bg = "bg-amber-50 border-amber-200 text-amber-700";
    msg = "Task is full. Your claim notification was not recorded.";
  } else if (notify === "inactive") {
    bg = "bg-amber-50 border-amber-200 text-amber-700";
    msg = "Task is not active.";
  } else if (notify === "error") {
    bg = "bg-red-50 border-red-200 text-red-700";
    msg = "Something went wrong while sending your claim.";
  } else if (notify === "claimed") {
    msg = "Claim received (not saved) — notification sent.";
  }

  const clearQs = () => {
    // bersihkan query agar banner hilang saat refresh
    const url = new URL(window.location.href);
    url.searchParams.delete("notify");
    url.searchParams.delete("proof");
    url.searchParams.delete("u");
    router.replace(`${pathname}${url.search ? "?" + url.searchParams.toString() : ""}`);
  };

  return (
    <div className={`rounded-xl border p-3 ${bg} flex items-start justify-between gap-4`}>
      <div>
        <div className="font-medium">{msg}</div>
        {(proof || user) && (
          <div className="text-xs mt-1 opacity-80">
            {user && <>User: <b>{user}</b> • </>}
            {proof && <>Proof: <a className="underline" href={proof} target="_blank" rel="noreferrer">{proof}</a></>}
          </div>
        )}
      </div>
      <button
        onClick={() => { setVisible(false); clearQs(); }}
        className="text-xs underline"
      >
        Dismiss
      </button>
    </div>
  );
}
