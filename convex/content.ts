import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { seedTeachers, seedCourses } from "./seedData";
import { allowPublicRead, requireRole, requireAuth } from "./auth";

export const getTeachers = query({
  args: {},
  handler: async (ctx) => {
    allowPublicRead();
    return await ctx.db.query("teachers").collect();
  },
});

export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    allowPublicRead();
    return await ctx.db.query("courses").collect();
  },
});

export const getTeachersPublic = query({
  args: {
    subject: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    allowPublicRead();
    const limit = Math.min(args.limit ?? 100, 200);
    let query = ctx.db.query("teachers");
    if (args.subject) {
      query = query.withIndex("by_subject", (q) => q.eq("subject", args.subject as string));
    } else {
      query = query.order("desc");
    }
    const results = await query.take(limit);
    if (args.search) {
      const term = args.search.toLowerCase();
      return results.filter((teacher) => teacher.name.toLowerCase().includes(term));
    }
    return results;
  },
});

export const getCoursesPublic = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    teacherId: v.optional(v.id("teachers")),
    search: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    allowPublicRead();
    const limit = Math.min(args.limit ?? 100, 200);
    let query = ctx.db.query("courses");
    if (args.teacherId) {
      query = query.withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId as any));
    } else if (args.category) {
      query = query.withIndex("by_category", (q) => q.eq("category", args.category as string));
    } else if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status as string));
    } else {
      query = query.order("desc");
    }
    const results = await query.take(limit);
    if (args.search) {
      const term = args.search.toLowerCase();
      return results.filter((course) => course.title.toLowerCase().includes(term));
    }
    return results;
  },
});

export const resetContent = mutation({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["owner", "admin"]);
    const teachers = await ctx.db.query("teachers").collect();
    for (const t of teachers) {
      await ctx.db.delete(t._id);
    }

    const courses = await ctx.db.query("courses").collect();
    for (const c of courses) {
      await ctx.db.delete(c._id);
    }

    const { userId } = await requireAuth(ctx);
    const now = Date.now();
    const teacherIdByName = new Map();
    for (const teacher of seedTeachers) {
      const teacherId = await ctx.db.insert("teachers", {
        userId,
        name: teacher.name,
        subject: teacher.subject,
        imageUrl: teacher.photo,
        bio: teacher.bio,
        gender: "unknown",
        createdAt: now,
        updatedAt: now
      });
      teacherIdByName.set(teacher.name, teacherId);
    }

    for (const course of seedCourses) {
      const teacherId = teacherIdByName.get(course.teacherName);
      if (!teacherId) continue;
      await ctx.db.insert("courses", {
        teacherId,
        title: course.title,
        grade: course.grade,
        teacherName: course.teacherName,
        price: course.price,
        description: course.description,
        subtitle: course.subtitle,
        category: course.category,
        status: course.status,
        type: course.type,
        imageUrl: course.imageUrl,
        createdAt: now,
        updatedAt: now
      });
    }
    
    return "Content reset successfully with new seed data";
  },
});
