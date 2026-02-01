import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole, requireSelf } from "./auth";

export const enroll = mutation({
  args: {
    userId: v.string(),
    courseId: v.id("courses"),
    status: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Not found");
    }
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .first();
    if (existing) {
      return existing._id;
    }
    const id = await ctx.db.insert("enrollments", {
      userId: args.userId,
      courseId: args.courseId,
      teacherId: course.teacherId,
      status: args.status ?? "active",
      createdAt: Date.now()
    });
    console.warn("[enrollments:enroll]", {
      actorId: args.userId,
      courseId: args.courseId,
      enrollmentId: id
    });
    return id;
  }
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    return await ctx.db
      .query("enrollments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  }
});

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Not found");
    }
    const teacher = await ctx.db.get(course.teacherId);
    if (!teacher) {
      throw new Error("Not found");
    }
    const isOwnerOrAdmin = user.role === "owner" || user.role === "admin";
    const isTeacherOwner = user.role === "teacher" && teacher.userId === userId;
    if (!isOwnerOrAdmin && !isTeacherOwner) {
      throw new Error("Forbidden");
    }
    return await ctx.db
      .query("enrollments")
      .withIndex("by_courseId", (q) => q.eq("courseId", args.courseId))
      .order("desc")
      .collect();
  }
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["owner", "admin"]);
    return await ctx.db.query("enrollments").order("desc").collect();
  }
});
