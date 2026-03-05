import { create } from 'zustand';
import type { Subscription, User } from './types';

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

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  subscription: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setSubscription: (subscription) => set({ subscription }),

  setLoading: (isLoading) => set({ isLoading }),

  hasActiveSubscription: () => {
    const { subscription } = get();

    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    return new Date(subscription.expiry_date) > new Date();
  },

  canAccessPremium: () => {
    const { subscription } = get();

    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    return subscription.tier === 'premium' && new Date(subscription.expiry_date) > new Date();
  },

  logout: () => set({ user: null, subscription: null, isLoading: false }),
}));
