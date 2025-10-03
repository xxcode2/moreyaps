import { prisma } from "@/lib/prisma";
import FilterBar from "@/components/FilterBar";
import TaskCard from "@/components/TaskCard";
import { Prisma, TaskType } from "@prisma/client";

export default async function GlobalTasks({
  searchParams,
}: { searchParams: { type?: string } }) {
  const typeParam = (searchParams.type || "").toUpperCase();
  const mapped = typeParam === "COMMENT" ? "REPLY" : typeParam;

  const where: Prisma.TaskWhereInput = {
    status: "ACTIVE",
    ...(mapped && mapped !== "ALL" ? { type: { equals: mapped as TaskType } } : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { claims: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Global Tasks</h1>
      <FilterBar />

      {/* HANYA list ini yang dirender */}
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <TaskCard key={t.id} t={t as any} used={t._count.claims} />
        ))}
        {tasks.length === 0 && (
          <div className="card text-slate-400">No tasks for this filter yet.</div>
        )}
      </div>
    </div>
  );
}
