import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role,
      specialization,
      experience_years,
      phone,
      bio
    } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Username, email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        username,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        first_name,
        last_name,
        role: role || 'financial_advisor',
        specialization,
        experience_years,
        phone,
        bio,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    const userData = newUser[0];

    // Generate JWT token
    const token = await generateToken({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      first_name: userData.first_name || undefined,
      last_name: userData.last_name || undefined,
    });

    // Set cookie
    const cookieData = setAuthCookie(token);
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
        specialization: userData.specialization,
        experience_years: userData.experience_years,
      },
    });

    response.cookies.set(cookieData);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
