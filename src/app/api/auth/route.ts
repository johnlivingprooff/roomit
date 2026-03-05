import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth/session';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { createPublicUser, getUserByPhone, hasDatabase, isPublicUserRole } from '@/lib/db';
import { sendOTP, verifyOTP } from '@/lib/sms';

function buildFallbackUser(phone: string, role: 'renter' | 'host', name?: string) {
  return {
    id: `dev-${phone.replace(/[^\d+]/g, '')}`,
    phone,
    name: name || 'Development User',
    role,
    verified_status: 'none' as const,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, otp, name, role } = body as {
      action?: string;
      phone?: string;
      otp?: string;
      name?: string;
      role?: unknown;
    };

    if (action === 'send-otp') {
      if (!phone) {
        return NextResponse.json({ success: false, error: 'Phone number required.' }, { status: 400 });
      }

      if (role && !isPublicUserRole(role)) {
        return NextResponse.json(
          { success: false, error: 'Only renter and host accounts can be created here.' },
          { status: 403 },
        );
      }

      const result = await sendOTP(phone, {
        requestedRole: role,
        requestedName: typeof name === 'string' ? name.trim() : undefined,
      });

      return NextResponse.json(
        {
          success: result.success,
          message: result.message,
          debugCode: result.debugCode,
          error: result.success ? undefined : result.message,
        },
        { status: result.success ? 200 : 400 },
      );
    }

    if (action === 'verify-otp') {
      if (!phone || !otp) {
        return NextResponse.json(
          { success: false, error: 'Phone number and verification code are required.' },
          { status: 400 },
        );
      }

      const verification = await verifyOTP(phone, otp);

      if (!verification.success || !verification.requestedRole) {
        return NextResponse.json(
          { success: false, error: verification.message },
          { status: 400 },
        );
      }

      let user = null;

      if (hasDatabase) {
        try {
          user = await getUserByPhone(phone);

          if (!user) {
            user = await createPublicUser(phone, verification.requestedName, verification.requestedRole);
          }
        } catch (dbError) {
          console.error('Auth DB error during verify-otp:', dbError);
          return NextResponse.json(
            {
              success: false,
              error:
                process.env.NODE_ENV === 'production'
                  ? 'Authentication is unavailable right now.'
                  : `Authentication is unavailable right now: ${
                      dbError instanceof Error ? dbError.message : 'unknown database error'
                    }`,
            },
            { status: 503 },
          );
        }
      }

      const resolvedUser = user ?? buildFallbackUser(phone, verification.requestedRole, verification.requestedName);
      const response = NextResponse.json({
        success: true,
        message: 'Verified.',
        user: {
          id: resolvedUser.id,
          phone: resolvedUser.phone,
          name: resolvedUser.name,
          role: resolvedUser.role,
          verified_status: resolvedUser.verified_status,
        },
      });

      const sessionToken = await createSessionToken({
        id: resolvedUser.id,
        phone: resolvedUser.phone,
        role: resolvedUser.role,
      });

      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
