# Copilot Instructions for Roomie (Roomit)

## Project Architecture
- **Framework:** Next.js 14 (App Router, TypeScript, TailwindCSS)
- **Core Directories:**
  - `src/app/`: Route-based pages (admin, dashboard, booking, listing, login, search, subscribe)
  - `src/components/ui/`: Reusable UI components (Button, Badge, Input, ListingCard, etc.)
  - `src/lib/`: Shared logic (auth-store, database types, Neon/Supabase clients, SMS, types)
- **Data Layer:**
  - Uses Neon/PostgreSQL via Drizzle ORM (`src/lib/neon/`)
  - Supabase integration for SSR and client-side auth
  - Database schema is defined in both SQL (`supabase-schema.sql`) and Drizzle models (`src/lib/neon/schema.ts`)

## Key Patterns & Conventions
- **State Management:**
  - Auth and subscription state via Zustand (`src/lib/auth-store.ts`)
  - Persisted in localStorage under `roomie-auth`
- **UI:**
  - TailwindCSS utility classes, custom color palette (see SPEC.md)
  - Button, Badge, Input components use variant props for style control
- **Routing:**
  - File-based routing in `src/app/` (e.g., `/dashboard/host`, `/listing/[id]`)
  - API routes in `src/app/api/` (auth, bookings, listings, subscriptions)
- **Access Control:**
  - Role-based (renter, host, admin) and subscription checks (see `auth-store.ts`)
  - Middleware redirects non-subscribers to `/subscribe` for gated actions
- **Forms:**
  - Multi-step forms for listing creation (`/listing/create`)
  - Form validation and error display via Input component
- **Mobile-first:**
  - Responsive breakpoints, sticky header/footer, touch-friendly controls
  - PWA support via `next-pwa` and service worker in `public/`

## Developer Workflows
- **Start Dev Server:** `npm run dev` (Next.js)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Database:**
  - Schema: See `supabase-schema.sql` and Drizzle models
  - Migrations: Use Drizzle Kit for schema changes
- **Environment:**
  - Requires `DATABASE_URL` for Neon/Postgres
  - Supabase keys for SSR/client auth
- **Testing:**
  - No formal test suite detected; add tests in `src/__tests__/` if needed

## Integration Points
- **External Services:**
  - Neon/Postgres (Drizzle ORM)
  - Supabase (auth, SSR)
  - SMS (Twilio/Africa's Talking via `src/lib/sms.ts`)
  - Stripe (card payments, see SPEC.md)
  - Mobile Money (EcoCash, Airtel Money, TNM Mpamba)
- **Data Flow:**
  - User actions → API routes → DB via Drizzle/Supabase → UI update via Zustand

## References & Specs
- **Design/Feature Spec:** See [SPEC.md](../SPEC.md) for UI, flows, acceptance criteria
- **Database Types:** See [src/lib/database.ts](../src/lib/database.ts) and [src/lib/types.ts](../src/lib/types.ts)
- **Schema Models:** See [src/lib/neon/schema.ts](../src/lib/neon/schema.ts)
- **UI Patterns:** See [src/components/ui/](../src/components/ui/)

## Example: Listing Creation Flow
1. User navigates to `/listing/create`
2. Multi-step form collects info, validates, compresses images
3. On submit, API route creates listing in DB
4. Listing appears in search/dashboard

---

**If anything is unclear or missing, ask for clarification or check SPEC.md for requirements.**
