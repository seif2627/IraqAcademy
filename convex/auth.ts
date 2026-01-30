export const allowPublicRead = () => true;

const normalizeSubject = (subject: string | null | undefined) => {
  if (!subject) return "";
  const parts = subject.split("|");
  return parts[parts.length - 1] || subject;
};

export const requireAuth = async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  const subject = normalizeSubject(identity?.subject);
  if (!subject) {
    throw new Error("Unauthorized");
  }
  const userId = subject;
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return { userId, user };
};

export const requireRole = async (ctx, roles) => {
  const { user } = await requireAuth(ctx);
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
};

export const requireSelf = async (ctx, userId) => {
  const identity = await ctx.auth.getUserIdentity();
  const subject = normalizeSubject(identity?.subject);
  if (!subject) {
    throw new Error("Unauthorized");
  }
  if (subject !== userId) {
    throw new Error("Forbidden");
  }
  return subject;
};
