import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TaskDetail({ params }: { params: { id: string } }) {
  const session = await auth();
  const me = session?.user as any | undefined;

  const t = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { claims: true } },
      creator: { select: { id: true, name: true } }
    }
  });
  if (!t) return notFound();

  const used = t._count.claims;
  const left = Math.max(0, t.maxClaims - used);
  const isOwner = me?.id === t.creatorId;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 capitalize">{t.type.toLowerCase()} task by {t.creator?.name ?? "user"}</div>
            <h1 className="text-xl font-semibold mt-1">{t.type.toLowerCase()} task by YapTasks</h1>
            <div className="text-sm mt-2">
              <span className="text-slate-400">Tweet URL: </span>
              <a href={t.tweetUrl} className="text-cyan-300 break-all" target="_blank">{t.tweetUrl}</a>
            </div>
            <div className="text-xs text-slate-400 mt-1">Slots left: {left} / {t.maxClaims}</div>
            <div className="progress mt-2"><i style={{ width: `${(used / t.maxClaims) * 100}%` }} /></div>
          </div>
          <div className="text-sm"><span className="star">⭐</span> {t.rewardPoints} / claim</div>
        </div>
      </div>

      {/* Kalau BUKAN owner -> form claim. Kalau owner -> panel manage */}
      {!isOwner ? (
        <div className="card">
          <h2 className="font-semibold mb-2">Submit Proof</h2>
          <p className="text-sm text-slate-400 mb-3">Proof URL (your like/retweet/reply link or profile for follow)</p>
          <form action={`/api/tasks/${t.id}/claim`} method="post" className="flex items-center gap-3">
            <input name="proofUrl" required placeholder="https://x.com/yourname/status/..." className="input input-lg flex-1" />
            <button className="btn btn-cta px-5">Claim</button>
          </form>
          <p className="text-xs text-slate-500 mt-3">
            Auto-verification via X API is optional; by default, creator reviews claims.
          </p>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-semibold mb-2">Manage Task</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/my/edit/${t.id}`} className="btn btn-ghost">Edit</Link>
            {t.status === "ACTIVE" && (
              <form action={`/api/tasks/${t.id}/cancel`} method="post">
                <button className="btn border-red-400/40 text-red-300 hover:bg-red-500/10">Cancel</button>
              </form>
            )}
            <Link href="/my" className="btn">Back to My Tasks</Link>
          </div>
        </div>
      )}
    </div>
  );
}
