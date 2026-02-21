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
      'Save favorite places',
      'Basic support',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 3,
    description: 'For those who want the best experience',
    features: [
      'Everything in Basic',
      'Priority listing placement',
      'Verified host badge',
      'Analytics for hosts',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
];

const benefits = [
  { icon: Shield, title: 'Verified Community', desc: 'Every member is vetted' },
  { icon: Zap, title: 'Direct Contact', desc: 'No middlemen' },
  { icon: Star, title: 'Secure Bookings', desc: 'Protected transactions' },
];

const paymentMethods = [
  { id: 'ecocash', name: 'EcoCash', logo: '💰' },
  { id: 'airtel', name: 'Airtel Money', logo: '📱' },
  { id: 'tnm', name: 'TNM Mpamba', logo: '📲' },
];

export default function SubscribePage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState('basic');
  const [selectedPayment, setSelectedPayment] = useState('ecocash');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/search');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cream py-12 md:py-20">
      <div className="container-soft">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-earth">
            Join the Trusted Community
          </h1>
          <p className="mt-4 text-lg text-earth/70 max-w-2xl mx-auto">
            A small monthly contribution keeps our community safe, genuine, and focused on real connections.
          </p>
        </div>

        {/* Trust Badges */}
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

        {/* Tier Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-card p-8 transition-all cursor-pointer ${selectedTier === tier.id
                ? 'ring-2 ring-primary shadow-elevated'
                : 'hover:shadow-soft'
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
                {selectedTier === tier.id && (
                  <Check className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-earth mb-6">{tier.description}</p>
              <div className="mb-6">
                <span className="text-5xl font-serif font-medium text-primary">${tier.price}</span>
                <span className="text-earth/70 ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-earth">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-charcoal border border-earth/5 dark:border-earth/20 rounded-card p-6 shadow-soft">
            <h3 className="font-serif text-lg font-medium text-earth dark:text-cream mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${selectedPayment === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-earth/10 hover:border-earth/20'
                    }`}
                >
                  <span className="block text-2xl mb-1">{method.logo}</span>
                  <span className="text-xs font-medium text-earth/80 dark:text-cream/80">{method.name}</span>
                </button>
              ))}
            </div>

            {selectedPayment !== 'card' && (
              <div className="bg-sand/30 dark:bg-sand/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-earth/80 dark:text-cream/80">
                  You&apos;ll receive an SMS with payment instructions. Standard SMS rates may apply.
                </p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubscribe}
              isLoading={isLoading}
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  Unlock Access for ${tiers.find(t => t.id === selectedTier)?.price}/month
                </>
              )}
            </Button>

            <p className="text-center text-sm text-earth/60 dark:text-cream/60 mt-4">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
