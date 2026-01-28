# IraqAcademy

IraqAcademy is a production-grade prototype for an educational SaaS platform. It provides role-based access for owners, admins, teachers, and students, with Firebase Authentication, a Convex backend, and a Stripe-based checkout flow that finalizes enrollments and triggers email notifications.

## Tech Stack
- Frontend: Cloudflare Pages (static HTML/CSS/JS)
- Backend: Convex (database, queries, mutations, actions, webhooks)
- Auth: Firebase Authentication (email/password, Google, Microsoft)
- Payments: Stripe Checkout (test mode supported)
- Email: SMTP via Zoho (server-side only)

## Architecture (High Level)
```
Browser (HTML/CSS/JS)
  ├─ Firebase Auth → ID token
  └─ Convex (queries/mutations/actions) → Convex DB

Payments:
Browser → Convex action → Stripe Checkout
Stripe webhook → Convex internal mutation → orders + enrollments + emails
```

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

### Convex Deployment Notes
- Use `npx convex deploy` for production deploys.
- Configure environment variables in the Convex dashboard (do not commit secrets):
  - `APP_BASE_URL`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_CURRENCY` (optional)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - `SMTP_FROM_NAME` (optional), `SMTP_SECURE` (optional)

## Roles & Permissions
- Owner: full access, cannot demote self or remove last owner
- Admin: manage users, teachers, courses, and enrollments
- Teacher: manage own teacher profile and courses
- Student: browse courses, manage profile, checkout, enroll

## Main Flows
- Auth: Firebase → ID token → Convex auth context
- Courses: public queries, role-guarded mutations
- Cart & Checkout: student-only, idempotent, server-validated
- Enrollment: created server-side after successful payment
- Email: sent server-side after enrollments are finalized

## Docs
- `ARCHITECTURE.md` for system flow and data models.

## Support
Contact: iraqacademy@mesopost.com
