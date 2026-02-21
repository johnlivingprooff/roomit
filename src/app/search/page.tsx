'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, LayoutGrid, List } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { ListingCard } from '@/components/ui/ListingCard';
import { Button } from '@/components/ui/Button';
import type { Listing } from '@/lib/types';

const mockListings: Listing[] = [
  {
    id: '1',
    host_id: '1',
    type: 'room',
    title: 'Cozy Room in Lilongwe',
    description: 'A nice room in a quiet neighborhood',
    area: 'Area 3',
    city: 'Lilongwe',
    country: 'Malawi',
    price_daily: 2500,
    price_weekly: 15000,
    price_monthly: 45000,
    deposit_suggested: 10000,
    amenities: {
      electricity: 'always',
      water: 'available',
      wifi: true,
      furnished: true,
      shared_bathroom: true,
    },
    house_rules: 'No smoking, quiet hours after 10pm',
    photos: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    host: {
      id: '1',
      phone: '+265999999999',
      role: 'host',
      name: 'John Doe',
      verified_status: 'verified',
      risk_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    average_rating: 4.8,
    total_reviews: 12,
  },
  {
    id: '2',
    host_id: '2',
    type: 'house',
    title: '2 Bedroom House in Blantyre',
    description: 'Spacious house with all amenities',
    area: 'Chichiri',
    city: 'Blantyre',
    country: 'Malawi',
    price_daily: 8000,
    price_weekly: 50000,
    price_monthly: 150000,
    deposit_suggested: 30000,
    amenities: {
      electricity: 'partial',
      water: 'available',
      wifi: true,
      furnished: false,
      shared_bathroom: false,
    },
    house_rules: 'No pets, no smoking indoors',
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.5,
    total_reviews: 8,
  },
  {
    id: '3',
    host_id: '3',
    type: 'room',
    title: 'Affordable Room in Zomba',
    description: 'Budget-friendly room for students',
    area: 'Chikanda',
    city: 'Zomba',
    country: 'Malawi',
    price_daily: 1500,
    price_weekly: 8000,
    price_monthly: 25000,
    deposit_suggested: 5000,
    amenities: {
      electricity: 'partial',
      water: 'limited',
      wifi: false,
      furnished: true,
      shared_bathroom: true,
    },
    house_rules: 'Quiet environment',
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.2,
    total_reviews: 5,
  },
  {
    id: '4',
    host_id: '4',
    type: 'house',
    title: 'Modern House in Mzuzu',
    description: 'Newly built house in quiet area',
    area: 'Chikanda',
    city: 'Mzuzu',
    country: 'Malawi',
    price_daily: 12000,
    price_weekly: 70000,
    price_monthly: 200000,
    deposit_suggested: 50000,
    amenities: {
      electricity: 'always',
      water: 'available',
      wifi: true,
      furnished: false,
      shared_bathroom: false,
    },
    house_rules: 'No smoking, no pets',
    photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 5.0,
    total_reviews: 3,
  },
  {
    id: '5',
    host_id: '5',
    type: 'room',
    title: 'Room near University',
    description: 'Perfect for students, close to LUANAR',
    area: 'Kenyatta',
    city: 'Lilongwe',
    country: 'Malawi',
    price_daily: 2000,
    price_weekly: 12000,
    price_monthly: 35000,
    deposit_suggested: 8000,
    amenities: {
      electricity: 'always',
      water: 'available',
      wifi: true,
      furnished: true,
      shared_bathroom: true,
    },
    house_rules: 'No smoking, respect quiet hours',
    photos: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.6,
    total_reviews: 20,
  },
  {
    id: '6',
    host_id: '6',
    type: 'house',
    title: 'Family House in Msundwe',
    description: 'Big house for families, secure area',
    area: 'Msundwe',
    city: 'Lilongwe',
    country: 'Malawi',
    price_daily: 15000,
    price_weekly: 90000,
    price_monthly: 280000,
    deposit_suggested: 60000,
    amenities: {
      electricity: 'partial',
      water: 'limited',
      wifi: false,
      furnished: false,
      shared_bathroom: false,
    },
    house_rules: 'Family-oriented, no parties',
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    status: 'active',
    verification_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.3,
    total_reviews: 7,
  },
];

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '' as '' | 'room' | 'house',
    minPrice: '',
    maxPrice: '',
    city: '',
    furnished: '' as '' | 'true' | 'false',
    electricity: '' as '' | 'always' | 'partial' | 'rare',
    water: '' as '' | 'available' | 'limited' | 'rare',
  });

  const filteredListings = mockListings.filter(listing => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!listing.title.toLowerCase().includes(query) &&
        !listing.city.toLowerCase().includes(query) &&
        !listing.area.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.city && listing.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.minPrice && listing.price_daily < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && listing.price_daily > parseInt(filters.maxPrice)) return false;
    if (filters.furnished && String(listing.amenities.furnished) !== filters.furnished) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-20 pb-12">
        {/* Search Header */}
        <div className="bg-white border-b border-earth/5 sticky top-16 z-40">
          <div className="container-soft py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth/40" />
                <input
                  type="text"
                  placeholder="Search by area, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-earth/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-sand/20 text-earth/50 dark:text-cream/50 placeholder:text-earth/50 dark:placeholder:text-cream/50"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </Button>
                <div className="hidden md:flex border border-earth/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-sand/30 text-earth/50 hover:bg-sand/50'
                      }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all duration-300 ${viewMode === 'list'
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-sand/30 text-earth/50 hover:bg-sand/50'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-5 bg-earth/5 rounded-xl border border-earth/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-medium text-earth">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-earth/50 hover:text-earth"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald/20 text-earth"
                  >
                    <option value="">Property</option>
                    <option value="room">Room</option>
                    <option value="house">House</option>
                  </select>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-cream/50 dark:bg-charcoal dark:text-cream/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth/50"
                  >
                    <option value="">City</option>
                    <option value="Lilongwe">Lilongwe</option>
                    <option value="Blantyre">Blantyre</option>
                    <option value="Mzuzu">Mzuzu</option>
                    <option value="Zomba">Zomba</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-cream/50 dark:bg-charcoal dark:text-cream/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth/50 placeholder:text-earth/50 dark:placeholder:text-cream/50"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-cream/50 dark:bg-charcoal dark:text-cream/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth/50 placeholder:text-earth/50 dark:placeholder:text-cream/50"
                  />
                  <select
                    value={filters.electricity}
                    onChange={(e) => setFilters({ ...filters, electricity: e.target.value as any })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-cream/50 dark:bg-charcoal dark:text-cream/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth/50"
                  >
                    <option value="">Electricity</option>
                    <option value="always">Always</option>
                    <option value="partial">Partial</option>
                    <option value="rare">Rare</option>
                  </select>
                  <select
                    value={filters.furnished}
                    onChange={(e) => setFilters({ ...filters, furnished: e.target.value as any })}
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-cream/50 dark:bg-charcoal dark:text-cream/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth/50"
                  >
                    <option value="">Furnished</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="container-soft py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-earth">
              {filteredListings.length} properties found
            </p>
            <select className="h-11 px-4 border border-earth/15 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald/30 text-earth">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Newest</option>
            </select>
          </div>

          {filteredListings.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
              }`}>
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-earth/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-earth/20" />
              </div>
              <h3 className="text-xl font-serif font-medium text-earth">No listings found</h3>
              <p className="text-earth/70 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
