// lib/session.ts
import { headers } from "next/headers";

/**
 * Return userId dari session.
 * - Mode normal: pakai next-auth getServerSession(authOptions)
 * - Mode dev/testing: jika AUTH_DISABLED=true, ambil dari header `x-user-id`
 *   atau fallback ke DEV_USER_ID, default "dev-user"
 */
export async function getSessionUserId(): Promise<string | null> {
  // Dev bypass
  if (process.env.AUTH_DISABLED === "true") {
    const h = headers();
    const override = h.get("x-user-id") || process.env.DEV_USER_ID || "dev-user";
    return override;
  }

  // Coba next-auth (v4/v5)
  try {
    const nextAuth = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    // @ts-ignore - tolerate different next-auth typings
    const session = await nextAuth.getServerSession(authOptions);
    return session?.user?.id ?? null;
  } catch (_err) {
    // Fallback terakhir: coba getSession dari next-auth/react (tidak ideal untuk server route, tapi aman sebagai emergency)
    try {
      const nextAuthReact = await import("next-auth/react");
      // @ts-ignore
      const session = await nextAuthReact.getSession();
      return session?.user?.id ?? null;
    } catch {
      return null;
    }
  }
}

/** Lempar 401 response payload standar */
export function unauthorizedJson() {
  return { error: "Unauthorized" };
}
