'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

export function AuthBootstrap() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (!cancelled) {
          if (response.ok) {
            const data = await response.json();
            setUser(data.user ?? null);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [setLoading, setUser]);

  return null;
}
