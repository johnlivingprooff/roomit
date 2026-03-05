'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Shield, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 1,
    description: 'Everything you need to find your next home',
    features: [
      'Browse all verified listings',
      'Message hosts directly',
      'Make and manage bookings',
      'Basic support',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 3,
    description: 'For hosts and renters who need more',
    features: [
      'Everything in Basic',
      'Priority listing placement',
      'Verified host badge',
      'Priority support',
    ],
    popular: true,
  },
] as const;

const benefits = [
  { icon: Shield, title: 'Verified Community', desc: 'Every member is vetted' },
  { icon: Zap, title: 'Direct Contact', desc: 'No middlemen' },
  { icon: Star, title: 'Secure Bookings', desc: 'Protected transactions' },
];

export default function SubscribePage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier: selectedTier }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update subscription.');
        return;
      }

      router.push('/search');
    } catch {
      setError('Failed to update subscription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-cream py-12 md:py-20">
      <div className="container-soft">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-earth">
            Join the Trusted Community
          </h1>
          <p className="mt-4 text-lg text-earth/70 max-w-2xl mx-auto">
            A small monthly contribution keeps the community safe and usable.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-earth">{benefit.title}</p>
                <p className="text-sm text-earth/70">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-card p-8 transition-all cursor-pointer ${
                selectedTier === tier.id ? 'ring-2 ring-primary shadow-elevated' : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl font-medium text-earth">{tier.name}</h3>
                {selectedTier === tier.id && <Check className="w-6 h-6 text-primary" />}
              </div>
              <p className="text-earth mb-6">{tier.description}</p>
              <div className="mb-6">
                <span className="text-5xl font-serif font-medium text-primary">${tier.price}</span>
                <span className="text-earth/70 ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-earth">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white border border-earth/5 rounded-card p-6 shadow-soft">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <Button className="w-full" size="lg" onClick={handleSubscribe} isLoading={isLoading}>
              Unlock Access for ${tiers.find((tier) => tier.id === selectedTier)?.price}/month
            </Button>
            <p className="text-center text-sm text-earth/60 mt-4">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
