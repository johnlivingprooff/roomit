# Roomie - Budget Room & House Rental Platform

## Project Overview

**Project Name:** Roomie  
**Type:** Mobile-first PWA Web Application  
**Core Functionality:** Paywalled rental platform for budget rooms/houses in Malawi/Zimbabwe with trust-first model, subscription gating, and mobile money integration.  
**Target Users:** Budget renters seeking rooms/houses, hosts listing modest accommodations, platform administrators.

---

## UI/UX Specification

### Layout Structure

**Global Layout:**
- Sticky header (64px) with logo, nav, user menu
- Main content area with max-width 1280px, centered
- Bottom navigation on mobile (56px height)
- Footer with links on desktop only

**Responsive Breakpoints:**
- Mobile: 0-639px (primary focus)
- Tablet: 640-1023px
- Desktop: 1024px+

### Visual Design

**Color Palette:**
- Primary: `#0D9488` (Teal 600 - trust, reliability)
- Primary Dark: `#0F766E` (Teal 700)
- Secondary: `#F59E0B` (Amber 500 - premium accent)
- Background: `#FAFAFA` (neutral-50)
- Surface: `#FFFFFF`
- Text Primary: `#1E293B` (slate-800)
- Text Secondary: `#64748B` (slate-500)
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Border: `#E2E8F0` (slate-200)

**Typography:**
- Font Family: `"DM Sans", sans-serif` (clean, readable, modern)
- Headings: 
  - H1: 32px/40px, font-weight 700
  - H2: 24px/32px, font-weight 600
  - H3: 20px/28px, font-weight 600
  - H4: 16px/24px, font-weight 600
- Body: 16px/24px, font-weight 400
- Small: 14px/20px, font-weight 400
- Caption: 12px/16px, font-weight 500

**Spacing System:**
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

**Visual Effects:**
- Card shadows: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Elevated shadows: `0 10px 15px -3px rgba(0,0,0,0.1)`
- Border radius: 8px (cards), 6px (buttons), 12px (modals)
- Transitions: 150ms ease-in-out

### Components

**Buttons:**
- Primary: Teal background, white text, 44px height (touch-friendly)
- Secondary: White background, teal border, teal text
- Ghost: Transparent, teal text
- Disabled: Gray background, reduced opacity

**Form Inputs:**
- Height: 48px
- Border: 1px slate-200
- Focus: 2px teal ring
- Error: Red border, error message below

**Cards (Listings):**
- Image aspect ratio: 4:3
- Padding: 16px
- Contains: Image, type badge, title, location, price, rating

**Badges:**
- Verified: Teal background
- Premium: Amber background
- Risk indicators: Color-coded

**Modals:**
- Centered, max-width 480px
- Backdrop blur on mobile
- Slide-up animation

---

## Page Specifications

### 1. Landing Page (`/`)

**Hero Section:**
- Headline: "Find Your Next Home, Simply"
- Subhead: "Trusted rooms & houses in Malawi & Zimbabwe"
- Search bar with location dropdown, property type, duration
- CTA: "Start Searching" (gated - requires subscription prompt)

**Featured Listings:**
- 6 listing cards in grid
- "Preview" watermark for non-subscribers

**How It Works:**
- 3 steps with icons: Search → Subscribe → Book

**Pricing Section:**
- Subscription tiers display
- Mobile money logos

**Footer:**
- Links: About, Terms, Contact, FAQ

### 2. Subscription Page (`/subscribe`)

**Tier Cards:**
- Basic: $1/month - Browse + Message
- Premium: $3/month - Basic + Priority listing + Analytics

**Payment Methods:**
- Mobile Money buttons (EcoCash, Airtel Money, TNM Mpamba)
- Card option (Stripe)

**Current Plan Display:**
- For logged-in users, show current subscription status

### 3. Search Results (`/search`)

**Filter Sidebar (desktop) / Bottom Sheet (mobile):**
- Budget range slider
- Property type (Room/House)
- Duration (Daily/Weekly/Monthly)
- Furnished status
- Water availability
- Electricity reliability

**Results Grid:**
- Lazy-loaded images
- Sort by: Price, Rating, Newest
- Pagination or infinite scroll

**Empty State:**
- Illustration + "No listings found"

### 4. Listing Detail (`/listing/[id]`)

**Image Gallery:**
- Main image + thumbnail strip
- Tap to expand

**Info Section:**
- Property type badge
- Title, location
- Price by duration (prominent)
- Host info with avatar, rating, verified badge

**Amenities Grid:**
- Icons + labels
- Electricity: Always/Partial/Rare
- Water: Available/Limited/Rare
- WiFi, Furnished, Shared bathroom

**Description:**
- Expandable text

**House Rules:**
- Bulleted list

**Booking Widget (sticky on mobile):**
- Duration selector (Daily/Weekly/Monthly)
- Date picker
- Price calculation
- "Request to Book" button

**Reviews Section:**
- Overall rating + breakdown
- Review cards

### 5. Booking Page (`/booking/[id]`)

**Summary:**
- Listing info
- Selected duration & dates
- Price breakdown

**Payment Section:**
- Deposit amount
- Payment method selector
- Terms checkbox

**Confirmation:**
- Success animation
- SMS notification mention
- Booking reference

### 6. Dashboard - Renter (`/dashboard/renter`)

