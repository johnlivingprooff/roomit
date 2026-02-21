'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home, Plus, Calendar, MessageSquare,
  Eye, DollarSign, Star, MoreVertical,
  Check, X, Shield
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/auth-store';

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
];

const stats = [
  { label: 'Total Listings', value: '2', icon: Home },
  { label: 'Total Bookings', value: '11', icon: Calendar },
  { label: 'Total Earnings', value: 'MWK 185K', icon: DollarSign },
  { label: 'Avg Rating', value: '4.7', icon: Star },
];

export default function HostDashboard() {
  const { user } = useAuthStore();
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

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-serif font-medium text-earth">
                Welcome back, {user?.name?.split(' ')[0] || 'Host'}
              </h1>
              <p className="text-earth/60 mt-1">Manage your properties and maximize your earnings.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-soft border border-earth/5 flex items-center gap-4 min-w-[240px]">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-earth">ID Verification</p>
                  <span className="text-xs text-earth/50">{user?.verified_status === 'verified' ? 'Fully Verified' : 'Action Required'}</span>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-primary">
                  Details
                </Button>
              </div>
              <Link href="/listing/create">
                <Button className="h-full px-6 bg-earth text-white border-earth hover:bg-earth/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-6 group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sand/30 rounded-xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <stat.icon className="w-6 h-6 text-earth group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-2xl font-serif font-medium text-earth">{stat.value}</p>
                    <p className="text-sm text-earth/40">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-earth/10 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'listings'
                ? 'text-primary'
                : 'text-earth/40 hover:text-earth/60'
                }`}
            >
              My Listings
              {activeTab === 'listings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'bookings'
                ? 'text-primary'
                : 'text-earth/40 hover:text-earth/60'
                }`}
            >
              Recent Bookings
              {activeTab === 'bookings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft overflow-hidden group hover:border-earth/10 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.photo}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge
                      variant={listing.status === 'active' ? 'active' : 'pending'}
                      className="absolute top-3 left-3"
                    >
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-medium text-lg text-earth truncate">{listing.title}</h3>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(listing.price_monthly)}/mo
                    </p>
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-earth/5 text-xs text-earth/50">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {listing.views} Views
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {listing.bookings} Bookings
                      </div>
                      <div className="flex items-center gap-1.2 ml-auto">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-earth font-medium">{listing.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
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
            <div className="grid gap-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-earth/5 shadow-soft p-5 hover:border-earth/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-serif font-medium text-earth truncate">{booking.listing_title}</h3>
                        <Badge
                          variant={
                            booking.status === 'accepted' ? 'active' :
                              booking.status === 'pending' ? 'pending' : 'error'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-earth/60">
                        {booking.renter_name} • {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-primary font-semibold mt-1">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-emerald text-white border-emerald hover:bg-emerald-dark">
                          <Check className="w-4 h-4 mr-1.5" />
                          Accept
                        </Button>
                        <Button variant="secondary" size="sm">
                          <X className="w-4 h-4 mr-1.5" />
                          Decline
                        </Button>
                      </div>
                    )}
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
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
