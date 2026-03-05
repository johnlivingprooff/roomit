'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import type { Listing } from '@/lib/types';

const paymentMethods = [
  { id: 'ecocash', name: 'EcoCash', logo: '💰' },
  { id: 'airtel', name: 'Airtel Money', logo: '📱' },
  { id: 'tnm', name: 'TNM Mpamba', logo: '📲' },
];

export default function BookingPage() {
  const routeParams = useParams<{ id: string }>();
  const listingId = routeParams?.id;
  const router = useRouter();
  const [duration, setDuration] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('ecocash');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadListing() {
      if (!listingId) {
        return;
      }

      try {
        const response = await fetch(`/api/listings/${listingId}`, { credentials: 'include' });
        const data = await response.json();

        if (!cancelled && response.ok) {
          setListing(data.listing ?? null);
        }
      } catch {
        if (!cancelled) {
          setListing(null);
        }
      }
    }

    loadListing();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const rentTotal =
    duration === 'daily'
      ? listing?.price_daily ?? 0
      : duration === 'weekly'
        ? listing?.price_weekly ?? 0
        : listing?.price_monthly ?? 0;
  const deposit = listing?.deposit_suggested ?? 0;

  const handleBooking = async () => {
    if (!agreedToTerms || !listingId) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingId,
          duration,
          startDate,
          endDate,
          totalPrice: rentTotal,
          depositPaid: deposit,
          paymentMethod: selectedPayment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create booking.');
        return;
      }

      setIsConfirmed(true);
      setTimeout(() => {
        router.push('/dashboard/renter');
      }, 1200);
    } catch {
      setError('Failed to create booking.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-earth mb-8">Complete Your Booking</h1>

          {isConfirmed ? (
            <div className="max-w-md mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-earth">Booking Requested</h2>
              <p className="mt-4 text-earth/70">
                Your booking has been recorded and you are being redirected to your dashboard.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-card shadow-card p-6">
                <h2 className="font-semibold text-earth mb-4">Booking Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-earth mb-2">Duration</label>
                    <select
                      value={duration}
                      onChange={(event) => setDuration(event.target.value as typeof duration)}
                      className="w-full h-12 px-4 border border-earth/15 rounded-md"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="w-full h-12 px-4 border border-earth/15 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="w-full h-12 px-4 border border-earth/15 rounded-md"
                    />
                  </div>
                  <div className="rounded-lg bg-sand/30 p-4 text-sm text-earth/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {listing
                        ? `${listing.title} • ${listing.area}, ${listing.city}`
                        : `Listing reference: ${listingId}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card shadow-card p-6">
                <h2 className="font-semibold text-earth mb-4">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-earth/10 hover:border-earth/20'
                      }`}
                    >
                      <span className="text-2xl">{method.logo}</span>
                      <span className="font-medium text-earth">{method.name}</span>
                    </button>
                  ))}
                </div>

                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-earth/70">
                    I agree to the terms of service and cancellation policy.
                  </span>
                </label>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-sm text-earth/60">
                  Total charge:{' '}
                  {new Intl.NumberFormat('en-MW', {
                    style: 'currency',
                    currency: 'MWK',
                    maximumFractionDigits: 0,
                  }).format(rentTotal + deposit)}
                </p>

                <Button
                  className="w-full mt-6"
                  onClick={handleBooking}
                  disabled={!agreedToTerms}
                  isLoading={isLoading}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
