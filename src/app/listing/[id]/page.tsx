'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Star, Wifi, Wind, Home, DoorOpen, Shield,
  ChevronLeft, ChevronRight, Calendar, Clock
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock listing data
const mockListing = {
  id: '1',
  host_id: '1',
  type: 'room' as const,
  title: 'Cozy Room in Lilongwe',
  description: 'A lovely room available in a quiet and secure neighborhood. The room is furnished with a bed, wardrobe, and desk. Perfect for students or working professionals. The house has reliable electricity and water supply.',
  area: 'Area 3',
  city: 'Lilongwe',
  country: 'Malawi',
  price_daily: 2500,
  price_weekly: 15000,
  price_monthly: 45000,
  deposit_suggested: 10000,
  amenities: {
    electricity: 'always' as const,
    water: 'available' as const,
    wifi: true,
    furnished: true,
    shared_bathroom: true,
  },
  house_rules: 'No smoking indoors. Quiet hours after 10pm. No pets. Guests must be registered.',
  photos: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
  ],
  status: 'active' as const,
  verification_status: 'approved' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  host: {
    id: '1',
    phone: '+265999999999',
    role: 'host' as const,
    name: 'John Doe',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    verified_status: 'verified' as const,
    risk_score: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  average_rating: 4.8,
  total_reviews: 12,
};

const mockReviews = [
  {
    id: '1',
    reviewer: { name: 'Alice M.', avatar: null },
    rating: 5,
    comment: 'Great place! Very clean and the host is very responsive.',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    reviewer: { name: 'Bob K.', avatar: null },
    rating: 4,
    comment: 'Good location, peaceful neighborhood. Would recommend.',
    created_at: '2024-01-10',
  },
  {
    id: '3',
    reviewer: { name: 'Carol S.', avatar: null },
    rating: 5,
    comment: 'Excellent value for money. Everything as described.',
    created_at: '2024-01-05',
  },
];

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [duration, setDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');

  const listing = mockListing;

  const getPrice = () => {
    switch (duration) {
      case 'daily': return listing.price_daily;
      case 'weekly': return listing.price_weekly;
      case 'monthly': return listing.price_monthly;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-20 pb-12">
        {/* Photo Gallery */}
        <div className="relative h-64 md:h-96 bg-sand/30">
          <img
            src={listing.photos[currentPhoto]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setCurrentPhoto((currentPhoto - 1 + listing.photos.length) % listing.photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentPhoto((currentPhoto + 1) % listing.photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPhoto(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentPhoto ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={listing.type === 'room' ? 'default' : 'premium'}>
                    {listing.type === 'room' ? 'Room' : 'House'}
                  </Badge>
                  {listing.host?.verified_status === 'verified' && (
                    <Badge variant="verified">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-earth dark:text-cream">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-earth/70 dark:text-cream/70">
                  <MapPin className="w-5 h-5 text-primary" />
                  {listing.area}, {listing.city}, {listing.country}
                </div>
                {listing.average_rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-secondary fill-secondary" />
                      <span className="font-semibold text-earth dark:text-cream">{listing.average_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-earth/60 dark:text-cream/60">({listing.total_reviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* Host Info */}
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card">
                {listing.host?.avatar_url ? (
                  <img
                    src={listing.host.avatar_url}
                    alt={listing.host.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {listing.host?.name?.[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-earth dark:text-cream">{listing.host?.name}</h3>
                  <p className="text-sm text-earth/60 dark:text-cream/60">Host</p>
                </div>
                <Button variant="secondary" size="sm">
                  Message
                </Button>
              </div>

              {/* Amenities */}
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth dark:text-cream mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-earth dark:text-cream">Electricity</p>
                      <p className="text-sm text-earth/60 dark:text-cream/60 capitalize">{listing.amenities.electricity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-earth dark:text-cream">Water</p>
                      <p className="text-sm text-earth/60 dark:text-cream/60 capitalize">{listing.amenities.water}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wifi className={`w-5 h-5 ${listing.amenities.wifi ? 'text-primary' : 'text-earth/30 dark:text-cream/20'}`} />
                    <div>
                      <p className="font-medium text-earth dark:text-cream">WiFi</p>
                      <p className="text-sm text-earth/60 dark:text-cream/60">{listing.amenities.wifi ? 'Available' : 'Not available'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className={`w-5 h-5 ${listing.amenities.furnished ? 'text-primary' : 'text-earth/30 dark:text-cream/20'}`} />
                    <div>
                      <p className="font-medium text-earth dark:text-cream">Furnished</p>
                      <p className="text-sm text-earth/50 dark:text-cream/50">{listing.amenities.furnished ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DoorOpen className={`w-5 h-5 ${listing.amenities.shared_bathroom ? 'text-primary' : 'text-earth/30 dark:text-cream/20'}`} />
                    <div>
                      <p className="font-medium text-earth dark:text-cream">Bathroom</p>
                      <p className="text-sm text-earth/50 dark:text-cream/50">{listing.amenities.shared_bathroom ? 'Shared' : 'Private'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth dark:text-cream mb-4">Description</h2>
                <p className="text-earth/70 dark:text-cream/70 leading-relaxed">{listing.description}</p>
              </div>

              {/* House Rules */}
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth dark:text-cream mb-4">House Rules</h2>
                <ul className="space-y-2">
                  {listing.house_rules.split('. ').filter(Boolean).map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-earth/70 dark:text-cream/70">
                      <span className="text-primary">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth dark:text-cream mb-4">Reviews</h2>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-earth/5 dark:border-earth/20 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {review.reviewer.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-earth dark:text-cream">{review.reviewer.name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-earth/20 dark:text-cream/20'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-earth/40 dark:text-cream/40">{review.created_at}</span>
                      </div>
                      <p className="text-earth/70 dark:text-cream/70">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <div className="mb-6">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(listing.price_daily)}
                  </span>
                  <span className="text-earth/60 dark:text-cream/60">/day</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-earth dark:text-cream mb-2 block">Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['daily', 'weekly', 'monthly'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`py-2 px-3 rounded-lg border-2 transition-colors ${duration === d
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-earth/10 dark:border-earth/20 text-earth/60 dark:text-cream/60 hover:border-earth/30'
                            }`}
                        >
                          <span className="block text-sm font-medium capitalize">{d}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth dark:text-cream mb-2 block">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="border-t border-earth/10 dark:border-earth/20 pt-4 space-y-2">
                    <div className="flex justify-between text-earth/70 dark:text-cream/70">
                      <span>{formatPrice(getPrice())} x 1 {duration}</span>
                      <span className="text-earth dark:text-cream font-medium">{formatPrice(getPrice())}</span>
                    </div>
                    <div className="flex justify-between text-earth/70 dark:text-cream/70">
                      <span>Deposit (refundable)</span>
                      <span className="text-earth dark:text-cream font-medium">{formatPrice(listing.deposit_suggested)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-earth dark:text-cream pt-2 border-t border-earth/10 dark:border-earth/20">
                      <span>Total</span>
                      <span>{formatPrice(getPrice() + listing.deposit_suggested)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push(`/booking/${listing.id}?duration=${duration}&date=${startDate}`)}
                  >
                    Request to Book
                  </Button>
                </div>

                <p className="text-sm text-earth/50 dark:text-cream/50 text-center mt-4">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
