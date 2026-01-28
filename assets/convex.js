import { ConvexClient } from "https://unpkg.com/convex@1.31.6/dist/esm/browser/index.js";

const CONVEX_URL = window.IA_CONFIG?.convexUrl || "";

if (CONVEX_URL) {
  const client = new ConvexClient(CONVEX_URL);

  const getAuthToken = async () => {
    const auth = window.firebaseAuth?.auth;
    if (!auth || !auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      return null;
    }
  };

  const applyAuth = () => {
    if (typeof client.setAuth === "function") {
      client.setAuth(getAuthToken, () => {});
    }
  };

  applyAuth();

  if (window.firebaseAuth?.onAuthStateChanged && window.firebaseAuth?.auth) {
    window.firebaseAuth.onAuthStateChanged(window.firebaseAuth.auth, () => {
      applyAuth();
    });
  }

  window.convexClient = client;
  if (window.top) {
    window.top.convexClient = client;
  }
} else {
  window.convexClient = null;
}
