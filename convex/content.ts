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
    // Delete all existing teachers
    const teachers = await ctx.db.query("teachers").collect();
    for (const t of teachers) {
      await ctx.db.delete(t._id);
    }

    // Delete all existing courses
    const courses = await ctx.db.query("courses").collect();
    for (const c of courses) {
      await ctx.db.delete(c._id);
    }

    // Insert new teachers
    for (const teacher of seedTeachers) {
      await ctx.db.insert("teachers", {
          name: teacher.name,
          subject: teacher.subject,
          imageUrl: teacher.photo,
          bio: teacher.bio || ("Experienced educator in " + teacher.subject),
          gender: "unknown"
      });
    }

    // Insert new courses
    for (const course of seedCourses) {
      await ctx.db.insert("courses", {
          title: course.title,
          grade: course.grade,
          teacherName: course.teacherName,
          price: course.price,
          description: course.description,
          status: "Available Now",
          type: "Course",
          imageUrl: course.imageUrl
      });
    }
    
    return "Content reset successfully with new seed data";
  },
});
