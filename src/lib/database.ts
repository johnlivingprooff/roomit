export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          email: string | null
          role: 'renter' | 'host' | 'admin'
          name: string | null
          avatar_url: string | null
          verified_status: 'none' | 'pending' | 'verified'
          id_document_url: string | null
          risk_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          email?: string | null
          role?: 'renter' | 'host' | 'admin'
          name?: string | null
          avatar_url?: string | null
          verified_status?: 'none' | 'pending' | 'verified'
          id_document_url?: string | null
          risk_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          email?: string | null
          role?: 'renter' | 'host' | 'admin'
          name?: string | null
          avatar_url?: string | null
          verified_status?: 'none' | 'pending' | 'verified'
          id_document_url?: string | null
          risk_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'basic' | 'premium'
          status: 'active' | 'expired' | 'cancelled'
          start_date: string
          expiry_date: string
          payment_method: string | null
          transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'basic' | 'premium'
          status?: 'active' | 'expired' | 'cancelled'
          start_date: string
          expiry_date: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'basic' | 'premium'
          status?: 'active' | 'expired' | 'cancelled'
          start_date?: string
          expiry_date?: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          host_id: string
          type: 'room' | 'house'
          title: string
          description: string
          area: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          price_daily: number
          price_weekly: number
          price_monthly: number
          deposit_suggested: number
          amenities: Json
          house_rules: string | null
          photos: string[]
          status: 'draft' | 'active' | 'flagged' | 'removed'
          verification_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          type: 'room' | 'house'
          title: string
          description: string
          area: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          price_daily: number
          price_weekly: number
          price_monthly: number
          deposit_suggested: number
          amenities: Json
          house_rules?: string | null
          photos?: string[]
          status?: 'draft' | 'active' | 'flagged' | 'removed'
          verification_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          type?: 'room' | 'house'
          title?: string
          description?: string
          area?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          price_daily?: number
          price_weekly?: number
          price_monthly?: number
          deposit_suggested?: number
          amenities?: Json
          house_rules?: string | null
          photos?: string[]
          status?: 'draft' | 'active' | 'flagged' | 'removed'
          verification_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          renter_id: string
          listing_id: string
          duration: 'daily' | 'weekly' | 'monthly'
          start_date: string
          end_date: string
          total_price: number
          deposit_paid: number
          payment_status: 'pending' | 'paid' | 'refunded'
          booking_status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          renter_id: string
          listing_id: string
          duration: 'daily' | 'weekly' | 'monthly'
          start_date: string
          end_date: string
          total_price: number
          deposit_paid: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          booking_status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          renter_id?: string
          listing_id?: string
          duration?: 'daily' | 'weekly' | 'monthly'
          start_date?: string
          end_date?: string
          total_price?: number
          deposit_paid?: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          booking_status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          listing_id: string | null
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          listing_id?: string | null
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          listing_id?: string | null
          content?: string
          read_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'booking' | 'message' | 'subscription' | 'system'
          title: string
          body: string
          sent_via_sms: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'booking' | 'message' | 'subscription' | 'system'
          title: string
          body: string
          sent_via_sms?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'booking' | 'message' | 'subscription' | 'system'
          title?: string
          body?: string
          sent_via_sms?: boolean
          created_at?: string
        }
      }
    }
  }
}
