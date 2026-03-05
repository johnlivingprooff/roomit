import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { AuthBootstrap } from '@/components/auth/AuthBootstrap';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Roomie - Budget Room & House Rental',
  description: 'Find trusted rooms and houses in Malawi and Zimbabwe. Paywalled for trust, optimized for low bandwidth.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Roomie',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1F5E50',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background flex flex-col">
        <AuthBootstrap />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
