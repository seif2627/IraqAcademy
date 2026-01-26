import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return profile
      ? {
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          governorate: profile.governorate,
          idNumber: profile.idNumber,
          birthDate: profile.birthDate
        }
      : null;
  }
});

export const set = mutation({
  args: {
    userId: v.string(),
    fullName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    governorate: v.string(),
    idNumber: v.string(),
    birthDate: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        fullName: args.fullName,
        phone: args.phone,
        address: args.address,
        city: args.city,
        governorate: args.governorate,
        idNumber: args.idNumber,
        birthDate: args.birthDate,
        updatedAt: Date.now()
      });
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      userId: args.userId,
      fullName: args.fullName,
      phone: args.phone,
      address: args.address,
      city: args.city,
      governorate: args.governorate,
      idNumber: args.idNumber,
      birthDate: args.birthDate,
      updatedAt: Date.now()
    });
  }
});
