import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Subscription, SubscriptionStatus, SubscriptionTier } from './types';

interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setLoading: (loading: boolean) => void;
  hasActiveSubscription: () => boolean;
  canAccessPremium: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      
      setSubscription: (subscription) => set({ subscription }),
      
      setLoading: (isLoading) => set({ isLoading }),

      hasActiveSubscription: () => {
        const { subscription } = get();
        if (!subscription) return false;
        if (subscription.status !== 'active') return false;
        const expiryDate = new Date(subscription.expiry_date);
        return expiryDate > new Date();
      },

      canAccessPremium: () => {
        const { subscription } = get();
        if (!subscription) return false;
        if (subscription.status !== 'active') return false;
        const expiryDate = new Date(subscription.expiry_date);
        return subscription.tier === 'premium' && expiryDate > new Date();
      },

      logout: () => set({ user: null, subscription: null }),
    }),
    {
      name: 'roomit-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
