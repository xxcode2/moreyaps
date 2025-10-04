// app/api/claims/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ClaimStatus, TaskStatus } from "@prisma/client";
import { getSessionUserId, unauthorizedJson } from "@/lib/session";

type RouteParams = { params: { id: string } };

export async function POST(_req: Request, { params }: RouteParams) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json(unauthorizedJson(), { status: 401 });
    }

    const claim = await prisma.claim.findUnique({
      where: { id: params.id },
      include: { task: true, worker: true },
    });
    if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    if (!claim.task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // hanya creator task yang boleh approve
    if (claim.task.creatorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // === gunakan enum status yang ada di DB kamu (ACTIVE) ===
    if (claim.task.status !== TaskStatus.ACTIVE) {
      return NextResponse.json({ error: "Task is not active" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const approved = await tx.claim.update({
        where: { id: claim.id },
        data: { status: ClaimStatus.APPROVED },
        include: { task: true },
      });

      const nextCount = approved.task.claimsCount + 1;
      const shouldClose = nextCount >= approved.task.maxClaims;

      const updatedTask = await tx.task.update({
        where: { id: approved.taskId },
        data: {
          claimsCount: { increment: 1 },
          status: shouldClose ? TaskStatus.CLOSED : approved.task.status,
        },
        select: { status: true },
      });

      return { updatedTask };
    });

    return NextResponse.json({
      ok: true,
      claimId: claim.id,
      taskId: claim.taskId,
      taskStatus: result.updatedTask.status,
    });
  } catch (err: any) {
    console.error("approve claim error:", err);
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}
