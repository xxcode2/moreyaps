
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  const points = user?.points ?? 0;

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Create Twitter Task</h1>
      <div className="mb-3 text-sm text-slate-600">Your balance: <b>{points}</b> pts</div>
      <form action="/api/tasks" method="post" className="space-y-3">
        <label className="label">Task Type</label>
        <select className="input" name="type" required>
          <option value="LIKE">Like</option>
          <option value="RETWEET">Retweet</option>
          <option value="REPLY">Reply</option>
          <option value="FOLLOW">Follow</option>
          <option value="QUOTE">Quote</option>
        </select>

        <label className="label">Tweet URL</label>
        <input className="input" name="tweetUrl" required placeholder="https://x.com/.../status/..." />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Reward per Claim (pts)</label>
            <input className="input" type="number" min="1" name="rewardPoints" required defaultValue="50" />
          </div>
          <div>
            <label className="label">Max Participants</label>
            <input className="input" type="number" min="1" name="maxClaims" required defaultValue="10" />
          </div>
        </div>

        <button className="btn-primary btn w-full" type="submit">Create Task</button>
        <p className="text-xs text-slate-500">We escrow points upfront: reward × max participants.</p>
      </form>
    </div>
  );
}
