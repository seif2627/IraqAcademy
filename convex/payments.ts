import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("paymentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return profile
      ? {
          payerName: profile.payerName,
          phone: profile.phone,
          notes: profile.notes
        }
      : null;
  }
});

export const setProfile = mutation({
  args: {
    userId: v.string(),
    payerName: v.string(),
    phone: v.string(),
    notes: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("paymentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        payerName: args.payerName,
        phone: args.phone,
        notes: args.notes,
        updatedAt: Date.now()
      });
      return existing._id;
    }
    return await ctx.db.insert("paymentProfiles", {
      userId: args.userId,
      payerName: args.payerName,
      phone: args.phone,
      notes: args.notes,
      updatedAt: Date.now()
    });
  }
});
