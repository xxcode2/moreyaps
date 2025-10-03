import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const name = String(form.get("name") ?? "");
  await prisma.user.update({ where: { id: (session.user as any).id }, data: { name } });
  return NextResponse.redirect(new URL("/profile", req.url));
}
