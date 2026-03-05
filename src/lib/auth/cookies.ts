export const SESSION_COOKIE_NAME = 'roomit_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
