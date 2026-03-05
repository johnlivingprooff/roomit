import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME } from './cookies';
import { verifySessionToken } from './session';
import { getDashboardPathForRole } from './paths';
import { getUserById } from '@/lib/db';
import type { User } from '@/lib/types';

export async function getCurrentSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  try {
    const user = await getUserById(session.userId);

    if (user) {
      return user;
    }
  } catch {
    // Fall back to cookie identity when the database is unavailable.
  }

  return {
    id: session.userId,
    phone: session.phone,
    role: session.role,
    verified_status: 'none',
    risk_score: 0,
    created_at: '',
    updated_at: '',
  } as User;
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function requireRole(roles: User['role'][]) {
  const user = await requireAuthenticatedUser();

  if (!roles.includes(user.role)) {
    redirect(getDashboardPathForRole(user.role));
  }

  return user;
}

export async function requireAdminUser() {
  return requireRole(['admin']);
}
