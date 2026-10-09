import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { isValidTimezone } from "@/server/dates";
import { generateUsername } from "@/server/profile";

export const TIMEZONE_COOKIE = "tz";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  session: { strategy: "database" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    // New users get a username and the browser's timezone (set in a cookie by the layout).
    async createUser({ user }) {
      if (!user.id) return;
      const tz = (await cookies()).get(TIMEZONE_COOKIE)?.value;
      await db
        .update(users)
        .set({
          username: await generateUsername(db, user.email ?? null, user.name ?? null),
          ...(tz && isValidTimezone(tz) ? { timezone: tz } : {}),
        })
        .where(eq(users.id, user.id));
    },
  },
});

/** The signed-in user's ID, or null. */
export async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
