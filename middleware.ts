import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { verifySessionToken } from '@/lib/auth/session';

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function redirectToDashboard(request: NextRequest, role: 'renter' | 'host' | 'admin') {
  const pathname =
    role === 'admin' ? '/admin' : role === 'host' ? '/dashboard/host' : '/dashboard/renter';
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const { pathname } = request.nextUrl;

  const requiresAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard/host') ||
    pathname.startsWith('/dashboard/renter') ||
    pathname.startsWith('/listing/create') ||
    pathname.startsWith('/booking/');

  if (!requiresAuth) {
    return NextResponse.next();
  }

  if (!session) {
    return redirectToLogin(request);
  }

  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return redirectToDashboard(request, session.role);
  }

  if (pathname.startsWith('/dashboard/host') && !['host', 'admin'].includes(session.role)) {
    return redirectToDashboard(request, session.role);
  }

  if (pathname.startsWith('/listing/create') && !['host', 'admin'].includes(session.role)) {
    return redirectToDashboard(request, session.role);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/listing/create', '/booking/:path*'],
};