**Tabs:**
- My Bookings
- Saved Listings
- Messages

**Booking Cards:**
- Status badge (Pending/Confirmed/Completed)
- Listing thumbnail
- Dates, price
- Actions: Message host, Cancel

### 7. Dashboard - Host (`/dashboard/host`)

**Tabs:**
- My Listings
- Bookings
- Analytics

**Listing Management:**
- Create new listing button
- Listing cards with status
- Actions: Edit, Delete, Toggle availability

**Booking Requests:**
- Accept/Decline buttons
- Payout info

### 8. Create Listing (`/listing/create`)

**Multi-step Form:**
1. Basic Info: Type, Title, Description
2. Location: Area, City, GPS (optional)
3. Pricing: Daily, Weekly, Monthly rates
4. Amenities: Checkboxes
5. Photos: Upload (max 5, compressed)
6. Rules: House rules text
7. Preview & Publish

### 9. Admin Dashboard (`/admin`)

**Stats Cards:**
- Total users, listings, bookings
- Revenue this month

**Management Tables:**
- Users (verify, suspend)
- Listings (approve, flag)
- Subscriptions (manage)
- Disputes (resolve)

---

## Functionality Specification

### Authentication

- Phone number input + OTP verification
- JWT tokens stored in httpOnly cookies
- Session persistence
- Role-based access (renter, host, admin)

### Subscription System

- Check subscription status on protected actions
- Middleware redirects to subscribe if expired/inactive
- Subscription tiers stored in database
- Expiry tracking with grace period

### Listing Management

- CRUD operations for hosts
- Auto-compress images on upload (max 500KB)
- Generate thumbnails
- Geocoding for location
- Availability calendar

### Booking Flow

1. Renter selects dates → Request sent
2. Host receives notification → Accept/Decline
3. On accept → Payment flow triggered
4. Payment success → Confirmation SMS
5. Booking status updates

### Search & Filtering

- PostgreSQL full-text search
- Filter by all specified criteria
- Sort options
- Pagination (20 per page)

### Trust & Safety

- ID verification upload
- Risk scoring algorithm
- Review system after booking
- Flag suspicious listings
- Admin moderation queue

### Notifications

- In-app notifications
- SMS via provider (Twilio/Africa's Talking)
- Email (optional)

### Payments

- Mobile Money integration stubs
- Deposit collection
- Payout to hosts (minus platform fee)

---

## Database Schema

### users
- id (UUID, PK)
- phone (unique)
- email (nullable)
- role (enum: renter, host, admin)
- name (nullable)
- avatar_url (nullable)
- verified_status (enum: none, pending, verified)
- id_document_url (nullable)
- risk_score (integer)
- created_at, updated_at

### subscriptions
- id (UUID, PK)
- user_id (FK)
- tier (enum: basic, premium)
- status (enum: active, expired, cancelled)
- start_date, expiry_date
- payment_method
- transaction_id

### listings
- id (UUID, PK)
- host_id (FK)
- type (enum: room, house)
- title, description
- area, city, country
- latitude, longitude (nullable)
- price_daily, price_weekly, price_monthly
- deposit_suggested
- amenities (JSONB)
- house_rules (text)
- photos (JSON array)
- status (enum: draft, active, flagged, removed)
- verification_status (enum: pending, approved, rejected)
- created_at, updated_at

### bookings
- id (UUID, PK)
- renter_id (FK)
- listing_id (FK)
- duration (enum: daily, weekly, monthly)
- start_date, end_date
- total_price
- deposit_paid
- payment_status (enum: pending, paid, refunded)
- booking_status (enum: pending, accepted, declined, completed, cancelled)
- created_at, updated_at

### reviews
- id (UUID, PK)
- booking_id (FK)
- reviewer_id (FK)
- reviewee_id (FK)
- rating (1-5)
- comment (nullable)
- created_at

### messages
- id (UUID, PK)
- sender_id (FK)
- receiver_id (FK)
- listing_id (FK, nullable)
- content
- read_at (nullable)
- created_at

### notifications
- id (UUID, PK)
- user_id (FK)
- type (enum: booking, message, subscription, system)
- title, body
- sent_via_sms (boolean)
- created_at

---

## Acceptance Criteria

### Authentication
- [ ] User can register with phone number
- [ ] OTP sent and verified
- [ ] Login persists across sessions
- [ ] Role-based dashboard access

### Subscription
- [ ] Non-subscribers see paywall on protected actions
- [ ] Subscription payment flow works
- [ ] Subscription status checked on each request
- [ ] Expiry handled gracefully

### Listings
- [ ] Hosts can create listings with all fields
- [ ] Images auto-compressed
- [ ] Listings appear in search
- [ ] Filters work correctly

### Booking
- [ ] Renter can request booking
- [ ] Host sees request, can accept/decline
- [ ] Payment triggered on accept
- [ ] Confirmation generated

### Search
- [ ] Results load with lazy images
- [ ] All filters functional
- [ ] Sorting works
- [ ] Empty states handled

### Mobile
- [ ] PWA installable
- [ ] Works offline (cached)
- [ ] Touch-friendly (44px+ buttons)
- [ ] Low-data mode functional

### Admin
- [ ] Can view all data
- [ ] Can verify/flag listings
- [ ] Can manage users
- [ ] Can view reports
