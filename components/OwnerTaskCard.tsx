import Link from "next/link";
import { Task } from "@prisma/client";

export default function OwnerTaskCard({ t, used }: { t: Task; used: number }) {
  const left = Math.max(0, t.maxClaims - used);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="badge capitalize">{t.type.toLowerCase()}</span>
        <span className="text-sm"><span className="star">⭐</span> {t.rewardPoints} / claim</span>
      </div>
      <a href={t.tweetUrl} target="_blank" className="text-cyan-300 mt-2 break-all">{t.tweetUrl}</a>
      <div className="text-xs text-slate-400 mt-1">Slots left: {left} / {t.maxClaims} — Status: {t.status.toLowerCase()}</div>
      <div className="progress mt-2"><i style={{ width: `${(used / t.maxClaims) * 100}%` }} /></div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/my/edit/${t.id}`} className="btn btn-ghost">Edit</Link>
        {t.status === "ACTIVE" && (
          <form action={`/api/tasks/${t.id}/cancel`} method="post">
            <button className="btn border-red-400/40 text-red-300 hover:bg-red-500/10">Cancel</button>
          </form>
        )}
        <Link href={`/task/${t.id}`} className="btn">Open</Link>
      </div>
    </div>
  );
}
