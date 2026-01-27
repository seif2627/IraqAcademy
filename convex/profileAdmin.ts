import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./auth";

export const listProfiles = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["owner", "admin"]);
    return await ctx.db.query("profiles").order("desc").collect();
  }
});

export const getProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["owner", "admin"]);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return profile || null;
  }
});

export const setProfileByUserId = mutation({
  args: {
    userId: v.string(),
    fullName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    governorate: v.string(),
    idNumber: v.string(),
    birthDate: v.string(),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["owner", "admin"]);
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
        imageUrl: args.imageUrl,
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
      imageUrl: args.imageUrl,
      updatedAt: Date.now()
    });
  }
});
