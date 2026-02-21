'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, DoorOpen, MapPin, DollarSign, Check,
  Upload, X, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Location' },
  { id: 3, name: 'Pricing' },
  { id: 4, name: 'Amenities' },
  { id: 5, name: 'Photos' },
  { id: 6, name: 'Rules' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: '' as 'room' | 'house' | '',
    title: '',
    description: '',
    area: '',
    city: '',
    country: 'Malawi',
    price_daily: '',
    price_weekly: '',
    price_monthly: '',
    deposit: '',
    electricity: '',
    water: '',
    wifi: false,
    furnished: false,
    shared_bathroom: false,
    house_rules: '',
    photos: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateSuggestedPrice = () => {
    if (!formData.city || !formData.type) return;
    // Simplified pricing logic
    const basePrices: Record<string, Record<string, number>> = {
      Lilongwe: { room: 35000, house: 120000 },
      Blantyre: { room: 30000, house: 100000 },
      Mzuzu: { room: 25000, house: 80000 },
      Zomba: { room: 20000, house: 60000 },
    };
    const cityPrices = basePrices[formData.city] || basePrices['Lilongwe'];
    const base = formData.type === 'room' ? cityPrices.room : cityPrices.house;
    updateField('price_monthly', String(base));
    updateField('price_weekly', String(Math.round(base / 4)));
    updateField('price_daily', String(Math.round(base / 30)));
    updateField('deposit', String(Math.round(base * 0.5)));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard/host');
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-earth">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-earth mb-3">Property Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('type', 'room')}
                  className={`p-6 rounded-card border-2 transition-colors ${formData.type === 'room'
                    ? 'border-primary bg-primary/5'
                    : 'border-earth/15 hover:border-earth/30'
                    }`}
                >
                  <DoorOpen className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'room' ? 'text-primary' : 'text-earth/40'}`} />
                  <span className="block font-medium text-earth">Room</span>
                  <span className="text-sm text-earth/60">Single room in a house</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('type', 'house')}
                  className={`p-6 rounded-card border-2 transition-colors ${formData.type === 'house'
                    ? 'border-primary bg-primary/5'
                    : 'border-earth/15 hover:border-earth/30'
                    }`}
                >
                  <Home className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'house' ? 'text-primary' : 'text-earth/40'}`} />
                  <span className="block font-medium text-earth">House</span>
                  <span className="text-sm text-earth/60">Entire house or apartment</span>
                </button>
              </div>
            </div>
            <Input
              label="Listing Title"
              placeholder="e.g., Cozy room in Lilongwe"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Describe your property..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-earth">Location</h2>
            <Select
              label="City"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              options={[
                { value: '', label: 'Select city' },
                { value: 'Lilongwe', label: 'Lilongwe' },
                { value: 'Blantyre', label: 'Blantyre' },
                { value: 'Mzuzu', label: 'Mzuzu' },
                { value: 'Zomba', label: 'Zomba' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Area"
              placeholder="e.g., Area 3, Chikanda"
              value={formData.area}
              onChange={(e) => updateField('area', e.target.value)}
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => updateField('country', e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-earth">Pricing</h2>
            <p className="text-sm text-earth/60">
              Set your rental prices. We suggest competitive rates based on your area.
            </p>
            <Button type="button" variant="secondary" onClick={calculateSuggestedPrice}>
              <DollarSign className="w-4 h-4 mr-2" />
              Get Suggested Prices
            </Button>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Daily Rate (MWK)"
                type="number"
                placeholder="0"
                value={formData.price_daily}
                onChange={(e) => updateField('price_daily', e.target.value)}
              />
              <Input
                label="Weekly Rate (MWK)"
                type="number"
                placeholder="0"
                value={formData.price_weekly}
                onChange={(e) => updateField('price_weekly', e.target.value)}
              />
              <Input
                label="Monthly Rate (MWK)"
                type="number"
                placeholder="0"
                value={formData.price_monthly}
                onChange={(e) => updateField('price_monthly', e.target.value)}
              />
            </div>
            <Input
              label="Security Deposit (MWK)"
              type="number"
              placeholder="0"
              value={formData.deposit}
              onChange={(e) => updateField('deposit', e.target.value)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-earth">Amenities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-earth mb-3">Electricity</label>
                <Select
                  value={formData.electricity}
                  onChange={(e) => updateField('electricity', e.target.value)}
                  options={[
                    { value: '', label: 'Select reliability' },
                    { value: 'always', label: 'Always available' },
                    { value: 'partial', label: 'Partial/Intermittent' },
                    { value: 'rare', label: 'Rarely available' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth mb-3">Water</label>
                <Select
                  value={formData.water}
                  onChange={(e) => updateField('water', e.target.value)}
                  options={[
                    { value: '', label: 'Select availability' },
                    { value: 'available', label: 'Available' },
                    { value: 'limited', label: 'Limited' },
                    { value: 'rare', label: 'Rare' },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wifi}
                  onChange={(e) => updateField('wifi', e.target.checked)}
                  className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                />
                <span>WiFi available</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => updateField('furnished', e.target.checked)}
                  className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                />
                <span>Furnished</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shared_bathroom}
                  onChange={(e) => updateField('shared_bathroom', e.target.checked)}
                  className="w-5 h-5 rounded border-earth/30 text-primary focus:ring-primary"
                />
                <span>Shared bathroom</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-earth">Photos</h2>
            <p className="text-sm text-earth/60">
              Add up to 5 photos of your property. Good photos increase bookings!
            </p>
            <div className="border-2 border-dashed border-earth/20 rounded-card p-8 text-center">
              <Upload className="w-12 h-12 text-earth/30 mx-auto mb-4" />
              <p className="text-earth/60">Click to upload photos</p>
              <p className="text-sm text-earth/40 mt-1">PNG, JPG up to 5MB each</p>
            </div>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => updateField('photos', formData.photos.filter((_, j) => j !== i))}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">House Rules</h2>
            <Textarea
              label="Rules & Guidelines"
              placeholder="List any rules guests should follow..."
              value={formData.house_rules}
              onChange={(e) => updateField('house_rules', e.target.value)}
              rows={6}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-sand text-earth/50'
                      }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? 'bg-primary' : 'bg-sand'
                      }`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-earth/50">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-card shadow-card p-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-earth/10">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              {currentStep < steps.length ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} isLoading={isLoading}>
                  Publish Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
