'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from './Button';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Explore', icon: Search },
  ];

  const userLinks = user
    ? user.role === 'host'
      ? [{ href: '/dashboard/host', label: 'Dashboard', icon: LayoutDashboard }]
      : [{ href: '/dashboard/renter', label: 'Dashboard', icon: LayoutDashboard }]
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-cream'
        }`}
    >
      <div className="container-soft h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-serif font-medium text-earth">Roomie</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${pathname === link.href
                ? 'text-primary'
                : 'text-earth/60 hover:text-earth'
                }`}
            >
              {link.label}
            </Link>
          ))}
          {userLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${pathname.startsWith(link.href)
                ? 'text-primary'
                : 'text-earth/60 hover:text-earth'
                }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'renter' && (
            <Link
              href="/dashboard/host"
              className="text-sm font-medium text-emerald hover:text-emerald-dark transition-colors"
            >
              Become a Host
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/subscribe" className="text-sm font-medium text-earth/60 hover:text-earth transition-colors">
                {user.role === 'host' ? 'Premium Tools' : 'Upgrade Plan'}
              </Link>
              <div className="h-4 w-px bg-earth/10" />
              <Link href={user.role === 'host' ? '/dashboard/host' : '/dashboard/renter'} className="flex items-center gap-2 group">
                <span className="text-sm font-medium text-earth group-hover:text-primary transition-colors">
                  {user.name || 'Account'}
                </span>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-earth/40 hover:text-accent transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-earth">Log in</Button>
              </Link>
              <Link href="/login?signup=true">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 text-earth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-earth/5">
          <nav className="container-soft py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === link.href
                  ? 'bg-primary/5 text-primary'
                  : 'text-earth/60 hover:bg-sand/30'
                  }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith(link.href)
                  ? 'bg-primary/5 text-primary'
                  : 'text-earth/60 hover:bg-sand/30'
                  }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-4 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">Log in</Button>
                </Link>
                <Link href="/login?signup=true" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-accent w-full"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
