import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/guards';
import { SESSION_COOKIE_NAME, getSessionCookieOptions } from '@/lib/auth/cookies';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    const response = NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      ...getSessionCookieOptions(),
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      verified_status: user.verified_status,
    },
  });
}
