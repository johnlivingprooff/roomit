# RoomIt

RoomIt is a Next.js 14 rental marketplace for budget rooms and houses. This repository now uses server-issued session cookies, route guards, and database-backed APIs for auth, listings, bookings, subscriptions, and admin reporting.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Neon/PostgreSQL via `@neondatabase/serverless`
- SMS delivery via Africa's Talking or Twilio

## Environment

Copy `.env.example` and provide:

- `DATABASE_URL` for the Neon/Postgres database
- `AUTH_SECRET` for signing the `roomit_session` cookie
- SMS provider credentials for production OTP delivery

Database driver behavior:

- Local URLs (`localhost` / `127.0.0.1`) use direct Postgres connections.
- Non-local URLs (for example Neon on Vercel) use Neon serverless driver.
- Do not wrap `DATABASE_URL` in quotes.

If `DATABASE_URL` is missing, the app will still render, but live data features will fall back to empty states and protected mutations will fail safely.

## Local Development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Authentication

- Login uses phone number + OTP.
- Successful verification sets an `httpOnly` signed session cookie.
- Public signup can create only `renter` or `host`.
- Admin accounts must be provisioned directly in the database.

## Admin Bootstrap

Use [`create-admin.sql`](/home/johnlivingprooff/roomit/roomit/create-admin.sql) to seed an admin account and sample users in the database. Public signup will not create admins.

## Core API Routes

- `POST /api/auth`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `GET/POST /api/listings`
- `GET/PATCH/DELETE /api/listings/[id]`
- `GET/POST /api/bookings`
- `GET/PATCH /api/bookings/[id]`
- `GET/POST /api/subscriptions`
- `GET /api/admin/*` protected admin reporting routes

## Deployment Notes

- Set `AUTH_SECRET` in production.
- In Vercel, set `DATABASE_URL` to your Neon pooled connection string in Project Settings > Environment Variables.
- Configure an SMS provider in production; OTP delivery fails closed without one.
- Apply the database schema from `supabase-schema.sql`, then run `create-admin.sql` if you need an initial admin.
- The local sandbox used during development surfaced an `EXDEV` `.next` rename issue during `next build`; validate the final build on the real deployment target as part of release verification.
