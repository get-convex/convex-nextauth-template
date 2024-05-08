import {
  ConvexAdapter,
  maybeSessionFromDB,
  maybeUserFromDB,
  maybeVerificationTokenFromDB,
} from "../app/ConvexAdapter";
import { runBasicTests } from "./utilsTestAdapter";
import { TestConvex, convexTest } from "convex-test";
import schema from "../convex/schema";
import { vi } from "vitest";
import { FunctionReference } from "convex/server";
import { Id } from "../convex/_generated/dataModel";

let t: TestConvex<typeof schema> = null as any;

void runBasicTests({
  adapter: ConvexAdapter,
  testWebAuthnMethods: true,
  db: {
    async connect() {
      process.env.CONVEX_AUTH_ADAPTER_SECRET = "very secret";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://some.convex.cloud";
      t = convexTest(schema);
      vi.mock("convex/nextjs", () => ({
        fetchMutation: (
          functionReference: FunctionReference<"mutation">,
          args: any,
        ) => t.mutation(functionReference, args),
        fetchQuery: (
          functionReference: FunctionReference<"query">,
          args: any,
        ) => t.query(functionReference, args),
      }));
    },
    async disconnect() {
      t = null as any;
    },
    async user(id: string) {
      return maybeUserFromDB(
        await t.run(async (ctx) => await ctx.db.get(id as Id<"users">)),
      );
    },
    async account({ provider, providerAccountId }) {
      const account = await t.run(async (ctx) => {
        const account = await ctx.db
          .query("accounts")
          .withIndex("providerAndAccountId", (q) =>
            q
              .eq("provider", provider)
              .eq("providerAccountId", providerAccountId),
          )
          .unique();
        return account;
      });
      if (account === null) {
        return null;
      }
      return { ...account, id: account._id };
    },
    async session(sessionToken) {
      const session = maybeSessionFromDB(
        await t.run(async (ctx) => {
          const session = await ctx.db
            .query("sessions")
            .withIndex("sessionToken", (q) =>
              q.eq("sessionToken", sessionToken),
            )
            .unique();
          return session;
        }),
      );
      if (session === null) {
        return null;
      }
      return { ...session, id: session._id };
    },
    async verificationToken({ identifier, token }) {
      const verificationToken = maybeVerificationTokenFromDB(
        await t.run(async (ctx) => {
          const verificationToken = await ctx.db
            .query("verificationTokens")
            .withIndex("identifierToken", (q) =>
              q.eq("identifier", identifier).eq("token", token),
            )
            .unique();
          return verificationToken;
        }),
      );
      return verificationToken;
    },
    async authenticator(credentialID) {
      return await t.run(async (ctx) => {
        const authenticator = await ctx.db
          .query("authenticators")
          .withIndex("credentialID", (q) => q.eq("credentialID", credentialID))
          .unique();
        return authenticator;
      });
    },
  },
});

function withoutSystemFields<T extends Record<string, any>>(object: T | null) {
  if (object === null) {
    return null;
  }
  const { _id, _creationTime, ...rest } = object;
  return rest;
}
