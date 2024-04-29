import { SignJWT, importPKCS8 } from "jose";
import NextAuth, { DefaultSession } from "next-auth";
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
    jwt({ token, profile }) {
      if (profile !== undefined) {
        const { login: ghUserName, id: ghId } = profile;
        return { ...token, ghUserName, ghId: `gh_${ghId}` };
      }
      return token;
    },
    // Attach a JWT for authenticating with Convex
    async session({ session, token: { ghId, ghUserName } }) {
      const user = {
        ...session.user,
        ghId: ghId as string,
        ghUserName: ghUserName as string,
      };
      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!,
        "RS256",
      );
      const convexToken = await new SignJWT({
        // These fields will be available on `ctx.auth.getUserIdentity()`
        // in Convex functions:
        sub: user.ghId,
        nickname: user.ghUserName,
        name: user.name,
        email: user.email,
        picture: user.image,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);
      return { ...session, user, convexToken };
    },
  },
});

// Update the Session type with the property we added above
declare module "next-auth" {
  interface Session {
    user: {
      ghId: string;
      ghUserName: string;
    } & DefaultSession["user"];
    convexToken: string;
  }
}
