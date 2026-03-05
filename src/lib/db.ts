import { neon } from '@neondatabase/serverless';
import type {
  Booking,
  BookingStatus,
  Listing,
  ListingStatus,
  Subscription,
  SubscriptionTier,
  User,
} from './types';

export type PublicUserRole = 'renter' | 'host';

export interface AdminDashboardStats {
  totalUsers: number;
  activeListings: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface AdminUserRecord extends Pick<User, 'id' | 'phone' | 'name' | 'role' | 'verified_status'> {
  status: 'active' | 'attention';
}

export interface AdminListingRecord {
  id: string;
  title: string;
  hostName: string | null;
  status: ListingStatus;
  verification_status: Listing['verification_status'];
  reports: number;
}

export interface AdminBookingRecord {
  id: string;
  listingTitle: string | null;
  renterName: string | null;
  hostName: string | null;
  booking_status: BookingStatus;
  total_price: number;
}

export interface ListingFilters {
  q?: string;
  city?: string;
  type?: Listing['type'];
  minPrice?: number;
  maxPrice?: number;
  furnished?: boolean;
}

export interface ListingInput {
  type: Listing['type'];
  title: string;
  description: string;
  area: string;
  city: string;
  country: string;
  price_daily: number;
  price_weekly: number;
  price_monthly: number;
  deposit_suggested: number;
  amenities: Listing['amenities'];
  house_rules?: string;
  photos: string[];
}

export interface BookingInput {
  listingId: string;
  duration: Booking['duration'];
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositPaid: number;
}

export interface OtpChallengeRecord {
  phone: string;
  code_hash: string;
  requested_role: PublicUserRole;
  requested_name: string | null;
  attempts: number;
  send_count: number;
  send_window_started_at: string;
  last_sent_at: string;
  expires_at: string;
}

const DATABASE_URL = process.env.DATABASE_URL;

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;
export const hasDatabase = Boolean(sql);

let otpTableReady: Promise<void> | null = null;

function requireDatabase() {
  if (!sql) {
    throw new Error('Database not configured');
  }

  return sql;
}

async function ensureOtpChallengesTable() {
  if (!sql) {
    return;
  }

  if (!otpTableReady) {
    otpTableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS otp_challenges (
          phone VARCHAR(20) PRIMARY KEY,
          code_hash TEXT NOT NULL,
          requested_role VARCHAR(20) NOT NULL CHECK (requested_role IN ('renter', 'host')),
          requested_name VARCHAR(255),
          attempts INTEGER NOT NULL DEFAULT 0,
          send_count INTEGER NOT NULL DEFAULT 1,
          send_window_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
          last_sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `;
    })();
  }

  await otpTableReady;
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function isPublicUserRole(value: unknown): value is PublicUserRole {
  return value === 'renter' || value === 'host';
}

export async function createPublicUser(phone: string, name: string | undefined, role: PublicUserRole): Promise<User> {
  const db = requireDatabase();
  const existing = await getUserByPhone(phone);

  if (existing) {
    if (!existing.name && name) {
      const [updatedUser] = await db`
        UPDATE users
        SET name = ${name}, updated_at = NOW()
        WHERE phone = ${phone}
        RETURNING *
      `;

      return updatedUser as User;
    }

    return existing;
  }

  const [user] = await db`
    INSERT INTO users (phone, name, role, verified_status, risk_score)
    VALUES (${phone}, ${name ?? null}, ${role}, 'none', 0)
    RETURNING *
  `;

  return user as User;
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const db = requireDatabase();
  const [user] = await db`SELECT * FROM users WHERE phone = ${phone}`;
  return (user as User | undefined) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = requireDatabase();
  const [user] = await db`SELECT * FROM users WHERE id = ${id}`;
  return (user as User | undefined) ?? null;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const db = requireDatabase();
  const [stats] = await db`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS "totalUsers",
      (SELECT COUNT(*)::int FROM listings WHERE status = 'active') AS "activeListings",
      (SELECT COUNT(*)::int FROM bookings) AS "totalBookings",
      COALESCE((SELECT SUM(total_price)::int FROM bookings WHERE payment_status = 'paid' OR booking_status = 'completed'), 0) AS "totalRevenue"
  `;

  return {
    totalUsers: Number(stats?.totalUsers ?? 0),
    activeListings: Number(stats?.activeListings ?? 0),
    totalBookings: Number(stats?.totalBookings ?? 0),
    totalRevenue: Number(stats?.totalRevenue ?? 0),
  };
}

export async function listUsersForAdmin(limit = 50): Promise<AdminUserRecord[]> {
  const db = requireDatabase();
  const rows = await db`
    SELECT id, phone, name, role, verified_status, risk_score
    FROM users
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    phone: String(row.phone),
    name: toNullableString(row.name) ?? undefined,
    role: row.role as User['role'],
    verified_status: row.verified_status as User['verified_status'],
    status: Number(row.risk_score ?? 0) > 70 ? 'attention' : 'active',
  }));
}

