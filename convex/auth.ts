import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

export async function getSessionId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  const [, sessionId] = identity.subject.split(";");
  return sessionId as Id<"sessions">;
}

export async function getViewerId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  const [userId] = identity.subject.split(";");
  return userId as Id<"users">;
}
