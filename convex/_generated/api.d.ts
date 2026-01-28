/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as carts from "../carts.js";
import type * as content from "../content.js";
import type * as courses from "../courses.js";
import type * as emails from "../emails.js";
import type * as enrollments from "../enrollments.js";
import type * as http from "../http.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as profileAdmin from "../profileAdmin.js";
import type * as profiles from "../profiles.js";
import type * as seedData from "../seedData.js";
import type * as teachers from "../teachers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  carts: typeof carts;
  content: typeof content;
  courses: typeof courses;
  emails: typeof emails;
  enrollments: typeof enrollments;
  http: typeof http;
  orders: typeof orders;
  payments: typeof payments;
  profileAdmin: typeof profileAdmin;
  profiles: typeof profiles;
  seedData: typeof seedData;
  teachers: typeof teachers;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
