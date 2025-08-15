import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email-service';

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { email: string; otp: string; expiresAt: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail } = await request.json();

    if (!newEmail) {
      return NextResponse.json({ error: 'New email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email is the same as current
    if (newEmail === user.email) {
      return NextResponse.json({ error: 'New email cannot be the same as current email' }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    const key = `email_${user.id}`;
    otpStorage.set(key, { email: newEmail, otp, expiresAt });

    // Send OTP via email
    const emailSent = await sendEmail({
      to: [newEmail],
      subject: 'Verify Your New Email Address - CFO Dashboard',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Email Verification</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-top: 0;">Verify Your New Email Address</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              You have requested to change your email address to <strong>${newEmail}</strong>.
              Please use the verification code below to confirm this change:
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Important:</strong> This verification code will expire in 10 minutes.
              If you didn't request this change, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This email was sent from CFO Dashboard. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
      isHtml: true
    });

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent to your new email address',
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Error sending email OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to clean expired OTPs
function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [key, value] of otpStorage.entries()) {
    if (value.expiresAt < now) {
      otpStorage.delete(key);
    }
  }
}

// Clean expired OTPs every minute
setInterval(cleanExpiredOTPs, 60000);

export { otpStorage };
