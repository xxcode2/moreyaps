// app/api/tasks/[id]/claim/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { getSessionUserId, unauthorizedJson } from "@/lib/session";

type RouteParams = { params: { id: string } };

async function sendWebhook(payload: any) {
  const url = process.env.CLAIM_WEBHOOK_URL;
  if (!url) {
    console.warn("[claim] CLAIМ_WEBHOOK_URL not set. Payload:", payload);
    return { ok: false, skipped: true };
  }
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
    if (!userId) {
      return NextResponse.json(unauthorizedJson(), { status: 401 });
    }

    const taskId = params.id;
    const body = await req.json().catch(() => ({}));
    const proofUrl: string = body?.proofUrl ?? "";

    // Ambil task (tanpa menyentuh tabel Claim)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        status: true,
        maxClaims: true,
        claimsCount: true,
        rewardPoints: true,
        tweetUrl: true,
        creatorId: true,
      },
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // Pakai enum status yang ada di DB kamu (ACTIVE)
    if (task.status !== TaskStatus.ACTIVE) {
      return NextResponse.json({ error: "Task is not active" }, { status: 400 });
    }

    // Opsional: masih cek kapasitas agar tidak spam (hapus blok ini kalau mau selalu menerima)
    if (task.claimsCount >= task.maxClaims) {
      return NextResponse.json({ error: "Task claim capacity reached" }, { status: 400 });
    }

    // KIRIM NOTIFIKASI SAJA — TIDAK INSERT KE TABEL Claim
    const payload = {
      type: "task_claim_notification",
      taskId: task.id,
      status: task.status,
      userId,
      proofUrl,
      tweetUrl: task.tweetUrl,
      rewardPoints: task.rewardPoints,
      at: new Date().toISOString(),
    };

    // Format khusus untuk Discord (biar rapi). Kalau bukan Discord, payload umum di atas juga dikirim.
    const discordPayload = {
      username: "MoreYaps Bot",
      content: `🟢 New Claim (NOT SAVED)\nTask: **${task.id}**\nUser: **${userId}**\nProof: ${proofUrl || "-"}\nReward: ${task.rewardPoints}`,
    };

    // Coba kirim payload umum dulu
    const res1 = await sendWebhook(payload);
    // Lalu, kalau webhook-nya Discord, payload umum tetap diterima;
    // tapi kalau mau styling, kirim juga discordPayload (nggak apa-apa ganda).
    const res2 = await sendWebhook(discordPayload);

    return NextResponse.json({
      ok: true,
      saved: false, // indikator jelas: tidak disimpan ke DB Claim
      notified: res1.ok || res2.ok || false,
      message:
        !process.env.CLAIM_WEBHOOK_URL
          ? "Claim received (not saved). No webhook configured; logged to server."
          : "Claim received (not saved). Notification sent.",
      data: {
        taskId: task.id,
        userId,
        proofUrl,
      },
    });
  } catch (err: any) {
    console.error("claim notify-only error:", err);
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}
