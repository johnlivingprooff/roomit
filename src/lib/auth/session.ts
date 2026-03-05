import { SESSION_MAX_AGE_SECONDS } from './cookies';
import type { User } from '@/lib/types';

export interface SessionPayload {
  userId: string;
  role: User['role'];
  phone: string;
  issuedAt: number;
  expiresAt: number;
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'roomit-dev-auth-secret';
  }

  return null;
}

function encodePayload(payload: SessionPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(payload: string) {
  return JSON.parse(decodeURIComponent(payload)) as SessionPayload;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function createSignature(value: string) {
  const secret = getAuthSecret();

  if (!secret) {
    return null;
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toHex(signature);
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export async function createSessionToken(
  user: Pick<User, 'id' | 'phone' | 'role'>,
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
) {
  const issuedAt = Date.now();
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    phone: user.phone,
    issuedAt,
    expiresAt: issuedAt + maxAgeSeconds * 1000,
  };
  const encodedPayload = encodePayload(payload);
  const signature = await createSignature(encodedPayload);

  if (!signature) {
    throw new Error('AUTH_SECRET is not configured');
  }

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, receivedSignature] = token.split('.');

  if (!encodedPayload || !receivedSignature) {
    return null;
  }

  const expectedSignature = await createSignature(encodedPayload);

  if (!expectedSignature || !safeEqual(expectedSignature, receivedSignature)) {
    return null;
  }

  try {
    const payload = decodePayload(encodedPayload);

    if (!payload.userId || !payload.phone || !payload.role) {
      return null;
    }

    if (payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
