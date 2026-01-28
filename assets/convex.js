import { ConvexClient } from "https://unpkg.com/convex@1.31.6/dist/esm/browser/index.js";

const CONVEX_URL = window.IA_CONFIG?.convexUrl || "";
const root = window.top || window;
const isTopWindow = root === window;

const ensurePromise = (key, resolverKey) => {
  if (!root[key]) {
    let resolve;
    root[key] = new Promise((res) => {
      resolve = res;
    });
    root[resolverKey] = resolve;
  }
};

const resolvePromiseOnce = (key, resolverKey, flagKey) => {
  if (root[flagKey]) return;
  root[flagKey] = true;
  if (typeof root[resolverKey] === "function") {
    root[resolverKey]();
  }
};

const getExistingClient = () => root.__iaConvexClient || root.convexClient || null;

const attachToTopClient = () => {
  const existing = getExistingClient();
  if (!existing) return false;
  window.convexClient = existing;
  resolvePromiseOnce("iaConvexReady", "__resolveIaConvexReady", "__iaConvexReadyResolved");
  return true;
};

if (!CONVEX_URL) {
  window.convexClient = null;
} else if (attachToTopClient()) {
  // Already initialized in the top window.
} else if (!isTopWindow) {
  // Never create a new client inside iframes; wait for the top window instead.
  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (attachToTopClient() || attempts > 200) {
      clearInterval(timer);
    }
  }, 50);
} else {
  ensurePromise("iaAuthReady", "__resolveIaAuthReady");
  ensurePromise("iaConvexReady", "__resolveIaConvexReady");

  const client = new ConvexClient(CONVEX_URL);
  root.__iaConvexClient = client;
  root.convexClient = client;
  window.convexClient = client;
  resolvePromiseOnce("iaConvexReady", "__resolveIaConvexReady", "__iaConvexReadyResolved");

  const getAuthToken = async () => {
    if (root.iaAuthReady) {
      try {
        await root.iaAuthReady;
      } catch (error) {
        // ignore auth readiness failures
      }
    }
    const auth = root.firebaseAuth?.auth;
    if (!auth || !auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      return null;
    }
  };

  if (typeof client.setAuth === "function") {
    client.setAuth(getAuthToken, () => {});
  }

  const attachAuthListener = () => {
    const fb = root.firebaseAuth;
    if (!fb?.onAuthStateChanged || !fb?.auth) return false;
    fb.onAuthStateChanged(fb.auth, () => {
      resolvePromiseOnce("iaAuthReady", "__resolveIaAuthReady", "__iaAuthReadyResolved");
    });
    return true;
  };

  if (!attachAuthListener()) {
    let attempts = 0;
    const authTimer = setInterval(() => {
      attempts += 1;
      if (attachAuthListener() || attempts > 200) {
        clearInterval(authTimer);
      }
    }, 50);
  }

  // Ensure auth readiness unblocks even if listeners never fire.
  setTimeout(() => {
    resolvePromiseOnce("iaAuthReady", "__resolveIaAuthReady", "__iaAuthReadyResolved");
  }, 5000);
}
