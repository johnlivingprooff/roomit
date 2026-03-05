import { createHash } from 'node:crypto';
import {
  deleteOtpChallenge,
  getOtpChallenge,
  hasDatabase,
  isPublicUserRole,
  saveOtpChallenge,
  type OtpChallengeRecord,
  type PublicUserRole,
} from './db';

const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY;
const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME;
const AFRICASTALKING_SENDER_ID = process.env.AFRICASTALKING_SENDER_ID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const SMS_PROVIDER = process.env.SMS_PROVIDER || 'africastalking';
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_SENDS_PER_HOUR = 5;
const OTP_MAX_VERIFY_ATTEMPTS = 5;

type SendOtpResult = {
  success: boolean;
  message: string;
  debugCode?: string;
};

type VerifyOtpResult = {
  success: boolean;
  message: string;
  requestedRole?: PublicUserRole;
  requestedName?: string;
};

type MemoryOtpRecord = OtpChallengeRecord;

const memoryOtpStore = new Map<string, MemoryOtpRecord>();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOTP(otp: string) {
  return createHash('sha256').update(otp).digest('hex');
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function canUseConfiguredProvider() {
  if (SMS_PROVIDER === 'africastalking') {
    return Boolean(AFRICASTALKING_API_KEY && AFRICASTALKING_USERNAME);
  }

  if (SMS_PROVIDER === 'twilio') {
    return Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
  }

  return false;
}

function nowIso() {
  return new Date().toISOString();
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  return phoneRegex.test(phoneNumber);
}

async function getStoredChallenge(phoneNumber: string) {
  if (hasDatabase) {
    try {
      return await getOtpChallenge(phoneNumber);
    } catch {
      if (isProduction()) {
        throw new Error('OTP storage is unavailable');
      }
    }
  }

  return memoryOtpStore.get(phoneNumber) ?? null;
}

async function persistChallenge(challenge: OtpChallengeRecord) {
  if (hasDatabase) {
    try {
      await saveOtpChallenge(challenge);
      return;
    } catch {
      if (isProduction()) {
        throw new Error('OTP storage is unavailable');
      }
    }
  }

  memoryOtpStore.set(challenge.phone, challenge);
}

async function removeChallenge(phoneNumber: string) {
  if (hasDatabase) {
    try {
      await deleteOtpChallenge(phoneNumber);
      return;
    } catch {
      if (isProduction()) {
        throw new Error('OTP storage is unavailable');
      }
    }
  }

  memoryOtpStore.delete(phoneNumber);
}

function resolveRequestedRole(role: unknown): PublicUserRole {
  return isPublicUserRole(role) ? role : 'renter';
}

export async function sendOTP(
  phoneNumber: string,
  options: { requestedRole?: unknown; requestedName?: string } = {},
): Promise<SendOtpResult> {
  if (!isValidPhoneNumber(phoneNumber)) {
    return {
      success: false,
      message: 'Invalid phone number format. Please use international format (e.g. +265...).',
    };
  }

  const existing = await getStoredChallenge(phoneNumber);
  const now = Date.now();

  if (existing) {
    const lastSentAt = new Date(existing.last_sent_at).getTime();
    const windowStartedAt = new Date(existing.send_window_started_at).getTime();

    if (now - lastSentAt < OTP_RESEND_COOLDOWN_MS) {
      return {
        success: false,
        message: 'Please wait before requesting another code.',
      };
    }

    if (now - windowStartedAt < 60 * 60 * 1000 && existing.send_count >= OTP_MAX_SENDS_PER_HOUR) {
      return {
        success: false,
        message: 'Too many code requests. Try again later.',
      };
    }
  }

  const otp = generateOTP();
  const requestedRole = resolveRequestedRole(options.requestedRole);
  const shouldResetWindow =
    !existing || now - new Date(existing.send_window_started_at).getTime() >= 60 * 60 * 1000;
  const challenge: OtpChallengeRecord = {
    phone: phoneNumber,
    code_hash: hashOTP(otp),
    requested_role: requestedRole,
    requested_name: options.requestedName ?? existing?.requested_name ?? null,
    attempts: 0,
    send_count: shouldResetWindow ? 1 : (existing?.send_count ?? 0) + 1,
    send_window_started_at: shouldResetWindow ? nowIso() : existing!.send_window_started_at,
    last_sent_at: new Date(now).toISOString(),
    expires_at: new Date(now + OTP_EXPIRY_MS).toISOString(),
  };

  await persistChallenge(challenge);

  const message = `Your RoomIt verification code is: ${otp}. Valid for 10 minutes.`;
  const providerConfigured = canUseConfiguredProvider();

  if (!providerConfigured) {
    if (isProduction()) {
      return {
        success: false,
        message: 'SMS delivery is not configured.',
      };
    }

    return {
      success: true,
      message: 'OTP generated in development mode.',
      debugCode: otp,
    };
  }

  try {
    if (SMS_PROVIDER === 'africastalking') {
      await sendViaAfricaTalking(phoneNumber, message);
    } else {
      await sendViaTwilio(phoneNumber, message);
    }

    return { success: true, message: 'OTP sent successfully.' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP.',
    };
  }
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<VerifyOtpResult> {
  const challenge = await getStoredChallenge(phoneNumber);

  if (!challenge) {
    return { success: false, message: 'No verification code found. Request a new code.' };
  }

  const expiresAt = new Date(challenge.expires_at).getTime();

  if (Date.now() > expiresAt) {
    await removeChallenge(phoneNumber);
    return { success: false, message: 'Verification code expired.' };
  }

  if (challenge.attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
    await removeChallenge(phoneNumber);
    return { success: false, message: 'Too many failed attempts. Request a new code.' };
  }

  const hashedOtp = hashOTP(otp);

  if (hashedOtp !== challenge.code_hash) {
    await persistChallenge({
      ...challenge,
      attempts: challenge.attempts + 1,
    });

    return { success: false, message: 'Invalid verification code.' };
  }

  await removeChallenge(phoneNumber);

  return {
    success: true,
    message: 'Verified.',
    requestedRole: challenge.requested_role,
    requestedName: challenge.requested_name ?? undefined,
  };
}

async function sendViaAfricaTalking(to: string, message: string) {
  const formattedNumber = to.startsWith('+') ? to : `+${to}`;
  const isSandbox = AFRICASTALKING_USERNAME === 'sandbox';
  const baseUrl = isSandbox
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  const params: Record<string, string> = {
    username: AFRICASTALKING_USERNAME!,
    to: formattedNumber,
    message,
  };

  if (AFRICASTALKING_SENDER_ID && !isSandbox) {
    params.from = AFRICASTALKING_SENDER_ID;
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      ApiKey: AFRICASTALKING_API_KEY!,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams(params),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Africa's Talking error: ${result.errorMessage || response.statusText}`);
  }

  return result;
}

async function sendViaTwilio(to: string, message: string) {
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER!,
        Body: message,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Twilio error: ${response.statusText}`);
  }

  return response.json();
}
