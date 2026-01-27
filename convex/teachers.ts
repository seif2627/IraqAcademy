import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

const canManageTeacher = (userRole, userId, teacher) => {
  if (userRole === "admin" || userRole === "owner") return true;
  if (userRole === "teacher" && teacher.userId === userId) return true;
  return false;
};

export const getOwn = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx);
    return await ctx.db
      .query("teachers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    bio: v.optional(v.string()),
    gender: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    if (!["admin", "owner", "teacher"].includes(user.role)) {
      throw new Error("Forbidden");
    }
    const existing = await ctx.db
      .query("teachers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existing && user.role === "teacher") {
      throw new Error("Forbidden");
    }
    const now = Date.now();
    return await ctx.db.insert("teachers", {
      userId,
      name: args.name,
      subject: args.subject,
      bio: args.bio,
      gender: args.gender,
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("teachers"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    bio: v.optional(v.string()),
    gender: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Not found");
    }
    if (!canManageTeacher(user.role, userId, teacher)) {
      throw new Error("Forbidden");
    }
    const updates = {
      name: args.name ?? teacher.name,
      subject: args.subject ?? teacher.subject,
      bio: args.bio ?? teacher.bio,
      gender: args.gender ?? teacher.gender,
      imageUrl: args.imageUrl ?? teacher.imageUrl,
      updatedAt: Date.now()
    };
    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Not found");
    }
    if (!canManageTeacher(user.role, userId, teacher)) {
      throw new Error("Forbidden");
    }
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", teacher._id))
      .collect();
    for (const course of courses) {
      await ctx.db.delete(course._id);
    }
    await ctx.db.delete(args.id);
    return true;
  },
});