export async function listListingsForAdmin(limit = 50): Promise<AdminListingRecord[]> {
  const db = requireDatabase();
  const rows = await db`
    SELECT listings.id, listings.title, listings.status, listings.verification_status, users.name AS "hostName"
    FROM listings
    LEFT JOIN users ON users.id = listings.host_id
    ORDER BY listings.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    hostName: toNullableString(row.hostName),
    status: row.status as ListingStatus,
    verification_status: row.verification_status as Listing['verification_status'],
    reports: row.status === 'flagged' ? 1 : 0,
  }));
}

export async function listBookingsForAdmin(limit = 50): Promise<AdminBookingRecord[]> {
  const db = requireDatabase();
  const rows = await db`
    SELECT
      bookings.id,
      bookings.booking_status,
      bookings.total_price,
      listings.title AS "listingTitle",
      renter.name AS "renterName",
      host.name AS "hostName"
    FROM bookings
    LEFT JOIN listings ON listings.id = bookings.listing_id
    LEFT JOIN users AS renter ON renter.id = bookings.renter_id
    LEFT JOIN users AS host ON host.id = listings.host_id
    ORDER BY bookings.created_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    listingTitle: toNullableString(row.listingTitle),
    renterName: toNullableString(row.renterName),
    hostName: toNullableString(row.hostName),
    booking_status: row.booking_status as BookingStatus,
    total_price: Number(row.total_price ?? 0),
  }));
}

export async function listActiveListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const db = requireDatabase();
  const rows = await db`
    SELECT listings.*, users.id AS "hostId", users.phone AS "hostPhone", users.name AS "hostName", users.verified_status AS "hostVerifiedStatus"
    FROM listings
    LEFT JOIN users ON users.id = listings.host_id
    WHERE listings.status = 'active'
      AND listings.verification_status = 'approved'
      AND (${filters.type ?? null}::text IS NULL OR listings.type = ${filters.type ?? null})
      AND (${filters.city ?? null}::text IS NULL OR LOWER(listings.city) = LOWER(${filters.city ?? null}))
      AND (${filters.minPrice ?? null}::int IS NULL OR listings.price_daily >= ${filters.minPrice ?? null})
      AND (${filters.maxPrice ?? null}::int IS NULL OR listings.price_daily <= ${filters.maxPrice ?? null})
      AND (
        ${filters.furnished ?? null}::boolean IS NULL
        OR COALESCE((listings.amenities->>'furnished')::boolean, false) = ${filters.furnished ?? null}
      )
      AND (
        ${filters.q ?? null}::text IS NULL
        OR listings.title ILIKE ${`%${filters.q ?? ''}%`}
        OR listings.city ILIKE ${`%${filters.q ?? ''}%`}
        OR listings.area ILIKE ${`%${filters.q ?? ''}%`}
      )
    ORDER BY listings.created_at DESC
  `;

  return rows.map((row) => ({
    ...(row as Listing),
    host: row.hostId
      ? {
          id: String(row.hostId),
          phone: String(row.hostPhone ?? ''),
          role: 'host',
          name: toNullableString(row.hostName) ?? undefined,
          verified_status: (row.hostVerifiedStatus as User['verified_status']) ?? 'none',
          risk_score: 0,
          created_at: '',
          updated_at: '',
        }
      : undefined,
  }));
}

