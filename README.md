# IraqAcademy

IraqAcademy is a production-grade prototype for an educational SaaS platform. It provides role-based access for owners, admins, teachers, and students, with Firebase Authentication, a Convex backend, and a Stripe-based checkout flow that finalizes enrollments and triggers email notifications.

## GitHub Repository Description (Suggested)
Role-based learning platform prototype built with Cloudflare Pages, Firebase Auth, Convex backend, and Stripe Checkout.

## Tech Stack
- Frontend: Cloudflare Pages (static HTML/CSS/JS)
- Backend: Convex (database, queries, mutations, actions, webhooks)
- Auth: Firebase Authentication (email/password, Google, Microsoft)
- Payments: Stripe Checkout (test mode supported)
- Email: SMTP via Zoho (server-side only)

## Architecture (High Level)
```
Browser (HTML/CSS/JS)
  |-- Firebase Auth -> ID token
  |-- Convex (queries/mutations/actions) -> Convex DB

Payments:
Browser -> Convex action -> Stripe Checkout
Stripe webhook -> Convex internal mutation -> orders + enrollments + emails
```

## Authentication & Roles
- Firebase handles identity only.
- The frontend forwards Firebase ID tokens to Convex.
- Convex enforces authorization and roles server-side.

Roles:
- Owner: full access, cannot demote self or remove last owner
- Admin: manage users, teachers, courses, and enrollments
- Teacher: manage own teacher profile and courses
- Student: browse courses, manage profile, checkout, enroll

## Core User Flow
1. Sign up -> verification email sent -> complete profile details
2. Log in -> role-based landing (Student: profile, Teacher: dashboard, Admin/Owner: accounts)
3. Student checkout -> Stripe Checkout -> webhook finalizes order -> enrollments created -> emails sent

## Repo Layout
- `assets/`: frontend JS, CSS, configuration, and shared utilities
- `pages/`: page-level HTML (loaded into the shell iframe)
- `convex/`: backend schema, queries, mutations, actions, and http routes
- `_redirects`: SPA routing for Cloudflare Pages
- `server.py`: local dev server with SPA fallback

## Setup & Local Development
1. Configure the Convex URL in `assets/config.js`.
2. Verify Firebase project config in `assets/firebase.js` (public config only).
3. Run the local dev server:
   - `python server.py`

## Deployment Notes
- Use `npx convex deploy` for production deploys.
- Configure environment variables in the Convex dashboard (do not commit secrets):
  - `APP_BASE_URL`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_CURRENCY` (optional)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - `SMTP_FROM_NAME` (optional), `SMTP_SECURE` (optional)

## Docs
- `ARCHITECTURE.md` for system flow and data models.

## Support
Contact: iraqacademy@mesopost.com
