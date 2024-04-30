import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { SignJWT, importPKCS8 } from "jose";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

if (process.env.CONVEX_AUTH_PRIVATE_KEY === undefined) {
  throw new Error("Missing CONVEX_AUTH_PRIVATE_KEY environment variable");
}

if (process.env.NEXT_PUBLIC_CONVEX_URL === undefined) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
  /.cloud$/,
  ".site",
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // Attach additional properties from GitHub OAuth to the Auth.js token
    async jwt({ token, profile, user }) {
      if (profile !== undefined) {
        const { login: ghUserName, id: ghId } = profile;
        const convexUserId = await fetchMutation(api.authAdapter.upsertUser, {
          secret: process.env.CONVEX_AUTH_ADAPTER_SECRET!,
          user: {
            ghId: "" + ghId!,
            ghUserName: ghUserName as string,
            name: user.name ?? null,
            email: user.email!,
            picture: user.image ?? null,
          },
        });
        return { ...token, convexUserId };
      }
      return token;
    },
    // Attach a JWT for authenticating with Convex
    async session({ session, token: { convexUserId } }) {
      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!,
        "RS256",
      );
      const convexToken = await new SignJWT({
        // These fields will be available on `ctx.auth.getUserIdentity()`
        // in Convex functions:
        sub: convexUserId as string,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);
      return { ...session, convexToken };
    },
  },
});

declare module "next-auth" {
  interface Session {
    convexToken: string;
  }
}
