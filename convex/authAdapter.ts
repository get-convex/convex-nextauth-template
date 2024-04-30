import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { userSchema } from "./schema";

export const upsertUser = mutation({
  args: {
    secret: v.string(),
    user: v.object(userSchema),
  },
  handler: async (ctx, { secret, user }) => {
    if (secret !== process.env.CONVEX_AUTH_ADAPTER_SECRET) {
      throw new Error("Adapter API called without correct secret value");
    }
    const existingUser = await ctx.db
      .query("users")
      .withIndex("ghId", (q) => q.eq("ghId", user.ghId))
      .first();
    if (existingUser === null) {
      return await ctx.db.insert("users", user);
    }
    await ctx.db.patch(existingUser._id, user);
    return existingUser._id;
  },
});
