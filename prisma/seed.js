// prisma/seed.js
const { PrismaClient, TaskStatus, TaskType } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding…");

  // (opsional) creator sistem + user dev buat testing
  await prisma.user.upsert({
    where: { id: "system" },
    update: {},
    create: { id: "system" },
  });
  await prisma.user.upsert({
    where: { id: "dev-user-123" },
    update: {},
    create: { id: "dev-user-123" },
  });

  // Special Global Task
  await prisma.task.upsert({
    where: { id: "GLOBAL_FOLLOW_10K" },
    update: {
      status: TaskStatus.ACTIVE,
      maxClaims: 1_000_000,
      rewardPoints: 10_000,
      tweetUrl: "https://x.com/your_handle",
    },
    create: {
      id: "GLOBAL_FOLLOW_10K",
      type: TaskType.FOLLOW,          // pastikan enum FOLLOW ada di schema
      tweetUrl: "https://x.com/your_handle",
      rewardPoints: 10_000,
      maxClaims: 1_000_000,
      claimsCount: 0,
      escrow: 0,
      status: TaskStatus.ACTIVE,      // enum status kamu: ACTIVE
      creatorId: "system",
    },
  });

  console.log("✅ Seed done: GLOBAL_FOLLOW_10K");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
