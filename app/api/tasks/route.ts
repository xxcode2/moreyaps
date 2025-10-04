import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";  
import { TaskType } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const form = await req.formData();
  const type = String(form.get("type"));
  const tweetUrl = String(form.get("tweetUrl"));
  const rewardPoints = Number(form.get("rewardPoints"));
  const maxClaims = Number(form.get("maxClaims"));
  if (!type || !tweetUrl || !rewardPoints || !maxClaims) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const escrow = rewardPoints * maxClaims;
const type = String(form.get("type") || "") as TaskType;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    if (user.points < escrow) throw new Error("Insufficient points");

    const task = await tx.task.create({
      data: {
        type: type as any,
        tweetUrl,
        rewardPoints,
        maxClaims,
        escrow,
        creatorId: userId,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { points: { decrement: escrow } },
    });

    return task;
  }).catch((e) => {
    return { error: e.message };
  });

  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.redirect(new URL(`/task/${result.id}`, req.url));
}

export async function GET() {
  const tasks = await prisma.task.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}
