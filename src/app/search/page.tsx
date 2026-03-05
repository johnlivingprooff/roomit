'use client';

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { ListingCard } from '@/components/ui/ListingCard';
import { Button } from '@/components/ui/Button';
import type { Listing } from '@/lib/types';

interface SearchFilters {
  type: '' | 'room' | 'house';
  minPrice: string;
  maxPrice: string;
  city: string;
  furnished: '' | 'true' | 'false';
}

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    furnished: '',
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (searchQuery) params.set('q', searchQuery);
        if (filters.type) params.set('type', filters.type);
        if (filters.city) params.set('city', filters.city);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.furnished) params.set('furnished', filters.furnished);

        const response = await fetch(`/api/listings?${params.toString()}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (!cancelled) {
          if (response.ok) {
            setListings(Array.isArray(data.listings) ? data.listings : []);
          } else {
            setListings([]);
            setError(data.error || 'Failed to load listings.');
          }
        }
      } catch {
        if (!cancelled) {
          setListings([]);
          setError('Failed to load listings.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      cancelled = true;
    };
  }, [filters, searchQuery]);

  return (
    <div className="min-h-full bg-cream">
      <Header />

      <main className="pt-20 pb-12">
        <div className="bg-white border-b border-earth/5 sticky top-16 z-40">
          <div className="container-soft py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth/40" />
                <input
                  type="text"
                  placeholder="Search by area, city..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-earth/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-sand/20 text-earth placeholder:text-earth/50"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowFilters((value) => !value)}>
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </Button>
                <div className="hidden md:flex border border-earth/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-sand/30 text-earth/50 hover:bg-sand/50'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-sand/30 text-earth/50 hover:bg-sand/50'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-5 bg-earth/5 rounded-xl border border-earth/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-medium text-earth">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-earth/50 hover:text-earth">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <select
                    value={filters.type}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        type: event.target.value as SearchFilters['type'],
                      }))
                    }
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald/20 text-earth"
                  >
                    <option value="">Property</option>
                    <option value="room">Room</option>
                    <option value="house">House</option>
                  </select>
                  <select
                    value={filters.city}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth"
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
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        minPrice: event.target.value,
                      }))
                    }
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        maxPrice: event.target.value,
                      }))
                    }
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth"
                  />
                  <select
                    value={filters.furnished}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        furnished: event.target.value as SearchFilters['furnished'],
                      }))
                    }
                    className="h-11 px-4 border border-earth/10 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-earth"
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

        <div className="container-soft py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-earth">{listings.length} properties found</p>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-earth/60">Loading listings...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : listings.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-earth/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-earth/20" />
              </div>
              <h3 className="text-xl font-serif font-medium text-earth">No listings found</h3>
              <p className="text-earth/70 mt-2">Try adjusting your filters or publish the first listing.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
