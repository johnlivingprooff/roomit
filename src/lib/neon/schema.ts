import { pgTable, uuid, varchar, text, timestamp, integer, boolean, pgEnum, decimal, date, jsonb } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['renter', 'host', 'admin']);
export const verifiedStatusEnum = pgEnum('verified_status', ['none', 'pending', 'verified']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['basic', 'premium']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'expired', 'cancelled']);
export const propertyTypeEnum = pgEnum('property_type', ['room', 'house']);
export const rentalDurationEnum = pgEnum('rental_duration', ['daily', 'weekly', 'monthly']);
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'flagged', 'removed']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'accepted', 'declined', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'refunded']);
export const electricityReliabilityEnum = pgEnum('electricity_reliability', ['always', 'partial', 'rare']);
export const waterAvailabilityEnum = pgEnum('water_availability', ['available', 'limited', 'rare']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 20 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  role: userRoleEnum('role').default('renter'),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  verifiedStatus: verifiedStatusEnum('verified_status').default('none'),
  idDocumentUrl: text('id_document_url'),
  riskScore: integer('risk_score').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tier: subscriptionTierEnum('tier').notNull(),
  status: subscriptionStatusEnum('status').default('active'),
  startDate: timestamp('start_date').notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostId: uuid('host_id').references(() => users.id).notNull(),
  type: propertyTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  area: varchar('area', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).default('Malawi'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  priceDaily: integer('price_daily').notNull(),
  priceWeekly: integer('price_weekly').notNull(),
  priceMonthly: integer('price_monthly').notNull(),
  depositSuggested: integer('deposit_suggested').default(0),
  amenities: jsonb('amenities').default({}),
  houseRules: text('house_rules'),
  photos: text('photos').array().default([]),
  status: listingStatusEnum('status').default('draft'),
  verificationStatus: verificationStatusEnum('verification_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  renterId: uuid('renter_id').references(() => users.id).notNull(),
  listingId: uuid('listing_id').references(() => listings.id).notNull(),
  duration: rentalDurationEnum('duration').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalPrice: integer('total_price').notNull(),
  depositPaid: integer('deposit_paid').default(0),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  bookingStatus: bookingStatusEnum('booking_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  revieweeId: uuid('reviewee_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  listingId: uuid('listing_id').references(() => listings.id),
  content: text('content').notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body'),
  sentViaSms: boolean('sent_via_sms').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
