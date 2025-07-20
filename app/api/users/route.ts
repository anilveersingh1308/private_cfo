import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { getAuthUser } from '@/lib/auth';
import { eq, or, ilike } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const active = searchParams.get('active');

    const whereConditions: any[] = [];

    if (role) {
      whereConditions.push(eq(users.role, role as any));
    }

    if (active !== null) {
      whereConditions.push(eq(users.is_active, active === 'true'));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(users.first_name, `%${search}%`),
          ilike(users.last_name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.username, `%${search}%`)
        )
      );
    }

    let employeeList;
    if (whereConditions.length > 0) {
      employeeList = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
          first_name: users.first_name,
          last_name: users.last_name,
          phone: users.phone,
          specialization: users.specialization,
          experience_years: users.experience_years,
          is_active: users.is_active,
          last_login: users.last_login,
          created_at: users.created_at,
        })
        .from(users)
        .where(or(...whereConditions));
    } else {
      employeeList = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
          first_name: users.first_name,
          last_name: users.last_name,
          phone: users.phone,
          specialization: users.specialization,
          experience_years: users.experience_years,
          is_active: users.is_active,
          last_login: users.last_login,
          created_at: users.created_at,
        })
        .from(users);
    }

    return NextResponse.json({
      success: true,
      users: employeeList
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const { userId, ...updateData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const allowedFields = [
      'role', 'first_name', 'last_name', 'phone', 'specialization',
      'experience_years', 'bio', 'is_active'
    ];

    const updates: any = { updated_at: new Date() };
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }

    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        first_name: users.first_name,
        last_name: users.last_name,
        phone: users.phone,
        specialization: users.specialization,
        experience_years: users.experience_years,
        is_active: users.is_active,
        updated_at: users.updated_at,
      });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
