import { action, httpAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { requireSelf } from "./auth";
import crypto from "crypto";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    const profile = await ctx.db
      .query("paymentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return profile
      ? {
          payerName: profile.payerName,
          phone: profile.phone,
          notes: profile.notes
        }
      : null;
  }
});

export const setProfile = mutation({
  args: {
    userId: v.string(),
    payerName: v.string(),
    phone: v.string(),
    notes: v.string()
  },
  handler: async (ctx, args) => {
    await requireSelf(ctx, args.userId);
    const existing = await ctx.db
      .query("paymentProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        payerName: args.payerName,
        phone: args.phone,
        notes: args.notes,
        updatedAt: Date.now()
      });
      return existing._id;
    }
    return await ctx.db.insert("paymentProfiles", {
      userId: args.userId,
      payerName: args.payerName,
      phone: args.phone,
      notes: args.notes,
      updatedAt: Date.now()
    });
  }
});

const getStripeSecret = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Stripe secret key not configured");
  }
  return secret;
};

const getStripeCurrency = () => {
  return (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
};

const getAllowedOrigin = () => {
  const baseUrl = process.env.APP_BASE_URL;
  if (!baseUrl) {
    throw new Error("APP_BASE_URL not configured");
  }
  return new URL(baseUrl).origin;
};

const ensureAllowedOrigin = (url, allowedOrigin) => {
  const parsed = new URL(url);
  if (parsed.origin !== allowedOrigin) {
    throw new Error("Invalid return URL");
  }
};

const buildCartSignature = (items) => {
  const normalized = items
    .map((item) => ({
      courseId: String(item.courseId)
    }))
    .sort((a, b) => a.courseId.localeCompare(b.courseId));
  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
};

const addLineItemParams = (params, index, item, currency) => {
  params.set(`line_items[${index}][price_data][currency]`, currency);
  params.set(`line_items[${index}][price_data][product_data][name]`, item.title);
  params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
  params.set(`line_items[${index}][quantity]`, String(item.quantity));
};

export const createCheckoutSession = action({
  args: {
    successUrl: v.string(),
    cancelUrl: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;
    const user = await ctx.runQuery(api.users.getByUserId, { userId });
    if (!user) {
      throw new Error("Unauthorized");
    }
    if (user.role !== "student") {
      throw new Error("Forbidden");
    }

    const cart = await ctx.runQuery(api.carts.get, { userId });
    if (!cart?.items?.length) {
      throw new Error("Cart is empty");
    }

    const allowedOrigin = getAllowedOrigin();
    if (!args.successUrl.includes("{CHECKOUT_SESSION_ID}")) {
      throw new Error("Invalid success URL");
    }
    ensureAllowedOrigin(args.successUrl, allowedOrigin);
    ensureAllowedOrigin(args.cancelUrl, allowedOrigin);

    const courses = await ctx.runQuery(api.content.getCourses, {});
    const courseById = new Map(courses.map((course) => [String(course._id), course]));

    const lineItems = [];
    let total = 0;
    for (const item of cart.items) {
      const course = courseById.get(String(item.courseId));
      if (!course) {
        throw new Error("Course not found");
      }
      const price = Number(course.price || 0);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Invalid course price");
      }
      const unitAmount = Math.round(price * 100);
      const quantity = 1;
      total += price * quantity;
      lineItems.push({
        title: course.title,
        unitAmount,
        quantity,
        courseId: String(course._id),
        price
      });
    }

    if (!lineItems.length) {
      throw new Error("Cart is empty");
    }

    const cartSignature = buildCartSignature(cart.items);
    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${userId}:${cartSignature}`)
      .digest("hex");

    const params = new URLSearchParams();
    const currency = getStripeCurrency();
    params.set("mode", "payment");
    params.set("success_url", args.successUrl);
    params.set("cancel_url", args.cancelUrl);
    params.set("client_reference_id", userId);
    if (user.email) {
      params.set("customer_email", user.email);
    }
    params.set("metadata[userId]", userId);
    params.set("metadata[cartSignature]", cartSignature);

    lineItems.forEach((item, index) => {
      addLineItemParams(params, index, item, currency);
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getStripeSecret()}`,
        "Idempotency-Key": idempotencyKey,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const payload = await response.json();
    if (!response.ok) {
      const message = payload?.error?.message || "Unable to create checkout session";
      throw new Error(message);
    }

    const existing = await ctx.runQuery(api.orders.getByStripeSessionId, {
      sessionId: payload.id
    }).catch(() => null);
    if (!existing) {
      await ctx.runMutation(api.orders.createStripe, {
        userId,
        items: lineItems.map((item) => ({
          courseId: item.courseId,
          title: item.title,
          price: item.price,
          qty: item.quantity
        })),
        total,
        currency,
        stripeSessionId: payload.id,
        stripePaymentIntentId: payload.payment_intent || undefined
      });
    }

    return {
      checkoutUrl: payload.url,
      sessionId: payload.id
    };
  }
});

const verifyStripeSignature = (body, signatureHeader, secret) => {
  if (!signatureHeader) return false;
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));
  if (!timestamp || !signatures.length) return false;
  const signedPayload = `${timestamp}.${body}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return signatures.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch (error) {
      return false;
    }
  });
};

export const stripeWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const valid = verifyStripeSignature(body, signature, secret);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    return new Response("Invalid payload", { status: 400 });
  }

  const type = event?.type;
  const session = event?.data?.object;
  if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
    const sessionId = session?.id;
    if (sessionId) {
      await ctx.runMutation(api.orders.finalizeStripeSession, {
        sessionId,
        paymentStatus: "paid",
        stripePaymentIntentId: session?.payment_intent || undefined
      });
    }
  } else if (type === "checkout.session.expired") {
    const sessionId = session?.id;
    if (sessionId) {
      await ctx.runMutation(api.orders.finalizeStripeSession, {
        sessionId,
        paymentStatus: "expired",
        stripePaymentIntentId: session?.payment_intent || undefined
      });
    }
  } else if (type === "checkout.session.async_payment_failed") {
    const sessionId = session?.id;
    if (sessionId) {
      await ctx.runMutation(api.orders.finalizeStripeSession, {
        sessionId,
        paymentStatus: "failed",
        stripePaymentIntentId: session?.payment_intent || undefined
      });
    }
  }

  return new Response("ok", { status: 200 });
});
