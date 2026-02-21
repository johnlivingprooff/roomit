'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home, Plus, Calendar, MessageSquare, TrendingUp,
  Eye, DollarSign, Star, MoreVertical, Check, X
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock data
const mockListings = [
  {
    id: '1',
    title: 'Cozy Room in Lilongwe',
    type: 'room',
    status: 'active',
    views: 234,
    bookings: 8,
    rating: 4.8,
    price_monthly: 45000,
    photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
  },
  {
    id: '2',
    title: 'Spacious House in Blantyre',
    type: 'house',
    status: 'active',
    views: 156,
    bookings: 3,
    rating: 4.5,
    price_monthly: 150000,
    photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
  },
];

const mockBookings = [
  {
    id: '1',
    listing_id: '1',
    renter_name: 'Alice M.',
    start_date: '2024-02-01',
    end_date: '2024-02-28',
    status: 'pending',
    price: 45000,
    listing_title: 'Cozy Room in Lilongwe',
  },
  {
    id: '2',
    listing_id: '1',
    renter_name: 'Bob K.',
    start_date: '2024-01-15',
    end_date: '2024-01-31',
    status: 'accepted',
    price: 22500,
    listing_title: 'Cozy Room in Lilongwe',
  },
];

const stats = [
  { label: 'Total Listings', value: '2', icon: Home },
  { label: 'Total Bookings', value: '11', icon: Calendar },
  { label: 'Total Earnings', value: 'MWK 185K', icon: DollarSign },
  { label: 'Avg Rating', value: '4.7', icon: Star },
];

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');

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
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-earth dark:text-cream">Host Dashboard</h1>
              <p className="text-earth/60 dark:text-cream/60">Manage your listings and bookings</p>
            </div>
            <Link href="/listing/create">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Add Listing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-earth dark:text-cream">{stat.value}</p>
                    <p className="text-sm text-earth/60 dark:text-cream/60">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-earth/10 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('listings')}
                className={`pb-3 font-medium transition-colors ${activeTab === 'listings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                  }`}
              >
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-3 font-medium transition-colors ${activeTab === 'bookings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                  }`}
              >
                Booking Requests
              </button>
            </div>
          </div>

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockListings.map((listing) => (
                <div key={listing.id} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={listing.photo}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      variant={listing.status === 'active' ? 'active' : 'pending'}
                      className="absolute top-3 right-3"
                    >
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-earth dark:text-cream">{listing.title}</h3>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(listing.price_monthly)}/month
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-earth/60 dark:text-cream/60">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {listing.bookings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        {listing.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="dark:text-cream/60">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-earth dark:text-cream">{booking.listing_title}</h3>
                        <Badge
                          variant={
                            booking.status === 'accepted' ? 'active' :
                              booking.status === 'pending' ? 'pending' : 'error'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-earth/60 dark:text-cream/60">
                        {booking.renter_name} • {booking.start_date} to {booking.end_date}
                      </p>
                      <p className="text-primary font-semibold mt-1">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button variant="secondary" size="sm">
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
