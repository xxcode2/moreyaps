import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TaskCard from "@/components/TaskCard";

const SPECIAL_SLUG = "GLOBAL_FOLLOW_10K";

export default async function Dashboard() {
  const session = await auth();
  const points = (session?.user as any)?.points ?? 0;

  // ensure special task exists
  await prisma.task.upsert({
    where: { id: SPECIAL_SLUG },
    update: {},
    create: {
      id: SPECIAL_SLUG,
      type: "FOLLOW",
      tweetUrl: "https://x.com/your_handle", // ganti handle kamu
      rewardPoints: 10000,
      maxClaims: 1_000_000,
      escrow: 0,
      status: "ACTIVE",
      creatorId: (await ensureSystemUser()).id,
    },
  });

  const recent = await prisma.task.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { _count: { select: { claims: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2 shine">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Special Global Task</div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                Follow our X (Twitter) —{" "}
                <span className="text-cyan-300">Earn 10,000 pts</span>
              </h2>
              <p className="text-slate-300 mt-2 max-w-2xl">
                Tersedia untuk semua user. Follow akun kami & submit proof profilmu.
              </p>
            </div>
            <div className="flex gap-2">
  <a className="btn btn-ghost" href="https://x.com/your_handle" target="_blank">Open X Profile</a>
  <Link href={`/task/GLOBAL_FOLLOW_10K`} className="btn btn-cta px-5">Submit Proof</Link>
</div>

          </div>
        </div>

        <div className="card">
          <div className="text-sm text-slate-400">Your Balance</div>
          <div className="mt-1 text-4xl font-extrabold">
            <span className="star">⭐</span> {points.toLocaleString()} pts
          </div>
          <div className="mt-4 flex gap-2">
  <Link href="/create" className="btn btn-cta px-5">Create Task</Link>
  <Link href="/" className="btn btn-ghost">Explore Tasks</Link>
</div>

        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Tasks</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recent.map((t) => (
            <TaskCard key={t.id} t={t as any} used={t._count.claims} />
          ))}
          {recent.length === 0 && (
            <div className="card text-slate-400">No tasks yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

async function ensureSystemUser() {
  let sys = await prisma.user.findFirst({ where: { email: "system@yaptasks" } });
  if (!sys) {
    sys = await prisma.user.create({
      data: { email: "system@yaptasks", name: "YapTasks", points: 0 },
    });
  }
  return sys;
}
