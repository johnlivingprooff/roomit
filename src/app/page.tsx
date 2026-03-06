import Image from 'next/image';
import Link from 'next/link';
import { Search, Shield, Smartphone, CreditCard, ArrowRight, Home, Users, Star } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';

const featuredProperties = [
  {
    id: 'featured-room-lilongwe',
    title: 'Skyline View Room',
    location: 'Victoria Island, Lagos',
    price: '$45/night',
    type: 'Room',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'featured-house-ikoyi',
    title: 'Modern High-Rise Apartment',
    location: 'Ikoyi, Lagos',
    price: '$120/night',
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'featured-penthouse-eko',
    title: 'Eko Atlantic Penthouse',
    location: 'Eko Atlantic, Lagos',
    price: '$180/night',
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-cream">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
            alt="Lagos skyline with high-rise buildings"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-cream/80" />
          <div className="container-soft relative py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-cream leading-[1.15] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                Comfort Within{' '}
                <span className="text-sand">Reach.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-cream/90 max-w-2xl mx-auto leading-relaxed">
                Rooms and homes designed for real life.
                Trusted spaces in Malawi & Zimbabwe.
              </p>

              {/* Search Box */}
              <div className="mt-10 bg-white rounded-card shadow-elevated p-2 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-5 bg-sand/30 rounded-lg">
                    <input
                      type="text"
                      placeholder="Search area or city..."
                      className="input-field border-0 shadow-none bg-transparent"
                    />
                  </div>
                  <div className="md:col-span-3 bg-sand/30 rounded-lg">
                    <select className="input-field border-0 shadow-none bg-transparent w-full">
                      <option value="">Property</option>
                      <option value="room">Room</option>
                      <option value="house">House</option>
                    </select>
                  </div>
                  <Link href="/search" className="md:col-span-4">
                    <Button className="w-full h-12">
                      <Search className="w-5 h-5 mr-2" />
                      Find a Room
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-spacing bg-white">
          <div className="container-soft">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-earth">
              How It Works
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-earth/8 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
                  <Search className="w-9 h-9 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium text-earth">1. Search</h3>
                <p className="mt-3 text-earth/60 leading-relaxed">
                  Browse verified listings in your area. Filter by budget, type, and amenities that matter to you.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-earth/8 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/10 transition-colors">
                  <Shield className="w-9 h-9 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-medium text-earth">2. Join</h3>
                <p className="mt-3 text-earth/60 leading-relaxed">
                  Subscribe to unlock all features. A small fee keeps our community safe and genuine.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-earth/8 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
                  <Home className="w-9 h-9 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium text-earth">3. Settle In</h3>
                <p className="mt-3 text-earth/60 leading-relaxed">
                  Connect with hosts, book with confidence, and enjoy your new space with peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="section-spacing bg-cream/60">
          <div className="container-soft">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-earth">
              Featured Properties
            </h2>
            <p className="mt-4 text-center text-earth/60 max-w-2xl mx-auto">
              Explore highlighted homes with strong demand and standout locations.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <article
                  key={property.id}
                  className="bg-white rounded-card overflow-hidden border border-earth/10 shadow-soft"
                >
                  <div className="relative h-56">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 text-earth text-xs font-medium px-3 py-1 rounded-full">
                      {property.type}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-serif font-medium text-earth">{property.title}</h3>
                    <p className="mt-1 text-earth/60">{property.location}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-primary font-semibold">{property.price}</span>
                      <Link href="/search">
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-spacing bg-cream">
          <div className="container-soft">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-earth">
              Why Roomie?
            </h2>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-card p-6 card-hover">
                <Shield className="w-10 h-10 text-emerald mb-4" />
                <h3 className="font-serif font-medium text-lg text-earth">Trust-First</h3>
                <p className="mt-2 text-sm text-earth/60">
                  ID verification and subscription model reduce fake listings.
                </p>
              </div>
              <div className="bg-white rounded-card p-6 card-hover">
                <Smartphone className="w-10 h-10 text-emerald mb-4" />
                <h3 className="font-serif font-medium text-lg text-earth">Mobile-First</h3>
                <p className="mt-2 text-sm text-earth/60">
                  Designed for low-bandwidth and offline use.
                </p>
              </div>
              <div className="bg-white rounded-card p-6 card-hover">
                <CreditCard className="w-10 h-10 text-emerald mb-4" />
                <h3 className="font-serif font-medium text-lg text-earth">Mobile Money</h3>
                <p className="mt-2 text-sm text-earth/60">
                  Pay with EcoCash, Airtel Money, or TNM Mpamba.
                </p>
              </div>
              <div className="bg-white rounded-card p-6 card-hover">
                <Users className="w-10 h-10 text-emerald mb-4" />
                <h3 className="font-serif font-medium text-lg text-earth">Shared Spaces</h3>
                <p className="mt-2 text-sm text-earth/60">
                  Find rooms in occupied houses, perfect for budget living.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="section-spacing bg-white">
          <div className="container-soft">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-earth">
              Simple, Fair Pricing
            </h2>
            <p className="mt-4 text-center text-earth/60 max-w-2xl mx-auto">
              A small monthly contribution keeps our community safe, genuine, and focused on real connections.
            </p>
            <div className="mt-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <div className="border border-earth/10 rounded-card p-8 card-hover">
                <h3 className="font-serif text-2xl font-medium text-earth">Basic</h3>
                <p className="mt-2 text-4xl font-serif font-medium text-emerald">
                  $1<span className="text-lg font-normal text-earth/50">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-emerald" />
                    <span>Browse all listings</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-emerald" />
                    <span>Message hosts</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-emerald" />
                    <span>Make bookings</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-emerald" />
                    <span>Save favorites</span>
                  </li>
                </ul>
                <Link href="/subscribe">
                  <Button variant="secondary" className="w-full mt-8">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="border-2 border-primary/20 rounded-card p-8 relative bg-primary/[0.02]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h3 className="font-serif text-2xl font-medium text-earth">Premium</h3>
                <p className="mt-2 text-4xl font-serif font-medium text-emerald">
                  $3<span className="text-lg font-normal text-earth/50">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Star className="w-5 h-5 text-terracotta" />
                    <span>Priority placement</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Verified badge</span>
                  </li>
                  <li className="flex items-center gap-3 text-earth/70">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Host analytics</span>
                  </li>
                </ul>
                <Link href="/subscribe">
                  <Button className="w-full mt-8">
                    Unlock Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-spacing bg-earth text-cream">
          <div className="container-soft text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium">
              Ready to Find Your Space?
            </h2>
            <p className="mt-4 text-cream/70 max-w-xl mx-auto">
              Join thousands of renters and hosts across Malawi & Zimbabwe.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button variant="secondary" size="lg" className="bg-cream text-earth border-cream hover:bg-cream/90">
                  Explore Homes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login?signup=true">
                <Button
                  size="lg"
                  className="bg-emerald text-white border-emerald hover:bg-emerald-dark"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
