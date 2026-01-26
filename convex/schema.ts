import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: v.string(),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),
  carts: defineTable({
    userId: v.string(),
    items: v.array(
      v.object({
        courseId: v.string(),
        title: v.string(),
        price: v.number(),
        qty: v.number()
      })
    ),
    updatedAt: v.number()
  }).index("by_userId", ["userId"]),
  orders: defineTable({
    userId: v.string(),
    items: v.array(
      v.object({
        courseId: v.string(),
        title: v.string(),
        price: v.number(),
        qty: v.number()
      })
    ),
    total: v.number(),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    paymentDetails: v.object({
      payerName: v.string(),
      phone: v.string(),
      notes: v.string()
    }),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),
  paymentProfiles: defineTable({
    userId: v.string(),
    payerName: v.string(),
    phone: v.string(),
    notes: v.string(),
    updatedAt: v.number()
  }).index("by_userId", ["userId"]),
  profiles: defineTable({
    userId: v.string(),
    fullName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    governorate: v.string(),
    idNumber: v.string(),
    birthDate: v.string(),
    updatedAt: v.number()
  }).index("by_userId", ["userId"]),
  teachers: defineTable({
    name: v.string(),
    subject: v.string(),
    bio: v.optional(v.string()),
    gender: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }),
  courses: defineTable({
    title: v.string(),
    grade: v.optional(v.string()),
    teacherName: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  })
});
