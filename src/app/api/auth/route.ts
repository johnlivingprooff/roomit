import { NextRequest, NextResponse } from 'next/server';
import { sendOTP, verifyOTP } from '@/lib/sms';
import { createUser, getUserByPhone } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, phone, otp, name, role } = body;

    if (action === 'send-otp') {
      if (!phone) {
        return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
      }

      // Create user if doesn't exist, or get existing
      let user;
      try {
        user = await getUserByPhone(phone);
      } catch (dbError) {
        console.error('DB connection error:', dbError);
        // Continue without database - allow OTP for demo
      }
      
      if (!user && name) {
        try {
          user = await createUser(phone, name, role || 'renter');
        } catch (dbError) {
          console.error('DB create error:', dbError);
        }
      }

      // Send OTP
      const result = await sendOTP(phone);
      
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent',
        devMode: true // Indicates demo mode
      });
    }

    if (action === 'verify-otp') {
      if (!phone || !otp) {
        return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });
      }

      const isValid = verifyOTP(phone, otp);
      
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      // Get or create user after verification
      let user;
      try {
        user = await getUserByPhone(phone);
      } catch (dbError) {
        console.error('DB error:', dbError);
      }
      
      if (!user && name) {
        try {
          user = await createUser(phone, name, role || 'renter');
        } catch (dbError) {
          // Create demo user for testing
          user = {
            id: 'demo-' + Date.now(),
            phone,
            name,
            role: role || 'renter',
            verified_status: 'none',
          };
        }
      }

      if (!user) {
        // Create demo user
        user = {
          id: 'demo-' + Date.now(),
          phone,
          name: name || 'Demo User',
          role: role || 'renter',
          verified_status: 'none',
        };
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Verified',
        devMode: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          verified_status: user.verified_status,
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
