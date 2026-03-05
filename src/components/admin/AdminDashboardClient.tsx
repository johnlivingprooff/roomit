'use client';

import { useState } from 'react';
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  Shield,
  Check,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  AdminBookingRecord,
  AdminDashboardStats,
  AdminListingRecord,
  AdminUserRecord,
} from '@/lib/db';

interface AdminDashboardClientProps {
  stats: AdminDashboardStats;
  users: AdminUserRecord[];
  listings: AdminListingRecord[];
  bookings: AdminBookingRecord[];
  dataUnavailable?: boolean;
}

type AdminTab = 'overview' | 'users' | 'listings' | 'bookings';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users },
  { key: 'activeListings', label: 'Active Listings', icon: Home },
  { key: 'totalBookings', label: 'Total Bookings', icon: Calendar },
  { key: 'totalRevenue', label: 'Revenue (MWK)', icon: DollarSign },
] as const;

export function AdminDashboardClient({
  stats,
  users,
  listings,
  bookings,
  dataUnavailable = false,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-earth dark:text-cream">Admin Dashboard</h1>
            <p className="text-earth/60 dark:text-cream/60">
              Manage users, listings, and platform settings
            </p>
          </div>

          {dataUnavailable && (
            <div className="mb-6 rounded-card border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Live admin data is currently unavailable. Verify `DATABASE_URL` and database access.
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat) => (
                <div
                  key={stat.key}
                  className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-earth dark:text-cream">
                    {stat.key === 'totalRevenue'
                      ? formatPrice(stats.totalRevenue)
                      : stats[stat.key].toLocaleString()}
                  </p>
                  <p className="text-sm text-earth/50 dark:text-cream/50">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-b border-earth/10 mb-6">
            <div className="flex gap-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'Users' },
                { id: 'listings', label: 'Listings' },
                { id: 'bookings', label: 'Bookings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`pb-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h3 className="font-semibold text-earth dark:text-cream mb-4">Pending Verifications</h3>
                <div className="space-y-3">
                  {listings
                    .filter((listing) => listing.verification_status === 'pending')
                    .map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-3 bg-sand/30 dark:bg-sand/10 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-earth dark:text-cream">{listing.title}</p>
                          <p className="text-sm text-earth/60 dark:text-cream/60">
                            by {listing.hostName || 'Unknown host'}
                          </p>
                        </div>
                        <Button size="sm" disabled>
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  {listings.filter((listing) => listing.verification_status === 'pending').length === 0 && (
                    <p className="text-earth/50 dark:text-cream/50 text-center py-4">
                      No pending verifications
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h3 className="font-semibold mb-4 text-earth dark:text-cream">Flagged Content</h3>
                <div className="space-y-3">
                  {listings
                    .filter((listing) => listing.status === 'flagged')
                    .map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="font-medium text-earth dark:text-cream">{listing.title}</p>
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                              Needs moderation
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="dark:text-cream/60" disabled>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  {listings.filter((listing) => listing.status === 'flagged').length === 0 && (
                    <p className="text-earth/50 dark:text-cream/50 text-center py-4">No flagged content</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand/30 dark:bg-sand/10 border-b border-earth/10 dark:border-earth/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Name</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Phone</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Role</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-earth/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <span className="text-sm font-medium">
                                {(user.name || 'U').charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-earth dark:text-cream">
                              {user.name || 'Unnamed user'}
                            </span>
                            {user.verified_status === 'verified' && (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">{user.phone}</td>
                        <td className="p-4">
                          <Badge variant={user.role === 'host' ? 'premium' : 'default'}>{user.role}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={user.status === 'active' ? 'active' : 'warning'}>
                            {user.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-earth/50">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand/30 dark:bg-sand/10 border-b border-earth/10 dark:border-earth/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Listing</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Host</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Status</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-earth/5">
                        <td className="p-4 font-medium text-earth dark:text-cream">{listing.title}</td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">
                          {listing.hostName || 'Unknown host'}
                        </td>
                        <td className="p-4">
                          <Badge variant={listing.status === 'active' ? 'active' : 'warning'}>
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="p-4">
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
                        </td>
                      </tr>
                    ))}
                    {listings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-earth/50">
                          No listings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand/30 dark:bg-sand/10 border-b border-earth/10 dark:border-earth/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Listing</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Renter</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Host</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Status</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-earth/5">
                        <td className="p-4 font-medium text-earth dark:text-cream">
                          {booking.listingTitle || 'Unknown listing'}
                        </td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">
                          {booking.renterName || 'Unknown renter'}
                        </td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">
                          {booking.hostName || 'Unknown host'}
                        </td>
                        <td className="p-4">
                          <Badge variant={booking.booking_status === 'completed' ? 'active' : 'warning'}>
                            {booking.booking_status}
                          </Badge>
                        </td>
                        <td className="p-4 text-earth dark:text-cream">
                          {formatPrice(booking.total_price)}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-earth/50">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
