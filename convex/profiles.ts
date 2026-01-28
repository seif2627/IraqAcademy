import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireSelf } from "./auth";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
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
          birthDate: profile.birthDate,
          imageUrl: profile.imageUrl
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
    birthDate: v.string(),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    const fullName = args.fullName.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    if (nameParts.length < 3) {
      throw new Error("Full legal name is required.");
    }
    if (!args.phone.trim()) {
      throw new Error("Phone number is required.");
    }
    if (!args.birthDate.trim()) {
      throw new Error("Date of birth is required.");
    }
    if (!args.idNumber.trim()) {
      throw new Error("Government ID number is required.");
    }
    if (!args.address.trim()) {
      throw new Error("Full address is required.");
    }
    if (!args.city.trim()) {
      throw new Error("City is required.");
    }
    if (!args.governorate.trim()) {
      throw new Error("Governorate is required.");
    }
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
