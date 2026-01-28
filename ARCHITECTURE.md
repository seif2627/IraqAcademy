# IraqAcademy Architecture

## Overview
IraqAcademy is a static frontend served by Cloudflare Pages with a Convex backend. Firebase Authentication issues ID tokens that the frontend forwards to Convex for authorization. Stripe Checkout is used for payments; a webhook finalizes orders and creates enrollments. Email notifications are sent server-side after enrollments are created.

## System Flow
```
Frontend (HTML/CSS/JS)
  -> Firebase Auth (ID token)
  -> Convex client (queries/mutations/actions)
  -> Convex DB

Payments:
Frontend -> Convex action -> Stripe Checkout
Stripe webhook -> Convex internal mutation -> orders + enrollments + emails
```

## Key Directories
- `pages/`: page-level HTML loaded in an iframe shell
- `assets/`: frontend JS/CSS, config, and shared helpers
- `convex/`: schema, queries, mutations, actions, and webhook handlers

## Data Models (Convex)
- `users`: userId, email, role, metadata
- `profiles`: userId, name, imageUrl, contact fields
- `teachers`: userId, name, subject, bio, imageUrl
- `courses`: teacherId, title, description, category, status, price, imageUrl
- `carts`: userId, courseIds/items
- `orders`: userId, status, amount, currency, stripe session/payment ids
- `enrollments`: userId, courseId, teacherId, status
- `paymentProfiles`: userId, payerName, phone, notes

## Auth & Roles
- Firebase handles identity only.
- Convex enforces authorization via `ctx.auth.getUserIdentity()`.
- Role rules:
  - Owner: full access
  - Admin: manage users/teachers/courses/enrollments
  - Teacher: manage own profile/courses
  - Student: browse, manage profile, checkout/enroll

## Payments
- `convex/payments.ts` creates Stripe Checkout sessions (server-validated cart).
- `convex/http.ts` exposes `/stripe/webhook`.
- `convex/orders.ts` finalizes payments idempotently and creates enrollments.

## Email Notifications
- `convex/emails.ts` sends confirmation and notification emails via SMTP.
- Triggered only after order finalization to ensure idempotency.

## Environment Variables (Convex)
- `APP_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY` (optional)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `SMTP_FROM_NAME` (optional), `SMTP_SECURE` (optional)
