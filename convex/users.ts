import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole, requireSelf } from "./auth";

export const upsert = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: v.string()
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
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

export const list = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["owner"]);
    if (args.role) {
      return await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), args.role))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("users").order("desc").collect();
  }
});

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  }
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["owner", "admin"]);
    return await ctx.db.query("users").order("desc").collect();
  }
});

export const updateRole = mutation({
  args: { userId: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    const { userId: actorId, user: actor } = await requireAuth(ctx);
    if (!["owner", "admin"].includes(actor.role)) {
      throw new Error("Forbidden");
    }
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!existing) {
      throw new Error("Not found");
    }
    if (existing.role === "owner" && args.role !== "owner") {
      if (existing.userId === actorId) {
        throw new Error("Owner cannot demote self");
      }
      const owners = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "owner"))
        .collect();
      if (owners.length <= 1) {
        throw new Error("Cannot remove last owner");
      }
    }
    await ctx.db.patch(existing._id, { role: args.role });
    return existing._id;
  }
});
