import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = {
  ghId: v.string(),
  ghUserName: v.string(),
  name: v.union(v.string(), v.null()),
  email: v.string(),
  picture: v.union(v.string(), v.null()),
};

export default defineSchema({
  users: defineTable(userSchema).index("ghId", ["ghId"]),
  numbers: defineTable({
    value: v.number(),
  }),
});
