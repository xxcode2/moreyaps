import Link from "next/link";
import { Task } from "@prisma/client";

export default function TaskCard({ t, used }: { t: Task; used: number }) {
  const left = Math.max(0, t.maxClaims - used);
  return (
    <Link href={`/task/${t.id}`} className="card hover:translate-y-[-2px] transition will-change-transform">
      <div className="flex items-center justify-between">
        <span className="badge capitalize">{t.type.toLowerCase()}</span>
        <span className="text-sm"><span className="star">⭐</span> {t.rewardPoints} / claim</span>
      </div>
      <div className="text-cyan-300 mt-2 break-all">{t.tweetUrl}</div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${(used/t.maxClaims)*100}%` }} />
      </div>
      <div className="text-xs text-slate-400 mt-1">Slots left: {left} / {t.maxClaims}</div>
    </Link>
  );
}
