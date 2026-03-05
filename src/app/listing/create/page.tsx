'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, DoorOpen, DollarSign, Upload } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import type { Listing } from '@/lib/types';

type ListingFormState = {
  type: 'room' | 'house';
  title: string;
  description: string;
  area: string;
  city: string;
  country: string;
  price_daily: string;
  price_weekly: string;
  price_monthly: string;
  deposit_suggested: string;
  electricity: Listing['amenities']['electricity'];
  water: Listing['amenities']['water'];
  wifi: boolean;
  furnished: boolean;
  shared_bathroom: boolean;
  house_rules: string;
  photos: string[];
};

const initialState: ListingFormState = {
  type: 'room',
  title: '',
  description: '',
  area: '',
  city: '',
  country: 'Malawi',
  price_daily: '',
  price_weekly: '',
  price_monthly: '',
  deposit_suggested: '',
  electricity: 'partial',
  water: 'limited',
  wifi: false,
  furnished: false,
  shared_bathroom: true,
  house_rules: '',
  photos: [],
};

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = <K extends keyof ListingFormState>(field: K, value: ListingFormState[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const calculateSuggestedPrice = () => {
    const basePrices: Record<string, Record<ListingFormState['type'], number>> = {
      Lilongwe: { room: 35000, house: 120000 },
      Blantyre: { room: 30000, house: 100000 },
      Mzuzu: { room: 25000, house: 80000 },
      Zomba: { room: 20000, house: 60000 },
    };
    const cityPrices = basePrices[formData.city] || basePrices.Lilongwe;
    const base = cityPrices[formData.type];
    updateField('price_monthly', String(base));
    updateField('price_weekly', String(Math.round(base / 4)));
    updateField('price_daily', String(Math.round(base / 30)));
    updateField('deposit_suggested', String(Math.round(base * 0.5)));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          area: formData.area,
          city: formData.city,
          country: formData.country,
          price_daily: Number(formData.price_daily || 0),
          price_weekly: Number(formData.price_weekly || 0),
          price_monthly: Number(formData.price_monthly || 0),
          deposit_suggested: Number(formData.deposit_suggested || 0),
          amenities: {
            electricity: formData.electricity,
            water: formData.water,
            wifi: formData.wifi,
            furnished: formData.furnished,
            shared_bathroom: formData.shared_bathroom,
          },
          house_rules: formData.house_rules,
          photos: formData.photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create listing.');
        return;
      }

      setSuccess('Listing submitted. It is now pending verification.');
      router.push('/dashboard/host');
    } catch {
      setError('Failed to create listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-card shadow-card p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-earth">Create a Listing</h1>
              <p className="text-earth/60 mt-2">
                Publish a real listing to the database. New listings are saved as draft/pending for review.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth mb-3">Property Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateField('type', 'room')}
                    className={`p-6 rounded-card border-2 transition-colors ${
                      formData.type === 'room'
                        ? 'border-primary bg-primary/5'
                        : 'border-earth/15 hover:border-earth/30'
                    }`}
                  >
                    <DoorOpen className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'room' ? 'text-primary' : 'text-earth/40'}`} />
                    <span className="block font-medium text-earth">Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('type', 'house')}
                    className={`p-6 rounded-card border-2 transition-colors ${
                      formData.type === 'house'
                        ? 'border-primary bg-primary/5'
                        : 'border-earth/15 hover:border-earth/30'
                    }`}
                  >
                    <Home className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'house' ? 'text-primary' : 'text-earth/40'}`} />
                    <span className="block font-medium text-earth">House</span>
                  </button>
                </div>
              </div>

              <Input
                label="Listing Title"
                placeholder="e.g., Cozy room in Lilongwe"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Describe your property..."
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows={4}
              />

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Area"
                  placeholder="Area 3"
                  value={formData.area}
                  onChange={(event) => updateField('area', event.target.value)}
                />
                <Select
                  label="City"
                  value={formData.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  options={[
                    { value: '', label: 'Select city' },
                    { value: 'Lilongwe', label: 'Lilongwe' },
                    { value: 'Blantyre', label: 'Blantyre' },
                    { value: 'Mzuzu', label: 'Mzuzu' },
                    { value: 'Zomba', label: 'Zomba' },
                  ]}
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(event) => updateField('country', event.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-earth">Pricing</p>
                  <Button type="button" variant="secondary" onClick={calculateSuggestedPrice}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Suggest Prices
                  </Button>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <Input
                    label="Daily"
                    type="number"
                    value={formData.price_daily}
                    onChange={(event) => updateField('price_daily', event.target.value)}
                  />
                  <Input
                    label="Weekly"
                    type="number"
                    value={formData.price_weekly}
                    onChange={(event) => updateField('price_weekly', event.target.value)}
                  />
                  <Input
                    label="Monthly"
                    type="number"
                    value={formData.price_monthly}
                    onChange={(event) => updateField('price_monthly', event.target.value)}
                  />
                  <Input
                    label="Deposit"
                    type="number"
                    value={formData.deposit_suggested}
                    onChange={(event) => updateField('deposit_suggested', event.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Electricity"
                  value={formData.electricity}
                  onChange={(event) => updateField('electricity', event.target.value as ListingFormState['electricity'])}
                  options={[
                    { value: 'always', label: 'Always available' },
                    { value: 'partial', label: 'Partial/Intermittent' },
                    { value: 'rare', label: 'Rarely available' },
                  ]}
                />
                <Select
                  label="Water"
                  value={formData.water}
                  onChange={(event) => updateField('water', event.target.value as ListingFormState['water'])}
                  options={[
                    { value: 'available', label: 'Available' },
                    { value: 'limited', label: 'Limited' },
                    { value: 'rare', label: 'Rare' },
                  ]}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wifi}
                    onChange={(event) => updateField('wifi', event.target.checked)}
                    className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                  />
                  <span>WiFi available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(event) => updateField('furnished', event.target.checked)}
                    className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                  />
                  <span>Furnished</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shared_bathroom}
                    onChange={(event) => updateField('shared_bathroom', event.target.checked)}
                    className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                  />
                  <span>Shared bathroom</span>
                </label>
              </div>

              <div className="rounded-card border-2 border-dashed border-earth/20 p-6">
                <div className="flex items-center gap-3 text-earth/60 mb-3">
                  <Upload className="w-5 h-5" />
                  <p className="text-sm">Paste public image URLs, one per line (max 5).</p>
                </div>
                <Textarea
                  value={formData.photos.join('\n')}
                  onChange={(event) =>
                    updateField(
                      'photos',
                      event.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .slice(0, 5),
                    )
                  }
                  rows={4}
                  placeholder="https://example.com/photo-1.jpg"
                />
              </div>

              <Textarea
                label="House Rules"
                placeholder="List any rules guests should follow..."
                value={formData.house_rules}
                onChange={(event) => updateField('house_rules', event.target.value)}
                rows={4}
              />

              <div className="flex justify-end">
                <Button onClick={handleSubmit} isLoading={isLoading}>
                  Publish Listing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
