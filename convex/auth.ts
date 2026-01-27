export const allowPublicRead = () => true;

export const requireAuth = async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.subject) {
    throw new Error("Unauthorized");
  }
  const userId = identity.subject;
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
  const { userId: authUserId } = await requireAuth(ctx);
  if (authUserId !== userId) {
    throw new Error("Forbidden");
  }
  return authUserId;
};