export async function getListingById(id: string): Promise<Listing | null> {
  const db = requireDatabase();
  const [row] = await db`
    SELECT listings.*, users.id AS "hostId", users.phone AS "hostPhone", users.name AS "hostName", users.verified_status AS "hostVerifiedStatus"
    FROM listings
    LEFT JOIN users ON users.id = listings.host_id
    WHERE listings.id = ${id}
    LIMIT 1
  `;

  if (!row) {
    return null;
  }

  return {
    ...(row as Listing),
    host: row.hostId
      ? {
          id: String(row.hostId),
          phone: String(row.hostPhone ?? ''),
          role: 'host',
          name: toNullableString(row.hostName) ?? undefined,
          verified_status: (row.hostVerifiedStatus as User['verified_status']) ?? 'none',
          risk_score: 0,
          created_at: '',
          updated_at: '',
        }
      : undefined,
  };
}

export async function listListingsForHost(hostId: string): Promise<Listing[]> {
  const db = requireDatabase();
  const rows = await db`
    SELECT *
    FROM listings
    WHERE host_id = ${hostId}
    ORDER BY created_at DESC
  `;

  return rows as Listing[];
}

export async function createListing(hostId: string, input: ListingInput): Promise<Listing> {
  const db = requireDatabase();
  const [listing] = await db`
    INSERT INTO listings (
      host_id, type, title, description, area, city, country,
      price_daily, price_weekly, price_monthly, deposit_suggested,
      amenities, house_rules, photos, status, verification_status
    )
    VALUES (
      ${hostId}, ${input.type}, ${input.title}, ${input.description},
      ${input.area}, ${input.city}, ${input.country},
      ${input.price_daily}, ${input.price_weekly}, ${input.price_monthly},
      ${input.deposit_suggested},
      ${JSON.stringify(input.amenities)}::jsonb,
      ${input.house_rules ?? null},
      ${input.photos},
      'draft',
      'pending'
    )
    RETURNING *
  `;

  return listing as Listing;
}

export async function updateListing(
  listingId: string,
  actorId: string,
  actorRole: User['role'],
  patch: Partial<ListingInput> & Partial<Pick<Listing, 'status' | 'verification_status'>>,
): Promise<Listing | null> {
  const db = requireDatabase();
  const [existing] = await db`
    SELECT * FROM listings WHERE id = ${listingId} LIMIT 1
  `;

  if (!existing) {
    return null;
  }

  if (actorRole !== 'admin' && String(existing.host_id) !== actorId) {
    throw new Error('Forbidden');
  }

  const amenities = patch.amenities
    ? JSON.stringify(patch.amenities)
    : JSON.stringify(existing.amenities);
  const [updated] = await db`
    UPDATE listings
    SET
      type = ${patch.type ?? existing.type},
      title = ${patch.title ?? existing.title},
      description = ${patch.description ?? existing.description},
      area = ${patch.area ?? existing.area},
      city = ${patch.city ?? existing.city},
      country = ${patch.country ?? existing.country},
      price_daily = ${patch.price_daily ?? existing.price_daily},
      price_weekly = ${patch.price_weekly ?? existing.price_weekly},
      price_monthly = ${patch.price_monthly ?? existing.price_monthly},
      deposit_suggested = ${patch.deposit_suggested ?? existing.deposit_suggested},
      amenities = ${amenities}::jsonb,
      house_rules = ${patch.house_rules ?? existing.house_rules},
      photos = ${patch.photos ?? existing.photos},
      status = ${patch.status ?? existing.status},
      verification_status = ${patch.verification_status ?? existing.verification_status},
      updated_at = NOW()
    WHERE id = ${listingId}
    RETURNING *
  `;

  return (updated as Listing | undefined) ?? null;
}

export async function softDeleteListing(listingId: string, actorId: string, actorRole: User['role']) {
  return updateListing(listingId, actorId, actorRole, { status: 'removed' });
}

