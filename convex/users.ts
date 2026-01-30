import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole, requireSelf } from "./auth";

const OWNER_EMAIL = "iraqacademy@mesopost.com";

const resolveInitialRole = (email: string) => {
  const normalized = String(email || "").trim().toLowerCase();
  if (normalized === OWNER_EMAIL) return "owner";
  return "student";
};

export const upsert = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const subject = identity?.subject || "";
    const normalized = subject.includes("|") ? subject.split("|").pop() || subject : subject;
    if (!identity || (subject !== args.userId && normalized !== args.userId)) {
      console.error("[users:upsert] Unauthorized", {
        subject,
        normalized,
        argsUserId: args.userId,
        issuer: identity?.issuer
      });
      throw new Error("Unauthorized");
    }
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        fullName: args.fullName,
        role: existing.role || resolveInitialRole(args.email)
      });
      return existing._id;
    }
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      fullName: args.fullName,
      role: resolveInitialRole(args.email),
      createdAt: Date.now()
    });
  }
});

export const cleanupOnboarding = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (user) {
      await ctx.db.delete(user._id);
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (cart) {
      await ctx.db.delete(cart._id);
    }

    const paymentProfile = await ctx.db
      .query("paymentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (paymentProfile) {
      await ctx.db.delete(paymentProfile._id);
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const order of orders) {
      await ctx.db.delete(order._id);
    }

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const enrollment of enrollments) {
      await ctx.db.delete(enrollment._id);
    }

    return true;
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
