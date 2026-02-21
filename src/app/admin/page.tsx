'use client';

import { useState } from 'react';
import {
  Users, Home, Calendar, DollarSign, Shield,
  Flag, Check, X, Eye, AlertTriangle
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockStats = [
  { label: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
  { label: 'Active Listings', value: '456', icon: Home, change: '+5%' },
  { label: 'Total Bookings', value: '789', icon: Calendar, change: '+18%' },
  { label: 'Revenue (MWK)', value: '2.4M', icon: DollarSign, change: '+8%' },
];

const mockUsers = [
  { id: '1', name: 'John Doe', phone: '+265999999999', role: 'host', verified: true, status: 'active' },
  { id: '2', name: 'Jane Smith', phone: '+265888888888', role: 'renter', verified: false, status: 'active' },
  { id: '3', name: 'Bob Wilson', phone: '+265777777777', role: 'host', verified: true, status: 'suspended' },
];

const mockListings = [
  { id: '1', title: 'Cozy Room in Lilongwe', host: 'John Doe', status: 'active', verification: 'approved', reports: 0 },
  { id: '2', title: 'Spacious House', host: 'Jane Smith', status: 'active', verification: 'pending', reports: 0 },
  { id: '3', title: 'Nice Room', host: 'Bob Wilson', status: 'flagged', verification: 'rejected', reports: 3 },
];

const mockBookings = [
  { id: '1', listing: 'Cozy Room', renter: 'Alice M.', host: 'John Doe', status: 'completed', amount: 45000 },
  { id: '2', listing: 'Spacious House', renter: 'Bob K.', host: 'Jane Smith', status: 'pending', amount: 75000 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'bookings'>('overview');

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
            <h1 className="text-2xl font-bold text-earth dark:text-cream">Admin Dashboard</h1>
            <p className="text-earth/60 dark:text-cream/60">Manage users, listings, and platform settings</p>
          </div>

          {/* Stats */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {mockStats.map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-primary font-medium">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-earth dark:text-cream">{stat.value}</p>
                  <p className="text-sm text-earth/50 dark:text-cream/50">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
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
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-earth/50 dark:text-cream/50 hover:text-earth dark:hover:text-cream'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h3 className="font-semibold text-earth dark:text-cream mb-4">Pending Verifications</h3>
                <div className="space-y-3">
                  {mockListings.filter(l => l.verification === 'pending').map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-3 bg-sand/30 dark:bg-sand/10 rounded-lg">
                      <div>
                        <p className="font-medium text-earth dark:text-cream">{listing.title}</p>
                        <p className="text-sm text-earth/60 dark:text-cream/60">by {listing.host}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {mockListings.filter(l => l.verification === 'pending').length === 0 && (
                    <p className="text-earth/50 dark:text-cream/50 text-center py-4">No pending verifications</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-card p-6">
                <h3 className="font-semibold mb-4 text-earth dark:text-cream">Flagged Content</h3>
                <div className="space-y-3">
                  {mockListings.filter(l => l.reports > 0).map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium text-earth dark:text-cream">{listing.title}</p>
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{listing.reports} reports</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="dark:text-cream/60">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {mockListings.filter(l => l.reports > 0).length === 0 && (
                    <p className="text-earth/50 dark:text-cream/50 text-center py-4">No flagged content</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
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
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-earth/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <span className="text-sm font-medium">{user.name[0]}</span>
                            </div>
                            <span className="font-medium text-earth dark:text-cream">{user.name}</span>
                            {user.verified && (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">{user.phone}</td>
                        <td className="p-4">
                          <Badge variant={user.role === 'host' ? 'premium' : 'default'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={user.status === 'active' ? 'active' : 'error'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-error">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Listings Tab */}
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
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockListings.map((listing) => (
                      <tr key={listing.id} className="border-b border-earth/5">
                        <td className="p-4 font-medium text-earth dark:text-cream">{listing.title}</td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">{listing.host}</td>
                        <td className="p-4">
                          <Badge variant={listing.status === 'active' ? 'active' : 'error'}>
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              listing.verification === 'approved' ? 'active' :
                                listing.verification === 'pending' ? 'pending' : 'error'
                            }
                          >
                            {listing.verification}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sand/30 dark:bg-sand/10 border-b border-earth/10 dark:border-earth/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Booking ID</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Listing</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Renter</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Host</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Amount</th>
                      <th className="text-left p-4 font-medium text-earth dark:text-cream">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-earth/5">
                        <td className="p-4 font-mono text-sm text-earth dark:text-cream">#{booking.id}</td>
                        <td className="p-4 text-earth dark:text-cream">{booking.listing}</td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">{booking.renter}</td>
                        <td className="p-4 text-earth/50 dark:text-cream/50">{booking.host}</td>
                        <td className="p-4 font-medium text-earth dark:text-cream">{formatPrice(booking.amount)}</td>
                        <td className="p-4">
                          <Badge
                            variant={booking.status === 'completed' ? 'active' : 'pending'}
                          >
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
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
