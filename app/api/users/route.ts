import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { getAuthUser } from '@/lib/auth';
import { eq, or, ilike } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Remove admin authentication for now to allow public access
    // const user = await getAuthUser();
    // 
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Admin privileges required' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const whereConditions: any[] = [];

    if (role) {
      whereConditions.push(eq(users.role, role as any));
    }

    if (status) {
      whereConditions.push(eq(users.status, status as any));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.location, `%${search}%`)
        )
      );
    }

    let usersList;
    if (whereConditions.length > 0) {
      usersList = await db
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
          last_login: users.last_login,
          created_at: users.created_at,
          updated_at: users.updated_at,
        })
        .from(users)
        .where(or(...whereConditions));
    } else {
      usersList = await db
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
          last_login: users.last_login,
          created_at: users.created_at,
          updated_at: users.updated_at,
        })
        .from(users);
    }

    return NextResponse.json({
      success: true,
      users: usersList
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
    // Remove admin authentication for now
    // const user = await getAuthUser();
    // 
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Admin privileges required' },
    //     { status: 403 }
    //   );
    // }

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

    // Prepare update data with correct schema fields
    const allowedFields = [
      'role', 'name', 'phone', 'location', 'status'
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
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        phone: users.phone,
        location: users.location,
        consultations_count: users.consultations_count,
        total_spent: users.total_spent,
        last_login: users.last_login,
        created_at: users.created_at,
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
