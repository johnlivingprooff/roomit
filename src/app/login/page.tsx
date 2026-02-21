'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/auth-store';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';

  const { setUser } = useAuthStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'renter' | 'host'>('renter');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          phone,
          name: isSignup ? name : undefined,
          role: isSignup ? role : undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to send OTP');
      } else {
        setStep('otp');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          phone,
          otp,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Invalid OTP');
      } else {
        // Store user in zustand store (persisted)
        setUser(data.user);

        // Redirect based on role
        if (data.user.role === 'host') {
          router.push('/dashboard/host');
        } else if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard/renter');
        }
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-medium text-earth">RoomIt</span>
          </Link>
          <h1 className="mt-8 text-3xl font-serif font-medium text-earth">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="mt-3 text-earth/70">
            {isSignup
              ? 'Join our trusted community'
              : 'Sign in to continue your search'
            }
          </p>
        </div>

        <div className="bg-white rounded-card shadow-soft p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              {isSignup && (
                <>
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-earth">I want to</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('renter')}
                        className={`p-4 rounded-xl border-2 transition-all ${role === 'renter'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-earth/10 hover:border-earth/20'
                          }`}
                      >
                        <span className="block font-medium text-earth">Find a Room</span>
                        <span className="text-sm text-earth/50">Browse listings</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('host')}
                        className={`p-4 rounded-xl border-2 transition-all ${role === 'host'
                          ? 'border-emerald bg-emerald/5'
                          : 'border-earth/10 hover:border-earth/20'
                          }`}
                      >
                        <span className="block font-medium text-earth">List Property</span>
                        <span className="text-sm text-earth/50">Become a host</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
              <Input
                label="Phone Number"
                placeholder="+265 XXX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-earth mb-3 block">
                  Enter the code sent to {phone}
                </label>
                <Input
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                Verify & Continue
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-earth/70 hover:text-earth"
              >
                Change phone number
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-earth/70">
          By continuing, you agree to our{' '}
          <a href="#" className="text-emerald hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-emerald hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-emerald rounded-xl flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="bg-white rounded-card shadow-soft p-8 flex justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
