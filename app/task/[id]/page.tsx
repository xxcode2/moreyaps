import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import ClaimFormClient from "./ClaimFormClient";
import SubmitProof from "@/components/SubmitProof";

type Props = { params: { id: string } };

export default async function TaskPage({ params }: Props) {
  const [task, userId] = await Promise.all([
    prisma.task.findUnique({
      where: { id: params.id },
      select: {
        id: true, type: true, tweetUrl: true, rewardPoints: true,
        maxClaims: true, claimsCount: true, status: true,
      },
    }),
    getSessionUserId(),
  ]);

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-2xl border p-6 bg-red-50 border-red-200 text-red-700">
          Task not found
        </div>
      </div>
    );
  }

  let points: number | null = null;
  if (userId) {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
    points = u?.points ?? 0;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-3xl border shadow-sm overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{task.id}</h1>
              <p className="text-sm text-slate-500 mt-1">Type: {task.type}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Status</div>
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200 text-xs font-medium">
                {task.status}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-xl border bg-white p-4">
              <div className="text-slate-500 text-xs">Reward</div>
              <div className="text-lg font-semibold">{task.rewardPoints}</div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="text-slate-500 text-xs">Claims</div>
              <div className="text-lg font-semibold">{task.claimsCount}/{task.maxClaims}</div>
            </div>
            <div className="rounded-xl border bg-white p-4 col-span-2">
              <div className="text-slate-500 text-xs">Tweet</div>
              <a href={task.tweetUrl} target="_blank" className="text-sm text-blue-600 underline break-all">
                {task.tweetUrl}
              </a>
            </div>
          </div>

          {userId && (
            <div className="mt-6 rounded-xl border bg-white p-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Logged as <span className="font-medium">{userId}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Your Points</div>
                <div id="points-value" className="text-xl font-bold">{typeof points === "number" ? points : 0}</div>
              </div>
            </div>
          )}
        </div>

        <ClaimFormClient taskId={task.id} reward={task.rewardPoints} />
      </div>
       <div>
      {/* info task */}
      <SubmitProof reward={10000} />
    </div>
    </div>
  );
}
