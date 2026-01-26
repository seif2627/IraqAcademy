import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const cartItems = v.array(
  v.object({
    courseId: v.string(),
    title: v.string(),
    price: v.number(),
    qty: v.number()
  })
);

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return cart ? { items: cart.items } : { items: [] };
  }
});

export const set = mutation({
  args: {
    userId: v.string(),
    items: cartItems
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        items: args.items,
        updatedAt: Date.now()
      });
      return existing._id;
    }
    return await ctx.db.insert("carts", {
      userId: args.userId,
      items: args.items,
      updatedAt: Date.now()
    });
  }
});

export const clear = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        items: [],
        updatedAt: Date.now()
      });
    }
    return true;
  }
});
