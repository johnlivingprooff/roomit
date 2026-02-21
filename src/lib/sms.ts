// SMS Service for sending OTPs
// Supports: Africa's Talking, Twilio

const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY;
const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME;
const AFRICASTALKING_SENDER_ID = process.env.AFRICASTALKING_SENDER_ID;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'africastalking'; // 'africastalking' | 'twilio'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// In-memory OTP store (use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function isValidPhoneNumber(phoneNumber: string): boolean {
  // E.164 format: + followed by country code and then number (total 7-15 digits)
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  return phoneRegex.test(phoneNumber);
}

export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  // Validate phone number format first
  if (!isValidPhoneNumber(phoneNumber)) {
    console.error('Invalid phone number format:', phoneNumber);
    return { success: false, message: 'Invalid phone number format. Please use international format (e.g., +254...)' };
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP (in production, use Redis)
  otpStore.set(phoneNumber, { otp, expiresAt });

  const message = `Your RoomIt verification code is: ${otp}. Valid for 10 minutes.`;

  try {
    if (SMS_PROVIDER === 'africastalking' && AFRICASTALKING_API_KEY) {
      await sendViaAfricaTalking(phoneNumber, message);
    } else if (SMS_PROVIDER === 'twilio' && TWILIO_ACCOUNT_SID) {
      await sendViaTwilio(phoneNumber, message);
    } else {
      // Fallback: log to console (for development)
      console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
      return { success: true, message: 'OTP sent (dev mode)' };
    }

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to send OTP' };
  }
}

export function verifyOTP(phoneNumber: string, otp: string): boolean {
  const stored = otpStore.get(phoneNumber);

  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }

  if (stored.otp === otp) {
    otpStore.delete(phoneNumber);
    return true;
  }

  return false;
}

async function sendViaAfricaTalking(to: string, message: string) {
  // Africa's Talking requires E.164 format (with +)
  const formattedNumber = to.startsWith('+') ? to : `+${to}`;

  const isSandbox = AFRICASTALKING_USERNAME === 'sandbox';
  const baseUrl = isSandbox
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  const params: Record<string, string> = {
    username: AFRICASTALKING_USERNAME!,
    to: formattedNumber,
    message: message,
  };

  // Add sender ID if configured
  if (AFRICASTALKING_SENDER_ID && !isSandbox) {
    params.from = AFRICASTALKING_SENDER_ID;
  }

  console.log(`Sending SMS via Africa's Talking (${isSandbox ? 'Sandbox' : 'Live'}):`, {
    to: formattedNumber,
    username: AFRICASTALKING_USERNAME
  });

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'ApiKey': AFRICASTALKING_API_KEY!,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams(params),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Africa\'s Talking API Error:', result);
    throw new Error(`Africa's Talking error: ${result.errorMessage || response.statusText}`);
  }

  console.log('Africa\'s Talking Response:', JSON.stringify(result, null, 2));
  return result;
}

async function sendViaTwilio(to: string, message: string) {
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER!,
        Body: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Twilio error: ${response.statusText}`);
  }

  return response.json();
}
