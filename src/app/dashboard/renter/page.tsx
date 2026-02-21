'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Heart, MessageSquare, Shield,
  Search, Star, User, MoreVertical
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';

const mockBookings = [
  {
    id: '1',
    listing_title: 'Cozy Room in Lilongwe',
    listing_photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
    start_date: '2024-02-01',
    end_date: '2024-02-28',
    status: 'accepted',
    price: 45000,
    host_name: 'John Doe',
  },
  {
    id: '2',
    listing_title: 'Spacious House in Blantyre',
    listing_photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    start_date: '2024-03-01',
    end_date: '2024-03-15',
    status: 'pending',
    price: 75000,
    host_name: 'Jane Smith',
  },
];

const mockSaved = [
  {
    id: '4',
    listing_title: 'Modern House in Mzuzu',
    listing_photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    price_monthly: 200000,
    location: 'Mzuzu',
  },
];

export default function RenterDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved'>('bookings');

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

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-medium text-earth">
                Welcome back, {user?.name?.split(' ')[0] || 'Member'}
              </h1>
              <p className="text-earth/60 mt-1">Manage your search and stay organized.</p>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-earth/5 flex items-center gap-4 min-w-[240px]">
              <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald" />
              </div>
              <div>
                <p className="text-sm font-medium text-earth">Account Status</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                  <span className="text-xs text-earth/60 capitalize">{user?.verified_status || 'Basic Access'}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto text-emerald">
                Verify ID
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-earth/10 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'bookings'
                ? 'text-primary'
                : 'text-earth/40 hover:text-earth/60'
                }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              My Bookings
              {activeTab === 'bookings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'saved'
                ? 'text-primary'
                : 'text-earth/40 hover:text-earth/60'
                }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Saved Listings
              {activeTab === 'saved' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="grid gap-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-5 hover:border-earth/10 transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                      <img
                        src={booking.listing_photo}
                        alt={booking.listing_title}
                        className="w-full h-full rounded-xl object-cover"
                      />
                      <Badge
                        className="absolute top-2 left-2"
                        variant={
                          booking.status === 'accepted' ? 'active' :
                            booking.status === 'pending' ? 'pending' : 'default'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-serif font-medium text-earth truncate">{booking.listing_title}</h3>
                      <p className="text-sm text-earth/60 mt-1"> Hosted by {booking.host_name}</p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-earth/70">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="font-semibold text-earth">
                          {formatPrice(booking.price)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 justify-end">
                      <Button variant="secondary" size="sm" className="flex-1 md:flex-none">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSaved.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft overflow-hidden group">
                  <div className="relative h-48">
                    <img
                      src={listing.listing_photo}
                      alt={listing.listing_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card text-red-500">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-medium text-lg text-earth truncate">{listing.listing_title}</h3>
                    <p className="text-sm text-earth/50 mt-1">{listing.location}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-primary font-bold">
                        {formatPrice(listing.price_monthly)}/mo
                      </p>
                      <Link href={`/listing/${listing.id}`}>
                        <Button size="sm" variant="ghost">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {mockSaved.length === 0 && (
                <div className="col-span-full bg-white/50 border-2 border-dashed border-earth/10 rounded-2xl py-16 text-center">
                  <Heart className="w-12 h-12 text-earth/20 mx-auto mb-4" />
                  <p className="text-earth/60 font-medium">No saved spaces yet</p>
                  <Link href="/search">
                    <Button variant="secondary" className="mt-4">
                      Start Exploring
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
