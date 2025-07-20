import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, consultations, invoices } from '@/lib/schema';
import { eq, desc, count, sum } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build query conditions
    const conditions = [];
    if (role) conditions.push(eq(users.role, role as any));
    if (status) conditions.push(eq(users.status, status as any));

    // Fetch users with optional filtering
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        phone: users.phone,
        location: users.location,
        consultations_count: users.consultations_count,
        total_spent: users.total_spent,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
      .from(users)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(users.created_at));

    return NextResponse.json({
      success: true,
      data: userList,
      count: userList.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, phone, location } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        role,
        phone: phone || null,
        location: location || null,
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // default password: "password"
        status: 'active',
        consultations_count: 0,
        total_spent: '0'
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newUser[0],
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, role, phone, location, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set({
        name,
        email,
        role,
        phone,
        location,
        status,
        updated_at: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser[0],
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user has associated consultations
    const userConsultations = await db
      .select()
      .from(consultations)
      .where(eq(consultations.client_email, 
        (await db.select({ email: users.email }).from(users).where(eq(users.id, parseInt(id))))[0]?.email || ''
      ));

    if (userConsultations.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete user with associated consultations' },
        { status: 400 }
      );
    }

    // Delete user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (deletedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
