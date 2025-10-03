import FilterBar from "@/components/FilterBar";
import { prisma } from "@/lib/prisma";

export default async function GlobalTasks({ searchParams }: { searchParams: { type?: string }}) {
  const type = (searchParams.type || "").toUpperCase();
  const where = {
    status: "ACTIVE" as const,
    ...(type && type !== "ALL" ? { type } : {})
  };
  const tasks = await prisma.task.findMany({
    where, orderBy: { createdAt: "desc" }, take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Global Tasks</h1>
      <FilterBar />
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(t => (
          <a key={t.id} href={`/task/${t.id}`} className="card hover:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="capitalize">{t.type.toLowerCase()}</div>
              <div className="text-sm">⭐ {t.rewardPoints} / claim</div>
            </div>
            <div className="text-sm text-cyan-300 mt-1 break-all">{t.tweetUrl}</div>
            <div className="text-xs text-slate-400 mt-1">
              Slots left: {t.maxClaims - (t as any).claimsCount} / {t.maxClaims}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
