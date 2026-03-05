import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Shield, Wifi, Droplets, Zap } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getListingById, hasDatabase } from '@/lib/db';

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!hasDatabase) {
    return (
      <div className="min-h-full bg-cream">
        <Header />
        <main className="pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-card shadow-card p-8 text-center text-earth/70">
              Configure `DATABASE_URL` to load live listings.
            </div>
          </div>
        </main>
      </div>
    );
  }

  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-full bg-cream">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-card overflow-hidden bg-sand/30 h-72 flex items-center justify-center">
                {listing.photos?.[0] ? (
                  <Image
                    src={listing.photos[0]}
                    alt={listing.title}
                    width={1200}
                    height={720}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-earth/40">No photo available</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={listing.type === 'room' ? 'default' : 'premium'}>{listing.type}</Badge>
                  {listing.host?.verified_status === 'verified' && (
                    <Badge variant="verified">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified host
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-earth">{listing.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-earth/70">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>
                    {listing.area}, {listing.city}, {listing.country}
                  </span>
                </div>
              </div>

              <section className="bg-white rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth mb-4">Description</h2>
                <p className="text-earth/70 leading-relaxed">{listing.description}</p>
              </section>

              <section className="bg-white rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-earth mb-4">Amenities</h2>
                <div className="grid md:grid-cols-2 gap-4 text-earth/70">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Electricity: {listing.amenities.electricity}
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    Water: {listing.amenities.water}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary" />
                    WiFi: {listing.amenities.wifi ? 'Available' : 'Not available'}
                  </div>
                  <div className="flex items-center gap-2">
                    Furnished: {listing.amenities.furnished ? 'Yes' : 'No'}
                  </div>
                </div>
              </section>
            </div>

            <aside>
              <div className="bg-white rounded-card shadow-card p-6 sticky top-24">
                <p className="text-2xl font-bold text-primary">{formatPrice(listing.price_monthly)}/mo</p>
                <p className="text-sm text-earth/60 mt-1">
                  Daily: {formatPrice(listing.price_daily)} | Weekly: {formatPrice(listing.price_weekly)}
                </p>
                <p className="text-sm text-earth/60 mt-1">
                  Deposit: {formatPrice(listing.deposit_suggested)}
                </p>
                <div className="mt-6 space-y-3">
                  <Link href={`/booking/${listing.id}`}>
                    <Button className="w-full">Book this place</Button>
                  </Link>
                  <Button variant="secondary" className="w-full">
                    Contact Host
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
