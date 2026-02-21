'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Heart, MessageSquare, Star, MoreVertical } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
  {
    id: '3',
    listing_title: 'Affordable Room in Zomba',
    listing_photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    start_date: '2024-01-10',
    end_date: '2024-01-20',
    status: 'completed',
    price: 15000,
    host_name: 'Peter Jones',
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

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-earth dark:text-cream">My Dashboard</h1>
            <p className="text-earth/60 dark:text-cream/60">Manage your bookings and saved listings</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-earth/10 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-3 font-medium transition-colors ${activeTab === 'bookings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                  }`}
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-3 font-medium transition-colors ${activeTab === 'saved'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                  }`}
              >
                <Heart className="w-5 h-5 inline mr-2" />
                Saved
              </button>
            </div>
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={booking.listing_photo}
                      alt={booking.listing_title}
                      className="w-full md:w-40 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-earth dark:text-cream">{booking.listing_title}</h3>
                        <Badge
                          variant={
                            booking.status === 'accepted' ? 'active' :
                              booking.status === 'pending' ? 'pending' : 'default'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-earth/60 dark:text-cream/60">
                        Host: {booking.host_name}
                      </p>
                      <p className="text-sm text-earth/60 dark:text-cream/60">
                        {booking.start_date} to {booking.end_date}
                      </p>
                      <p className="text-primary font-semibold mt-2">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Host
                      </Button>
                      {booking.status === 'completed' && (
                        <Button size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSaved.map((listing) => (
                <div key={listing.id} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={listing.listing_photo}
                      alt={listing.listing_title}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-charcoal/90 rounded-full flex items-center justify-center shadow-soft">
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-earth dark:text-cream">{listing.listing_title}</h3>
                    <p className="text-sm text-earth/60 dark:text-cream/60 mt-1">{listing.location}</p>
                    <p className="text-primary font-bold mt-2">
                      {formatPrice(listing.price_monthly)}/month
                    </p>
                    <Link href={`/listing/${listing.id}`}>
                      <Button className="w-full mt-4">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
              {mockSaved.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Heart className="w-12 h-12 text-earth/20 mx-auto mb-4" />
                  <p className="text-earth/60">No saved listings yet</p>
                  <Link href="/search">
                    <Button variant="secondary" className="mt-4">
                      Browse Listings
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
