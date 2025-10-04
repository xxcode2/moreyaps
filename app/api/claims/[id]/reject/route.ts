// app/api/claims/[id]/reject/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// import { ClaimStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const claimId = params.id;

    const claim = await prisma.claim.findFirst({
      where: { id: claimId },
      include: { task: true },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    if (claim.task.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not the owner of this task." },
        { status: 403 }
      );
    }

    const updated = await prisma.claim.update({
      where: { id: claimId },
      data: { status: "REJECTED" }, // atau ClaimStatus.REJECTED
    });

    return NextResponse.json({ ok: true, claim: updated });
  } catch (e) {
    console.error("[reject][error]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
