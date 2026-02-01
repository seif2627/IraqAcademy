const CART_KEY = "ia_cart";
const PAYMENT_KEY = "ia_payment";
const ORDERS_KEY = "ia_orders";
const PROFILE_KEY = "ia_profile";
let checkoutInProgress = false;
const transientProfiles = {};
const transientPayments = {};

const clearSensitiveLocal = () => {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PAYMENT_KEY);
  } catch (error) {
    // ignore storage failures
  }
};

clearSensitiveLocal();

const safeParse = (value, fallback) => {
  if (value === null || value === undefined || value === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
};

const readLocal = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const writeLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getSession = async () => {
  const client = window.top?.authClient || window.authClient;
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  return session || null;
};

const getUserId = async () => {
  const session = await getSession();
  return session?.user?.id || "guest";
};

const getConvex = () => window.top?.convexClient || window.convexClient || null;

const waitForAuthToken = async (timeoutMs = 5000) => {
  const root = window.top || window;
  const auth = root.firebaseAuth?.auth;
  if (!auth) return null;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (auth.currentUser?.getIdToken) {
      try {
        const token = await auth.currentUser.getIdToken();
        if (token) return token;
      } catch (error) {
        // ignore token errors
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return null;
};

const waitForConvexAuth = async (timeoutMs = 3000) => {
  const root = window.top || window;
  if (!root.iaConvexAuthReady) return;
  try {
    await Promise.race([
      root.iaConvexAuthReady,
      new Promise((resolve) => setTimeout(resolve, timeoutMs))
    ]);
  } catch (error) {
    // ignore auth readiness failures
  }
};

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  const normalized = new Map();
  items
    .filter((item) => item && item.courseId && item.title)
    .forEach((item) => {
      const courseId = String(item.courseId);
      if (normalized.has(courseId)) return;
      normalized.set(courseId, {
        courseId,
        title: String(item.title),
        price: Number(item.price || 0),
        qty: 1
      });
    });
  return Array.from(normalized.values());
};

const getCartLocal = async (userId) => {
  const carts = readLocal(CART_KEY, {});
  return { items: normalizeItems(carts[userId] || []) };
};

const setCartLocal = async (userId, items) => {
  const carts = readLocal(CART_KEY, {});
  carts[userId] = normalizeItems(items);
  writeLocal(CART_KEY, carts);
  return { items: carts[userId] };
};

const getCart = async () => {
  const userId = await getUserId();
  const convex = getConvex();
  if (convex) {
    try {
      const result = await convex.query("carts:get", { userId });
      return { userId, items: normalizeItems(result?.items || []) };
    } catch (error) {
      const local = await getCartLocal(userId);
      return { userId, items: local.items };
    }
  }
  const local = await getCartLocal(userId);
  return { userId, items: local.items };
};

const saveCart = async (items) => {
  const userId = await getUserId();
  const convex = getConvex();
  const normalized = normalizeItems(items);
  if (convex) {
    try {
      await convex.mutation("carts:set", { userId, items: normalized });
      return { userId, items: normalized };
    } catch (error) {
      await setCartLocal(userId, normalized);
      return { userId, items: normalized };
    }
  }
  await setCartLocal(userId, normalized);
  return { userId, items: normalized };
};

const addToCart = async (course) => {
  const cart = await getCart();
  const items = [...cart.items];
  const existing = items.find((item) => item.courseId === course.courseId);
  if (existing) {
    return { userId: cart.userId, items };
  }
  items.push({ ...course, qty: 1 });
  return await saveCart(items);
};

const removeFromCart = async (courseId) => {
  const cart = await getCart();
  const items = cart.items.filter((item) => item.courseId !== courseId);
  return await saveCart(items);
};

const clearCart = async () => {
  const userId = await getUserId();
  const convex = getConvex();
  if (convex) {
    try {
      await convex.mutation("carts:clear", { userId });
      return { userId, items: [] };
    } catch (error) {
      await setCartLocal(userId, []);
      return { userId, items: [] };
    }
  }
  await setCartLocal(userId, []);
  return { userId, items: [] };
};

const getPaymentProfileLocal = async (userId) => {
  return transientPayments[userId] || null;
};

const savePaymentProfile = async (profile) => {
  const userId = await getUserId();
  const data = {
    payerName: profile.payerName || "",
    phone: profile.phone || "",
    notes: profile.notes || ""
  };
  const convex = getConvex();
  if (convex) {
    try {
      await convex.mutation("payments:setProfile", { userId, ...data });
      return data;
    } catch (error) {
      transientPayments[userId] = data;
      return data;
    }
  }
  transientPayments[userId] = data;
  return data;
};

const getPaymentProfile = async () => {
  const userId = await getUserId();
  const convex = getConvex();
  if (convex) {
    try {
      return await convex.query("payments:getProfile", { userId });
    } catch (error) {
      return await getPaymentProfileLocal(userId);
    }
  }
  return await getPaymentProfileLocal(userId);
};

const getProfileLocal = async (userId) => {
  return transientProfiles[userId] || null;
};

const saveProfile = async (profile) => {
  const userId = await getUserId();
  const data = {
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    governorate: profile.governorate || "",
    idNumber: profile.idNumber || "",
    birthDate: profile.birthDate || ""
  };
  const convex = getConvex();
  if (convex) {
    try {
      await convex.mutation("profiles:set", { userId, ...data });
      return data;
    } catch (error) {
      transientProfiles[userId] = data;
      return data;
    }
  }
  transientProfiles[userId] = data;
  return data;
};

const getProfile = async () => {
  const userId = await getUserId();
  const convex = getConvex();
  if (convex) {
    try {
      return await convex.query("profiles:get", { userId });
    } catch (error) {
      return await getProfileLocal(userId);
    }
  }
  return await getProfileLocal(userId);
};

const saveOrderLocal = async (userId, order) => {
  const orders = readLocal(ORDERS_KEY, {});
  orders[userId] = orders[userId] || [];
  orders[userId].unshift(order);
  writeLocal(ORDERS_KEY, orders);
  return order;
};

const checkout = async (payload) => {
  if (checkoutInProgress) {
    throw new Error("Checkout already in progress");
  }
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Login required");
  }
  const convex = getConvex();
  if (!convex || typeof convex.action !== "function") {
    throw new Error("Payments unavailable");
  }
  checkoutInProgress = true;
  try {
    const origin = window.top?.location?.origin || window.location.origin;
    const successUrl = `${origin}/courses?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/courses?checkout=cancel`;
    const result = await convex.action("payments:createCheckoutSession", {
      successUrl,
      cancelUrl
    });
    if (!result?.checkoutUrl) {
      throw new Error("Unable to start checkout");
    }
    return result;
  } finally {
    checkoutInProgress = false;
  }
};

const syncUser = async (user) => {
  if (!user) return;
  const convex = getConvex();
  if (!convex) return;
  const token = await waitForAuthToken();
  if (!token) {
    setTimeout(() => syncUser(user), 500);
    return;
  }
  await waitForConvexAuth();
  if (convex?.getAuth && !convex.getAuth()) {
    setTimeout(() => syncUser(user), 500);
    return;
  }
  let role = user.user_metadata?.role || "student";
  const fullName = user.user_metadata?.full_name || "";
  try {
    if (user.id) {
      try {
        const existing = await convex.query("users:getByUserId", { userId: user.id });
        if (existing?.role && role === "student") {
          role = existing.role;
        }
      } catch (error) {
        console.warn("[syncUser] role lookup failed", { userId: user.id });
      }
    }
    await convex.mutation("users:upsert", {
      userId: user.id,
      email: user.email || "",
      fullName,
      role
    });
  } catch (error) {
    console.warn("[syncUser] failed", { userId: user.id });
    return;
  }
};

window.iaStore = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  savePaymentProfile,
  getPaymentProfile,
  saveProfile,
  getProfile,
  checkout,
  syncUser
};
