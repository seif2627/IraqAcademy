import { ConvexHttpClient } from "https://unpkg.com/convex@1.31.6/dist/esm/browser/index.js";

const ENV = window.ENV || window.top?.ENV || {};
const CONVEX_URL = ENV.CONVEX_URL || ENV.PUBLIC_CONVEX_URL || "";

if (CONVEX_URL) {
  const client = new ConvexHttpClient(CONVEX_URL);
  window.convexClient = client;
  if (window.top) {
    window.top.convexClient = client;
  }
} else {
  window.convexClient = null;
}
