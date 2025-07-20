import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieData = clearAuthCookie();
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    response.cookies.set(cookieData);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
