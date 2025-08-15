import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { phoneOtpStorage } from '../send-phone-otp/route';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPhone, otp } = await request.json();

    if (!newPhone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    // Check OTP from storage
    const key = `phone_${user.id}`;
    const storedOTP = phoneOtpStorage.get(key);

    if (!storedOTP) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 });
    }

    if (storedOTP.phone !== newPhone) {
      return NextResponse.json({ error: 'Phone number mismatch' }, { status: 400 });
    }

    if (storedOTP.expiresAt < Date.now()) {
      phoneOtpStorage.delete(key);
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check if new phone is already in use by another user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, newPhone))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== user.id) {
      return NextResponse.json({ error: 'This phone number is already in use by another account' }, { status: 400 });
    }

    // Update user phone in database
    await db
      .update(users)
      .set({ 
        phone: newPhone,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    // Remove OTP from storage
    phoneOtpStorage.delete(key);

    return NextResponse.json({ 
      success: true, 
      message: 'Phone number updated successfully',
      newPhone 
    });

  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
