import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from './cookies';
import { verifySessionToken } from './session';
import { getUserById } from '@/lib/db';
import type { User } from '@/lib/types';

export async function getAuthenticatedApiUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return {
      user: null,
      error: NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 }),
    };
  }

  try {
    const user = await getUserById(session.userId);

    if (user) {
      return { user, error: null };
    }
  } catch {
    // Fall through to cookie identity.
  }

  return {
    user: {
      id: session.userId,
      phone: session.phone,
      role: session.role,
      verified_status: 'none',
      risk_score: 0,
      created_at: '',
      updated_at: '',
    } as User,
    error: null,
  };
}

export async function requireApiUser(request: NextRequest, roles?: User['role'][]) {
  const result = await getAuthenticatedApiUser(request);

  if (!result.user) {
    return result;
  }

  if (roles && !roles.includes(result.user.role)) {
    return {
      user: null,
      error: NextResponse.json({ success: false, error: 'Forbidden.' }, { status: 403 }),
    };
  }

  return result;
}
