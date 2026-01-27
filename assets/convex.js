import { ConvexHttpClient } from "https://unpkg.com/convex@1.31.6/dist/esm/browser/index.js";

const CONVEX_URL = window.IA_CONFIG?.convexUrl || "";

if (CONVEX_URL) {
  const client = new ConvexHttpClient(CONVEX_URL);
  window.convexClient = client;
  if (window.top) {
    window.top.convexClient = client;
  }
} else {
  window.convexClient = null;
}
