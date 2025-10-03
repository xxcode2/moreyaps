
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const claimId = params.id;

  const res = await prisma.$transaction(async (tx) => {
    const claim = await tx.claim.findUnique({ where: { id: claimId }, include: { task: true } });
    if (!claim) throw new Error("Claim not found");
    if (claim.status !== "PENDING") throw new Error("Already handled");
    if (claim.task.creatorId !== userId) throw new Error("Only task owner can approve");
    if (claim.task.escrow < claim.task.rewardPoints) throw new Error("Escrow insufficient");

    // pay worker: move points from task escrow to worker
    await tx.claim.update({ where: { id: claimId }, data: { status: "APPROVED" } });
    await tx.user.update({ where: { id: claim.workerId }, data: { points: { increment: claim.task.rewardPoints } } });
    await tx.task.update({ where: { id: claim.taskId }, data: { escrow: { decrement: claim.task.rewardPoints } } });

    // if escrow emptied and all claims handled, consider status update
    const t = await tx.task.findUnique({ where: { id: claim.taskId } });
    if (t && t.escrow === 0) {
      await tx.task.update({ where: { id: t.id }, data: { status: "COMPLETED" } });
    }
    return { ok: true };
  }).catch((e) => ({ error: e.message }));

  if ("error" in res) return NextResponse.json(res, { status: 400 });
  return NextResponse.redirect(new URL(`/my`, req.url));
}
