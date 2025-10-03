import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FilterBar from "@/components/FilterBar";
import OwnerTaskCard from "@/components/OwnerTaskCard";
import { Prisma, TaskType } from "@prisma/client";

export default async function MyTasks({ searchParams }: { searchParams: { type?: string }}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const typeParam = (searchParams.type || "").toUpperCase();
  const where: Prisma.TaskWhereInput = {
    creatorId: (session.user as any).id,
    ...(typeParam && typeParam !== "ALL" ? { type: { equals: typeParam as TaskType } } : {})
  };
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { claims: true } } }
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">My Tasks</h1>
      <FilterBar />
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(t => <OwnerTaskCard key={t.id} t={t as any} used={t._count.claims} />)}
        {tasks.length === 0 && <div className="card text-slate-400">No tasks yet.</div>}
      </div>
    </div>
  );
}
