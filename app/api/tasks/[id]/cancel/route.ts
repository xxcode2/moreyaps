import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task || task.creatorId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (task.status !== "ACTIVE") {
    return NextResponse.json({ error: "Task not active" }, { status: 400 });
  }

  const escrow = task.escrow ?? 0;

  await prisma.$transaction(async (tx) => {
    // refund semua escrow tersisa ke creator
    if (escrow > 0) {
      await tx.user.update({
        where: { id: task.creatorId },
        data: { points: { increment: escrow } },
      });
    }

await tx.task.update({
  where: { id: task.id },
  data: {
    type, // <- sudah TaskType
    tweetUrl,
    rewardPoints,
    maxClaims,
    escrow: Math.max(0, (task.escrow ?? 0) + delta),
  },
});

  return NextResponse.redirect(new URL("/my", req.url));
}
