'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Plus, Calendar, DollarSign, Shield } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';
import type { Booking, Listing } from '@/lib/types';

export default function HostDashboard() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [listingResponse, bookingResponse] = await Promise.all([
          fetch('/api/listings?mine=true', { credentials: 'include' }),
          fetch('/api/bookings', { credentials: 'include' }),
        ]);
        const [listingData, bookingData] = await Promise.all([
          listingResponse.json(),
          bookingResponse.json(),
        ]);

        if (!cancelled) {
          setListings(Array.isArray(listingData.listings) ? listingData.listings : []);
          setBookings(Array.isArray(bookingData.bookings) ? bookingData.bookings : []);
          if (!listingResponse.ok || !bookingResponse.ok) {
            setError(listingData.error || bookingData.error || 'Failed to load dashboard data.');
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load dashboard data.');
        }
      }
    }

    loadData();

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
    <div className="min-h-full bg-cream">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-serif font-medium text-earth">
                Welcome back, {user?.name?.split(' ')[0] || 'Host'}
              </h1>
              <p className="text-earth/60 mt-1">Manage your properties and recent bookings.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-soft border border-earth/5 flex items-center gap-4 min-w-[240px]">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-earth">ID Verification</p>
                  <span className="text-xs text-earth/50">
                    {user?.verified_status === 'verified' ? 'Fully Verified' : 'Action Required'}
                  </span>
                </div>
              </div>
              <Link href="/listing/create">
                <Button className="h-full px-6 bg-earth text-white border-earth hover:bg-earth/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Listing
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Listings', value: listings.length.toString(), icon: Home },
              { label: 'Bookings', value: bookings.length.toString(), icon: Calendar },
              {
                label: 'Pipeline',
                value: formatPrice(bookings.reduce((sum, booking) => sum + booking.total_price, 0)),
                icon: DollarSign,
              },
              {
                label: 'Status',
                value: user?.verified_status === 'verified' ? 'Verified' : 'Pending',
                icon: Shield,
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sand/30 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-earth" />
                  </div>
                  <div>
                    <p className="text-xl font-serif font-medium text-earth">{stat.value}</p>
                    <p className="text-sm text-earth/40">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-earth mb-4">My Listings</h2>
            <div className="grid gap-4">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <h3 className="font-semibold text-earth">{listing.title}</h3>
                        <p className="text-sm text-earth/60">
                          {listing.area}, {listing.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={listing.status === 'active' ? 'active' : 'pending'}>
                          {listing.status}
                        </Badge>
                        <Badge
                          variant={
                            listing.verification_status === 'approved'
                              ? 'active'
                              : listing.verification_status === 'pending'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {listing.verification_status}
                        </Badge>
                        <span className="font-semibold text-primary">
                          {formatPrice(listing.price_monthly)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-earth/5 shadow-soft p-6 text-earth/60">
                  No listings yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-earth mb-4">Recent Bookings</h2>
            <div className="grid gap-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <p className="font-semibold text-earth">{booking.booking_status}</p>
                        <p className="text-sm text-earth/60">
                          {new Date(booking.start_date).toLocaleDateString()} to{' '}
                          {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-primary">
                        {formatPrice(booking.total_price)}
                      </span>
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
        </div>
      </main>
    </div>
  );
}
