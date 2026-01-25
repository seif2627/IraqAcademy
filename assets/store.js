const CART_KEY = "ia_cart";
const PAYMENT_KEY = "ia_payment";
const ORDERS_KEY = "ia_orders";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
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

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.courseId && item.title)
    .map((item) => ({
      courseId: String(item.courseId),
      title: String(item.title),
      price: Number(item.price || 0),
      qty: Number(item.qty || 1)
    }));
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
    existing.qty += 1;
  } else {
    items.push({ ...course, qty: 1 });
  }
  return await saveCart(items);
};

const removeFromCart = async (courseId) => {
  const cart = await getCart();
  const items = cart.items
    .map((item) => item.courseId === courseId ? { ...item, qty: item.qty - 1 } : item)
    .filter((item) => item.qty > 0);
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
  const profiles = readLocal(PAYMENT_KEY, {});
  return profiles[userId] || null;
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
      const profiles = readLocal(PAYMENT_KEY, {});
      profiles[userId] = data;
      writeLocal(PAYMENT_KEY, profiles);
      return data;
    }
  }
  const profiles = readLocal(PAYMENT_KEY, {});
  profiles[userId] = data;
  writeLocal(PAYMENT_KEY, profiles);
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

const saveOrderLocal = async (userId, order) => {
  const orders = readLocal(ORDERS_KEY, {});
  orders[userId] = orders[userId] || [];
  orders[userId].unshift(order);
  writeLocal(ORDERS_KEY, orders);
  return order;
};

const checkout = async (payload) => {
  const userId = await getUserId();
  const convex = getConvex();
  const order = {
    userId,
    items: normalizeItems(payload.items || []),
    total: Number(payload.total || 0),
    paymentMethod: payload.paymentMethod || "bank_transfer",
    paymentStatus: "pending",
    paymentDetails: {
      payerName: payload.payerName || "",
      phone: payload.phone || "",
      notes: payload.notes || ""
    },
    createdAt: Date.now()
  };
  if (convex) {
    try {
      await convex.mutation("orders:create", {
        userId: order.userId,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentDetails: order.paymentDetails
      });
      await clearCart();
      return order;
    } catch (error) {
      await saveOrderLocal(userId, order);
      await clearCart();
      return order;
    }
  }
  await saveOrderLocal(userId, order);
  await clearCart();
  return order;
};

const syncUser = async (user) => {
  if (!user) return;
  const convex = getConvex();
  if (!convex) return;
  const role = user.user_metadata?.role || "student";
  const fullName = user.user_metadata?.full_name || "";
  try {
    await convex.mutation("users:upsert", {
      userId: user.id,
      email: user.email || "",
      fullName,
      role
    });
  } catch (error) {
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
  checkout,
  syncUser
};
