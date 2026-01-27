import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { seedTeachers, seedCourses } from "./seedData";

export const getTeachers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect();
  },
});

export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const resetContent = mutation({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query("teachers").collect();
    for (const t of teachers) {
      await ctx.db.delete(t._id);
    }

    const courses = await ctx.db.query("courses").collect();
    for (const c of courses) {
      await ctx.db.delete(c._id);
    }

    for (const teacher of seedTeachers) {
      await ctx.db.insert("teachers", {
          name: teacher.name,
          subject: teacher.subject,
          imageUrl: teacher.photo,
          bio: teacher.bio,
          gender: "unknown"
      });
    }

    for (const course of seedCourses) {
      await ctx.db.insert("courses", {
          title: course.title,
          grade: course.grade,
          teacherName: course.teacherName,
          price: course.price,
          description: course.description,
          subtitle: course.subtitle,
          category: course.category,
          status: course.status,
          type: course.type,
          imageUrl: course.imageUrl
      });
    }
    
    return "Content reset successfully with new seed data";
  },
});
