import Link from 'next/link';
import { MapPin, Star, Home, DoorOpen } from 'lucide-react';
import { Badge } from './Badge';
import type { Listing } from '@/lib/types';

interface ListingCardProps {
  listing: Listing;
  showPreviewWatermark?: boolean;
}

export function ListingCard({ listing, showPreviewWatermark }: ListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block">
      <div className="card card-hover group">
        <div className="relative aspect-[5/4] bg-sand/30 overflow-hidden">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-earth/40">
              <Home className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
          {showPreviewWatermark && (
            <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-white/95 text-earth font-medium px-6 py-3 rounded-full">
                Subscribe to View
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={listing.type === 'room' ? 'default' : 'premium'}>
              {listing.type === 'room' ? <DoorOpen className="w-3 h-3 mr-1.5" /> : <Home className="w-3 h-3 mr-1.5" />}
              {listing.type === 'room' ? 'Room' : 'House'}
            </Badge>
            {listing.host?.verified_status === 'verified' && (
              <Badge variant="verified">Verified</Badge>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-earth leading-tight">
            {listing.title}
          </h3>
          <div className="flex items-center text-sm text-earth mt-2">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{listing.area}, {listing.city}</span>
          </div>
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-earth/8">
            <div>
              <span className="font-serif text-xl font-semibold text-primary">
                {formatPrice(listing.price_daily)}
              </span>
              <span className="text-sm text-earth/70 ml-1">/ night</span>
            </div>
            {listing.average_rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-medium text-earth">{listing.average_rating.toFixed(1)}</span>
                <span className="text-sm text-earth/60">({listing.total_reviews || 0})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
