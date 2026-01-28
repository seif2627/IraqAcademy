import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireSelf } from "./auth";

const orderItems = v.array(
  v.object({
    courseId: v.string(),
    title: v.string(),
    price: v.number(),
    qty: v.number()
  })
);

export const create = mutation({
  args: {
    userId: v.string(),
    items: orderItems,
    total: v.number(),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    paymentDetails: v.object({
      payerName: v.string(),
      phone: v.string(),
      notes: v.string()
    })
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    return await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      total: args.total,
      paymentMethod: args.paymentMethod,
      paymentStatus: args.paymentStatus,
      paymentDetails: args.paymentDetails,
      createdAt: Date.now()
    });
  }
});

export const createStripe = mutation({
  args: {
    userId: v.string(),
    items: orderItems,
    total: v.number(),
    currency: v.string(),
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first();
    if (existing) {
      return existing._id;
    }
    const order = {
      userId: args.userId,
      items: args.items,
      total: args.total,
      currency: args.currency,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      stripeSessionId: args.stripeSessionId,
      paymentDetails: {
        payerName: "",
        phone: "",
        notes: ""
      },
      createdAt: Date.now()
      ...(args.stripePaymentIntentId
        ? { stripePaymentIntentId: args.stripePaymentIntentId }
        : {})
    };
    return await ctx.db.insert("orders", order);
  }
});

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  }
});

export const getByStripeSessionId = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx);
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.sessionId))
      .first();
    if (!order || order.userId !== userId) {
      throw new Error("Not found");
    }
    return order;
  }
});

export const finalizeStripeSession = internalMutation({
  args: {
    sessionId: v.string(),
    paymentStatus: v.string(),
    stripePaymentIntentId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.sessionId))
      .first();
    if (!order) {
      return null;
    }
    if (order.paymentStatus === "paid") {
      return order._id;
    }
    const patch = {
      paymentStatus: args.paymentStatus,
      ...(args.stripePaymentIntentId
        ? { stripePaymentIntentId: args.stripePaymentIntentId }
        : {})
    };
    await ctx.db.patch(order._id, patch);
    if (args.paymentStatus === "paid") {
      for (const item of order.items) {
        const course = await ctx.db.get(item.courseId as any);
        if (!course) continue;
        const existing = await ctx.db
          .query("enrollments")
          .withIndex("by_userId", (q) => q.eq("userId", order.userId))
          .filter((q) => q.eq(q.field("courseId"), course._id))
          .first();
        if (!existing) {
          await ctx.db.insert("enrollments", {
            userId: order.userId,
            courseId: course._id,
            teacherId: course.teacherId,
            status: "active",
            createdAt: Date.now()
          });
        }
      }
      const cart = await ctx.db
        .query("carts")
        .withIndex("by_userId", (q) => q.eq("userId", order.userId))
        .first();
      if (cart) {
        await ctx.db.patch(cart._id, {
          items: [],
          updatedAt: Date.now()
        });
      }
    }
    return order._id;
  }
});
