import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { generateUniqueUsername } from '@/lib/username-utils';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      role,
      phone
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Generate unique username
    const existingUsernames = await db
      .select({ username: users.username })
      .from(users);
    
    const username = generateUniqueUsername(name, existingUsernames.map(u => u.username));

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        username,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        role: role || 'user',
        phone: phone || null,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    const userData = newUser[0];

    // Generate JWT token
    const token = await generateToken({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    // Set cookie
    const cookieData = setAuthCookie(token);
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        status: userData.status,
        created_at: userData.created_at,
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
