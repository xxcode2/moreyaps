import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { getSessionUserId, unauthorizedJson } from "@/lib/session";

type RouteParams = { params: { id: string } };

async function sendWebhook(payload: any) {
  const url = process.env.CLAIM_WEBHOOK_URL;
  if (!url) return { ok: false, skipped: true };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json(unauthorizedJson(), { status: 401 });

    // Terima JSON atau Form
    let proofUrl = "";
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      proofUrl = body?.proofUrl ?? "";
    } else {
      const form = await req.formData().catch(() => null);
      proofUrl = (form?.get("proofUrl") as string) || "";
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      select: {
        id: true, status: true, maxClaims: true, claimsCount: true,
        rewardPoints: true, tweetUrl: true,
      },
    });
    if (!task) return NextResponse.json({ ok: false, message: "Task not found" }, { status: 404 });

    if (task.status !== TaskStatus.ACTIVE) {
      return NextResponse.json({ ok: false, code: "INACTIVE", message: "Task is not active" }, { status: 200 });
    }
    // (opsional) tahan spam jika penuh
    if (task.claimsCount >= task.maxClaims) {
      return NextResponse.json({ ok: false, code: "FULL", message: "Task claim capacity reached" }, { status: 200 });
    }

    // Pastikan user ada
    await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } });

    // Notif keluar (tanpa tulis Claim)
    await sendWebhook({
      type: "task_claim_notification",
      taskId: task.id, userId, proofUrl,
      tweetUrl: task.tweetUrl, rewardPoints: task.rewardPoints,
      at: new Date().toISOString(),
    });

    // Increment points beneran di DB
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: task.rewardPoints } },
      select: { points: true },
    });

    return NextResponse.json({
      ok: true,
      code: "NOTIFIED_ONLY",
      message: "Claim received (not saved). Points added.",
      data: {
        taskId: task.id,
        userId,
        proofUrl,
        reward: task.rewardPoints,
        newPoints: updated.points, // saldo baru
      },
    });
  } catch (err: any) {
    console.error("claim notify-only error:", err);
    return NextResponse.json({ ok: false, code: "ERROR", message: err?.message ?? "Internal error" }, { status: 200 });
  }
}
