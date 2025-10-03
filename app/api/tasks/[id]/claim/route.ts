import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TaskType } from "@prisma/client";
data: { type: someValue as TaskType }



export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData(); // from edit page form
  const type = String(form.get("type") || "");
  const tweetUrl = String(form.get("tweetUrl") || "");
  const rewardPoints = Number(form.get("rewardPoints") || 0);
  const maxClaims = Number(form.get("maxClaims") || 0);

  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task || task.creatorId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // hitung perubahan kuota untuk escrow (naik/turun)
  const used = (task as any).claimsCount ?? 0;
  if (maxClaims < used) {
    return NextResponse.json({ error: `maxClaims < used (${used})` }, { status: 400 });
  }

  // jika reward atau maxClaims berubah, sesuaikan escrow
  // escrow baru yang dibutuhkan untuk sisa slot:
  const oldRemaining = task.maxClaims - used;
  const newRemaining = maxClaims - used;
  const oldNeed = oldRemaining * task.rewardPoints;
  const newNeed = newRemaining * rewardPoints;
  let delta = newNeed - oldNeed; // >0: butuh tambah escrow; <0: refund

  // transaksi kecil: update task + saldo user bila perlu
  await prisma.$transaction(async (tx) => {
    if (delta > 0) {
      // tarik dari saldo user
      await tx.user.update({
        where: { id: task.creatorId },
        data: { points: { decrement: delta } },
      });
    } else if (delta < 0) {
      await tx.user.update({
        where: { id: task.creatorId },
        data: { points: { increment: -delta } },
      });
    }

    await tx.task.update({
      where: { id: task.id },
      data: {
        type, tweetUrl, rewardPoints, maxClaims,
        escrow: Math.max(0, (task.escrow ?? 0) + delta),
      },
    });
  });

  return NextResponse.redirect(new URL("/my", req.url));
}
