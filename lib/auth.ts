// lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NEXTAUTH CONFIG
 * - JWT strategy wajib untuk Credentials
 * - pages: pakai /login (custom) untuk signin/error/signout
 * - callbacks: bawa id & points ke token dan session
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString().trim().toLowerCase();
        const password = (creds?.password || "").toString();

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, image: true, password: true, points: true },
        });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // Nilai yang dikembalikan akan menjadi "user" di callback signIn/jwt
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          points: user.points ?? 0,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * Tambahkan id & points ke token JWT
     */
    async jwt({ token, user, trigger }) {
      // saat first sign-in
      if (user) {
        token.id = (user as any).id;
        token.points = (user as any).points ?? 0;
      }

      // optional: saat update session, sinkronkan points terbaru dari DB
      if (trigger === "update" || !("points" in token)) {
        if (token?.email) {
          const u = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, points: true },
          });
          if (u) {
            token.id = u.id;
            token.points = u.points ?? 0;
          }
        }
      }
      return token;
    },

    /**
     * Tempel id & points ke session
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).points = (token as any).points ?? 0;
      }
      return session;
    },

    /**
     * Bereskan redirect supaya habis login ke dashboard
     */
    async redirect({ url, baseUrl }) {
      try {
        const u = new URL(url, baseUrl);
        if (u.origin === baseUrl) {
          // kalau diarahkan ke halaman default nextauth, lempar ke dashboard
          if (u.pathname === "/api/auth/signin" || u.pathname === "/login" || u.pathname === "/") {
            return `${baseUrl}/dashboard`;
          }
          return u.toString();
        }
      } catch {}
      return `${baseUrl}/dashboard`;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
