import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./auth";

const canManageCourse = (userRole, userId, teacher) => {
  if (userRole === "admin" || userRole === "owner") return true;
  if (userRole === "teacher" && teacher.userId === userId) return true;
  return false;
};

export const create = mutation({
  args: {
    teacherId: v.id("teachers"),
    title: v.string(),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    grade: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    if (!["admin", "owner", "teacher"].includes(user.role)) {
      throw new Error("Forbidden");
    }
    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher) {
      throw new Error("Not found");
    }
    if (!canManageCourse(user.role, userId, teacher)) {
      throw new Error("Forbidden");
    }
    const now = Date.now();
    const id = await ctx.db.insert("courses", {
      teacherId: args.teacherId,
      title: args.title,
      subtitle: args.subtitle,
      description: args.description,
      category: args.category,
      type: args.type,
      status: args.status,
      grade: args.grade,
      teacherName: teacher.name,
      price: args.price,
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now
    });
    console.warn("[courses:create]", { actorId: userId, courseId: id, teacherId: args.teacherId });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("courses"),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    grade: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Not found");
    }
    const teacher = await ctx.db.get(course.teacherId);
    if (!teacher) {
      throw new Error("Not found");
    }
    if (!canManageCourse(user.role, userId, teacher)) {
      throw new Error("Forbidden");
    }
    const updates = {
      title: args.title ?? course.title,
      subtitle: args.subtitle ?? course.subtitle,
      description: args.description ?? course.description,
      category: args.category ?? course.category,
      type: args.type ?? course.type,
      status: args.status ?? course.status,
      grade: args.grade ?? course.grade,
      teacherName: teacher.name,
      price: args.price ?? course.price,
      imageUrl: args.imageUrl ?? course.imageUrl,
      updatedAt: Date.now()
    };
    await ctx.db.patch(args.id, updates);
    console.warn("[courses:update]", { actorId: userId, courseId: args.id });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const { userId, user } = await requireAuth(ctx);
    const course = await ctx.db.get(args.id);
    if (!course) {
      throw new Error("Not found");
    }
    const teacher = await ctx.db.get(course.teacherId);
    if (!teacher) {
      throw new Error("Not found");
    }
    if (!canManageCourse(user.role, userId, teacher)) {
      throw new Error("Forbidden");
    }
    await ctx.db.delete(args.id);
    console.warn("[courses:remove]", { actorId: userId, courseId: args.id });
    return true;
  },
});