export async function listBookingsForUser(userId: string, role: User['role']): Promise<Booking[]> {
  const db = requireDatabase();

  if (role === 'admin') {
    const rows = await db`SELECT * FROM bookings ORDER BY created_at DESC`;
    return rows as Booking[];
  }

  if (role === 'host') {
    const rows = await db`
      SELECT bookings.*
      FROM bookings
      INNER JOIN listings ON listings.id = bookings.listing_id
      WHERE listings.host_id = ${userId}
      ORDER BY bookings.created_at DESC
    `;
    return rows as Booking[];
  }

  const rows = await db`
    SELECT *
    FROM bookings
    WHERE renter_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows as Booking[];
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = requireDatabase();
  const [booking] = await db`SELECT * FROM bookings WHERE id = ${id}`;
  return (booking as Booking | undefined) ?? null;
}

export async function createBooking(renterId: string, input: BookingInput): Promise<Booking> {
  const db = requireDatabase();
  const [booking] = await db`
    INSERT INTO bookings (
      renter_id, listing_id, duration, start_date, end_date,
      total_price, deposit_paid, payment_status, booking_status
    )
    VALUES (
      ${renterId}, ${input.listingId}, ${input.duration}, ${input.startDate},
      ${input.endDate}, ${input.totalPrice}, ${input.depositPaid}, 'pending', 'pending'
    )
    RETURNING *
  `;

  return booking as Booking;
}

export async function updateBookingStatus(
  bookingId: string,
  actorId: string,
  actorRole: User['role'],
  bookingStatus: BookingStatus,
): Promise<Booking | null> {
  const db = requireDatabase();
  const [booking] = await db`
    SELECT bookings.*, listings.host_id
    FROM bookings
    INNER JOIN listings ON listings.id = bookings.listing_id
    WHERE bookings.id = ${bookingId}
    LIMIT 1
  `;

  if (!booking) {
    return null;
  }

  const isAllowed =
    actorRole === 'admin' ||
    String(booking.renter_id) === actorId ||
    String(booking.host_id) === actorId;

  if (!isAllowed) {
    throw new Error('Forbidden');
  }

  const [updated] = await db`
    UPDATE bookings
    SET booking_status = ${bookingStatus}, updated_at = NOW()
    WHERE id = ${bookingId}
    RETURNING *
  `;

  return (updated as Booking | undefined) ?? null;
}

export async function getCurrentSubscription(userId: string): Promise<Subscription | null> {
  const db = requireDatabase();
  const [subscription] = await db`
    SELECT *
    FROM subscriptions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return (subscription as Subscription | undefined) ?? null;
}

export async function upsertSubscription(userId: string, tier: SubscriptionTier): Promise<Subscription> {
  const db = requireDatabase();
  const now = new Date();
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + 1);

  const [subscription] = await db`
    INSERT INTO subscriptions (
      user_id, tier, status, start_date, expiry_date
    )
    VALUES (${userId}, ${tier}, 'active', ${now.toISOString()}, ${expiry.toISOString()})
    RETURNING *
  `;

  return subscription as Subscription;
}

export async function getOtpChallenge(phone: string): Promise<OtpChallengeRecord | null> {
  const db = requireDatabase();
  await ensureOtpChallengesTable();
  const [challenge] = await db`
    SELECT phone, code_hash, requested_role, requested_name, attempts, send_count, send_window_started_at, last_sent_at, expires_at
    FROM otp_challenges
    WHERE phone = ${phone}
    LIMIT 1
  `;

  return (challenge as OtpChallengeRecord | undefined) ?? null;
}

export async function saveOtpChallenge(challenge: OtpChallengeRecord): Promise<void> {
  const db = requireDatabase();
  await ensureOtpChallengesTable();
  await db`
    INSERT INTO otp_challenges (
      phone, code_hash, requested_role, requested_name, attempts, send_count,
      send_window_started_at, last_sent_at, expires_at, updated_at
    )
    VALUES (
      ${challenge.phone}, ${challenge.code_hash}, ${challenge.requested_role}, ${challenge.requested_name},
      ${challenge.attempts}, ${challenge.send_count}, ${challenge.send_window_started_at},
      ${challenge.last_sent_at}, ${challenge.expires_at}, NOW()
    )
    ON CONFLICT (phone)
    DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      requested_role = EXCLUDED.requested_role,
      requested_name = EXCLUDED.requested_name,
      attempts = EXCLUDED.attempts,
      send_count = EXCLUDED.send_count,
      send_window_started_at = EXCLUDED.send_window_started_at,
      last_sent_at = EXCLUDED.last_sent_at,
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW()
  `;
}

export async function deleteOtpChallenge(phone: string): Promise<void> {
  const db = requireDatabase();
  await ensureOtpChallengesTable();
  await db`DELETE FROM otp_challenges WHERE phone = ${phone}`;
}
