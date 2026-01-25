import { mutation } from "convex/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        fullName: args.fullName,
        role: args.role
      });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      fullName: args.fullName,
      role: args.role,
      createdAt: Date.now()
    });
  }
});
