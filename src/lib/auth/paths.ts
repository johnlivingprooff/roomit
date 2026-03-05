import type { User } from '@/lib/types';

export function getDashboardPathForRole(role: User['role']) {
  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'host') {
    return '/dashboard/host';
  }

  return '/dashboard/renter';
}
