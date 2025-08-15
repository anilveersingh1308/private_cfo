import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { otpStorage } from '../send-email-otp/route';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail, otp } = await request.json();

    if (!newEmail || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Check OTP from storage
    const key = `email_${user.id}`;
    const storedOTP = otpStorage.get(key);

    if (!storedOTP) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 });
    }

    if (storedOTP.email !== newEmail) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 400 });
    }

    if (storedOTP.expiresAt < Date.now()) {
      otpStorage.delete(key);
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check if new email is already in use by another user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, newEmail))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== user.id) {
      return NextResponse.json({ error: 'This email is already in use by another account' }, { status: 400 });
    }

    // Update user email in database
    await db
      .update(users)
      .set({ 
        email: newEmail,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    // Remove OTP from storage
    otpStorage.delete(key);

    return NextResponse.json({ 
      success: true, 
      message: 'Email updated successfully',
      newEmail 
    });

  } catch (error) {
    console.error('Error verifying email OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
