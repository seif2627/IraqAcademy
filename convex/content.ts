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

export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTeachers = await ctx.db.query("teachers").take(1);
    if (existingTeachers.length === 0) {
      for (const teacher of seedTeachers) {
        await ctx.db.insert("teachers", {
            name: teacher.name,
            subject: teacher.subject,
            imageUrl: teacher.photo,
            bio: "Experienced educator in " + teacher.subject,
            gender: "unknown"
        });
      }
    }

    const existingCourses = await ctx.db.query("courses").take(1);
    if (existingCourses.length === 0) {
        for (const course of seedCourses) {
            await ctx.db.insert("courses", {
                title: course.title,
                grade: course.grade,
                teacherName: course.teacherName,
                price: course.price,
                description: course.description,
                status: "Available Now",
                type: "Course"
            });
        }
    }
  },
});
