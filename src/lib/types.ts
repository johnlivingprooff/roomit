export type UserRole = 'renter' | 'host' | 'admin';
export type VerifiedStatus = 'none' | 'pending' | 'verified';
export type SubscriptionTier = 'basic' | 'premium';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type PropertyType = 'room' | 'house';
export type RentalDuration = 'daily' | 'weekly' | 'monthly';
export type ListingStatus = 'draft' | 'active' | 'flagged' | 'removed';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type ElectricityReliability = 'always' | 'partial' | 'rare';
export type WaterAvailability = 'available' | 'limited' | 'rare';

export interface User {
  id: string;
  phone: string;
  email?: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
  verified_status: VerifiedStatus;
  id_document_url?: string;
  risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date: string;
  expiry_date: string;
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  host_id: string;
  type: PropertyType;
  title: string;
  description: string;
  area: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  price_daily: number;
  price_weekly: number;
  price_monthly: number;
  deposit_suggested: number;
  amenities: {
    electricity: ElectricityReliability;
    water: WaterAvailability;
    wifi: boolean;
    furnished: boolean;
    shared_bathroom: boolean;
  };
  house_rules?: string;
  photos: string[];
  status: ListingStatus;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
  host?: User;
  average_rating?: number;
  total_reviews?: number;
}

export interface Booking {
  id: string;
  renter_id: string;
  listing_id: string;
  duration: RentalDuration;
  start_date: string;
  end_date: string;
  total_price: number;
  deposit_paid: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
  updated_at: string;
  listing?: Listing;
  renter?: User;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id?: string;
  content: string;
  read_at?: string;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'message' | 'subscription' | 'system';
  title: string;
  body: string;
  sent_via_sms: boolean;
  created_at: string;
}
