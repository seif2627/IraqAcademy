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
  }).index("by_userId", ["userId"])
});
