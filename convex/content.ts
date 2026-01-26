import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    const teachers = await ctx.db.query("teachers").collect();
    if (teachers.length === 0) {
      await ctx.db.insert("teachers", { name: "Dr. Mohammed Al-Anzi", subject: "Biology", bio: "Extensive experience in simplifying concepts and preparing students for ministerial exams.", gender: "male" });
      await ctx.db.insert("teachers", { name: "Ms. Maryam Abbas", subject: "Arabic Language", bio: "Interactive curriculum with practical examples and regular evaluation exercises.", gender: "female" });
      await ctx.db.insert("teachers", { name: "Mr. Ahmed Al-Saadi", subject: "Mathematics", bio: "Specialist in explaining complex foundations in smooth and direct ways.", gender: "male" });
      await ctx.db.insert("teachers", { name: "Dr. Fatima Hassan", subject: "Chemistry", bio: "Focuses on practical experiments and connecting theory with reality.", gender: "female" });
      await ctx.db.insert("teachers", { name: "Mr. Ali Hussein", subject: "Physics", bio: "Creative explanation methods using modern technology and simulation.", gender: "male" });
      await ctx.db.insert("teachers", { name: "Ms. Zina Karim", subject: "English Language", bio: "Modern teaching methods focusing on conversation and comprehension.", gender: "female" });
    }

    const courses = await ctx.db.query("courses").collect();
    if (courses.length === 0) {
      await ctx.db.insert("courses", { title: "Free Course", subtitle: "6th Preparatory - Haider Kazem Al-Quraishi", category: "6th Preparatory", type: "Training Course", status: "Available Now" });
      await ctx.db.insert("courses", { title: "Experimental Course 2024", subtitle: "6th Preparatory - Haider Diwan", category: "6th Preparatory", type: "Training Course", status: "Available Now" });
      await ctx.db.insert("courses", { title: "Experimental Course", subtitle: "6th Preparatory - Professor Muhammad Al-Amri", category: "6th Preparatory", type: "Training Course", status: "Available Now" });
      await ctx.db.insert("courses", { title: "Experimental Course 2024", subtitle: "6th Preparatory - Professor Humam Al-Tamimi", category: "6th Preparatory", type: "Training Course", status: "Available Now" });
      await ctx.db.insert("courses", { title: "Experimental Course", subtitle: "6th Preparatory - Professor Haider Al-Haidari", category: "6th Preparatory", type: "Training Course", status: "Available Now" });
      await ctx.db.insert("courses", { title: "E-Business", subtitle: "Business Management", category: "General", type: "Training Course", status: "Available Now" });
    }
  },
});
