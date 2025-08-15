import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { sendSMS, formatPhoneNumber, generateOTPSMSMessage, validatePhoneNumber } from '@/lib/sms-service';

// In-memory OTP storage for phone (in production, use Redis or database)
const phoneOtpStorage = new Map<string, { phone: string; otp: string; expiresAt: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPhone } = await request.json();

    if (!newPhone) {
      return NextResponse.json({ error: 'New phone number is required' }, { status: 400 });
    }

    // Validate phone format
    if (!validatePhoneNumber(newPhone)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format. Please use international format (+1234567890)' 
      }, { status: 400 });
    }

    // Get current user phone from database
    const currentUser = await db
      .select({ phone: users.phone })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if phone is the same as current
    if (newPhone === currentUser[0].phone) {
      return NextResponse.json({ error: 'New phone number cannot be the same as current number' }, { status: 400 });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(newPhone);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    const key = `phone_${user.id}`;
    phoneOtpStorage.set(key, { phone: formattedPhone, otp, expiresAt });

    // Send OTP via SMS
    const smsMessage = generateOTPSMSMessage(otp, 'phone number verification');
    const smsResult = await sendSMS({ to: formattedPhone, message: smsMessage });

    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.error);
      return NextResponse.json({ 
        error: 'Failed to send OTP SMS: ' + (smsResult.error || 'Unknown error') 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to your new phone number',
      expiresIn: 600, // 10 minutes in seconds
      // For demo purposes, include OTP in response (remove in production)
      demoOTP: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Error sending phone OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to clean expired OTPs
function cleanExpiredPhoneOTPs() {
  const now = Date.now();
  for (const [key, value] of phoneOtpStorage.entries()) {
    if (value.expiresAt < now) {
      phoneOtpStorage.delete(key);
    }
  }
}

// Clean expired OTPs every minute
setInterval(cleanExpiredPhoneOTPs, 60000);

export { phoneOtpStorage };
