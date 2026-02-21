'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, MapPin } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';

const mockListing = {
  id: '1',
  type: 'room' as const,
  title: 'Cozy Room in Lilongwe',
  area: 'Area 3',
  city: 'Lilongwe',
  price_daily: 2500,
  price_weekly: 15000,
  price_monthly: 45000,
  deposit_suggested: 10000,
  photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400'],
};

const paymentMethods = [
  { id: 'ecocash', name: 'EcoCash', logo: '💰' },
  { id: 'airtel', name: 'Airtel Money', logo: '📱' },
  { id: 'tnm', name: 'TNM Mpamba', logo: '📲' },
];

function BookingForm() {
  const searchParams = useSearchParams();
  const duration = (searchParams.get('duration') as 'daily' | 'weekly' | 'monthly') || 'daily';
  const startDate = searchParams.get('date') || '';

  const [selectedPayment, setSelectedPayment] = useState('ecocash');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const getPrice = () => {
    switch (duration) {
      case 'daily': return mockListing.price_daily;
      case 'weekly': return mockListing.price_weekly;
      case 'monthly': return mockListing.price_monthly;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBooking = async () => {
    if (!agreedToTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-earth dark:text-cream">Booking Requested!</h1>
        <p className="mt-4 text-earth/70 dark:text-cream/70">
          Your booking request has been sent to the host. You&apos;ll receive an SMS confirmation shortly.
        </p>
        <div className="mt-8 bg-white rounded-card shadow-card p-6 text-left">
          <h3 className="font-semibold text-earth mb-4">Booking Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-earth/50">Reference</span>
              <span className="font-mono text-earth">RI-2024-{Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth/50">Status</span>
              <span className="text-accent font-medium">Pending</span>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <Link href="/dashboard/renter">
            <Button className="w-full">View My Bookings</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
          <h2 className="font-semibold text-earth dark:text-cream mb-4">Booking Summary</h2>
          <div className="flex gap-4">
            <img
              src={mockListing.photos[0]}
              alt={mockListing.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-earth dark:text-cream">{mockListing.title}</p>
              <div className="flex items-center gap-1 text-sm text-earth/60 dark:text-cream/60 mt-1">
                <MapPin className="w-4 h-4 text-primary" />
                {mockListing.area}, {mockListing.city}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-earth/10 dark:border-earth/20 space-y-2">
            <div className="flex justify-between text-sm text-earth/80 dark:text-cream/80">
              <span className="text-earth/50 dark:text-cream/50">Duration</span>
              <span className="font-medium capitalize text-earth dark:text-cream">{duration}</span>
            </div>
            <div className="flex justify-between text-sm text-earth/80 dark:text-cream/80">
              <span className="text-earth/50 dark:text-cream/50">Start Date</span>
              <span className="font-medium text-earth dark:text-cream">{startDate || 'Not selected'}</span>
            </div>
            <div className="flex justify-between text-sm text-earth/80 dark:text-cream/80">
              <span className="text-earth/50 dark:text-cream/50">Property</span>
              <span className="font-medium capitalize text-earth dark:text-cream">{mockListing.type}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
          <h2 className="font-semibold text-earth dark:text-cream mb-4">Payment Method</h2>
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedPayment === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-earth/10 dark:border-earth/20 hover:border-earth/20'
                  }`}
              >
                <span className="text-2xl">{method.logo}</span>
                <span className="font-medium text-earth dark:text-cream">{method.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-earth/10 dark:border-earth/20 pt-4 space-y-2 text-earth/80 dark:text-cream/80">
            <div className="flex justify-between">
              <span>Rent ({duration})</span>
              <span className="text-earth dark:text-cream font-medium">{formatPrice(getPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span>Deposit (refundable)</span>
              <span className="text-earth dark:text-cream font-medium">{formatPrice(mockListing.deposit_suggested)}</span>
            </div>
            <div className="flex justify-between font-bold text-earth dark:text-cream pt-2 border-t border-earth/10 dark:border-earth/20">
              <span>Total to Pay</span>
              <span>{formatPrice(getPrice() + mockListing.deposit_suggested)}</span>
            </div>
          </div>

          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-earth/70 dark:text-cream/70">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline font-medium">Cancellation Policy</a>
            </span>
          </label>

          <Button
            className="w-full mt-6"
            onClick={handleBooking}
            disabled={!agreedToTerms}
            isLoading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-earth mb-8">Complete Your Booking</h1>

          <Suspense fallback={
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          }>
            <BookingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
