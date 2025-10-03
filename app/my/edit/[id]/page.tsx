import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function EditTask({ params }: { params: { id: string }}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const task = await prisma.task.findUnique({ where: { id: params.id }});
  if (!task || task.creatorId !== (session.user as any).id) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Task</h1>
      <form className="card space-y-3" action={`/api/tasks/${task.id}`} method="post">
        <label className="label">Type</label>
        <select name="type" defaultValue={task.type} className="input">
          <option value="FOLLOW">FOLLOW</option>
          <option value="LIKE">LIKE</option>
          <option value="RETWEET">RETWEET</option>
          <option value="REPLY">REPLY</option>
        </select>

        <label className="label">Tweet URL / Profile URL</label>
        <input name="tweetUrl" defaultValue={task.tweetUrl} className="input" />

        <label className="label">Reward per claim (pts)</label>
        <input type="number" name="rewardPoints" defaultValue={task.rewardPoints} className="input" min={1} />

        <label className="label">Max participants</label>
        <input type="number" name="maxClaims" defaultValue={task.maxClaims} className="input" min={1} />

        <button className="btn-primary btn">Save changes</button>
      </form>
    </div>
  );
}
