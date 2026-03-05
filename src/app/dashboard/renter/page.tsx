'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Heart, Shield } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';
import type { Booking } from '@/lib/types';

export default function RenterDashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      try {
        const response = await fetch('/api/bookings', { credentials: 'include' });
        const data = await response.json();

        if (!cancelled) {
          if (response.ok) {
            setBookings(Array.isArray(data.bookings) ? data.bookings : []);
          } else {
            setError(data.error || 'Failed to load bookings.');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load bookings.');
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-medium text-earth">
                Welcome back, {user?.name?.split(' ')[0] || 'Member'}
              </h1>
              <p className="text-earth/60 mt-1">Manage your bookings and continue your search.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-soft border border-earth/5 flex items-center gap-4 min-w-[240px]">
              <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald" />
              </div>
              <div>
                <p className="text-sm font-medium text-earth">Account Status</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald rounded-full" />
                  <span className="text-xs text-earth/60 capitalize">
                    {user?.verified_status || 'basic'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-earth">My Bookings</h2>
            </div>
            <div className="grid gap-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-5">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div>
                        <p className="font-semibold text-earth">
                          Booking {booking.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-earth/60 mt-1">
                          {new Date(booking.start_date).toLocaleDateString()} to{' '}
                          {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            booking.booking_status === 'completed'
                              ? 'active'
                              : booking.booking_status === 'cancelled'
                                ? 'error'
                                : 'warning'
                          }
                        >
                          {booking.booking_status}
                        </Badge>
                        <span className="font-semibold text-primary">
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-earth/5 shadow-soft p-6 text-earth/60">
                  No bookings yet.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-earth/5 shadow-soft p-6">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold text-earth">Saved Listings</h2>
            </div>
            <p className="text-earth/60">Saved listings are not implemented yet in the backend.</p>
            <Link href="/search">
              <Button variant="secondary" className="mt-4">
                Explore Listings
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
