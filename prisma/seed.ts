// prisma/seed.js
const { PrismaClient, TaskStatus, TaskType } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Special Global Task…");

  // (opsional) siapkan creator "system"
  await prisma.user.upsert({
    where: { id: "system" },
    update: {},
    create: { id: "system" },
  });

  // Task spesial global
  await prisma.task.upsert({
    where: { id: "GLOBAL_FOLLOW_10K" },
    update: {
      // kalau sudah ada, pastikan tetap ACTIVE dan reset angka bila perlu
      status: TaskStatus.ACTIVE,
      maxClaims: 1_000_000,
    },
    create: {
      id: "GLOBAL_FOLLOW_10K",
      type: TaskType.FOLLOW,                 // pastikan enum ini ada di schema
      tweetUrl: "https://x.com/your_handle", // tampil di dashboard
      rewardPoints: 10_000,
      maxClaims: 1_000_000,
      claimsCount: 0,
      escrow: 0,
      status: TaskStatus.ACTIVE,             // enum kamu: ACTIVE
      creatorId: "system",
    },
  });

  console.log("✅ Seed done: GLOBAL_FOLLOW_10K (Follow our X — Earn 10,000 pts)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
