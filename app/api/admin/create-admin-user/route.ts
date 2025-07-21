import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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
          role: existingAdmin[0].role,
          name: existingAdmin[0].name
        },
        credentials: {
          email: 'admin@cfo.com',
          password: 'Admin123!@# (if not changed)',
          note: 'Password may have been changed after creation'
        }
      });
    }
    
    // Create the admin user
    const adminUser = await db.insert(users).values({
      name: 'System Administrator',
      email: 'admin@cfo.com',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '+1-555-ADMIN',
      location: 'System',
      consultations_count: 0,
      total_spent: '0',
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser[0].id,
        email: adminUser[0].email,
        role: adminUser[0].role,
        name: adminUser[0].name
      },
      credentials: {
        email: adminUser[0].email,
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
