import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, email: true, name: true, image: true, points: true },
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="card space-y-4">
        <div className="flex items-center gap-4">
          <img src={user?.image ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`} className="w-16 h-16 rounded-full border border-white/10" />
          <div>
            <div className="text-sm text-slate-400">Email</div>
            <div className="font-semibold">{user?.email}</div>
            <div className="text-sm text-slate-400 mt-1">Balance: ⭐ {user?.points.toLocaleString()} pts</div>
          </div>
        </div>

        <form action="/api/profile" method="post" className="space-y-2">
          <label className="label">Display name</label>
          <input className="input" name="name" defaultValue={user?.name ?? ""} />
          <button className="btn-primary btn">Save</button>
        </form>
      </div>
    </div>
  );
}
