import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateUniqueUsername } from '@/lib/username-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Creating admin user...');
    
    // Generate a secure password
    const plainPassword = 'Admin123!@#';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@cfo.com'))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists');
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingAdmin[0].id,
          email: existingAdmin[0].email,
          username: existingAdmin[0].username,
          role: existingAdmin[0].role,
          name: existingAdmin[0].name
        },
        credentials: {
          email: 'admin@cfo.com',
          username: existingAdmin[0].username,
          password: 'Admin123!@# (if not changed)',
          note: 'Password may have been changed after creation'
        }
      });
    }

    // Generate unique username
    const existingUsernames = await db
      .select({ username: users.username })
      .from(users);
    
    const username = generateUniqueUsername('System Administrator', existingUsernames.map(u => u.username));
    
    // Create the admin user
    const adminUser = await db.insert(users).values({
      name: 'System Administrator',
      username,
      email: 'admin@cfo.com',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '+1-555-ADMIN',
      location: 'System',
      consultations_count: 0,
      total_spent: '0',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser[0].id,
        email: adminUser[0].email,
        username: adminUser[0].username,
        role: adminUser[0].role,
        name: adminUser[0].name
      },
      credentials: {
        email: adminUser[0].email,
        username: adminUser[0].username,
        password: plainPassword,
        note: 'Please change the password after first login'
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin user',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
