
# YapTasks — Twitter Promo Taskboard (Points-based)

Minimal full-stack app for creating promo tasks (like/follow/retweet/reply/quote) and rewarding participants with points. Built with **Next.js 14 (App Router)**, **Prisma + Postgres**, **NextAuth**, and **Tailwind**. Ready for Vercel.

## Features
- OAuth login (GitHub/Google via NextAuth).
- User points balance (starter 500 pts).
- Create tasks with: type, tweet URL, reward per claim, max participants.
- Escrow points on creation (reward × max).
- Public task feed; anyone can claim and submit **proof URL**.
- Creator reviews claims and approves to release points.
- My Tasks: see tasks you created and claims you made.

> **Verification**: Default is manual review by the task creator (check proof URL). Optional X(Twitter) API integration can automate verification if you provide API keys (left as an exercise).

## Local Dev
```bash
pnpm i    # or npm i / yarn
cp .env.example .env
# Fill DATABASE_URL (Postgres), NEXTAUTH_SECRET, and any OAuth keys.
npx prisma migrate dev --name init
pnpm dev
```

## Deploy to Vercel
1. Create a Postgres DB (Neon or Vercel Postgres). Copy `DATABASE_URL`.
2. **Vercel → New Project** and import this repo.
3. Add ENV VARS: `DATABASE_URL`, `NEXTAUTH_URL` (your Vercel URL), `NEXTAUTH_SECRET`, and your OAuth keys (GitHub/Google).
4. Deploy. After first deploy, run `npx prisma migrate deploy` via Vercel build or a one-off script.

## Notes & Next Steps
- Add **auto-verification** via X API (requires Elevated access). For LIKE/RETWEET/REPLY/QUOTE you can check the user action against the Tweet ID.
- Add **top-up points** (Stripe, on-chain, etc.).
- Add **task pause/cancel** and **refund unspent escrow** when cancelling.
- Add **rate limits** and **anti-abuse** (unique claim per user already enforced).
- Add **webhooks**/notifications and richer analytics.
