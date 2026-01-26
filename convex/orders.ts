import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  }
});
