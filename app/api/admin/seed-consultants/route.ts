import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '@/lib/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function POST(request: NextRequest) {
  try {
    // Sample consultant data
    const consultants = [
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@cfoadvisory.com',
        password_hash: '$2b$10$examplehash1',
        role: 'consultant' as const,
        status: 'active' as const,
        phone: '+91-9876543210',
        location: 'Mumbai, Maharashtra'
      },
      {
        name: 'CA Priya Verma',
        email: 'ca.verma@cfoadvisory.com',
        password_hash: '$2b$10$examplehash2',
        role: 'consultant' as const,
        status: 'active' as const,
        phone: '+91-9876543211',
        location: 'Delhi, NCR'
      },
      {
        name: 'Mr. Amit Gupta',
        email: 'amit.gupta@cfoadvisory.com',
        password_hash: '$2b$10$examplehash3',
        role: 'consultant' as const,
        status: 'active' as const,
        phone: '+91-9876543212',
        location: 'Bangalore, Karnataka'
      },
      {
        name: 'Mrs. Sunita Agarwal',
        email: 'sunita.agarwal@cfoadvisory.com',
        password_hash: '$2b$10$examplehash4',
        role: 'consultant' as const,
        status: 'active' as const,
        phone: '+91-9876543213',
        location: 'Pune, Maharashtra'
      },
      {
        name: 'Mr. Vikram Singh',
        email: 'vikram.singh@cfoadvisory.com',
        password_hash: '$2b$10$examplehash5',
        role: 'consultant' as const,
        status: 'active' as const,
        phone: '+91-9876543214',
        location: 'Chennai, Tamil Nadu'
      }
    ];

    const results = [];
    
    for (const consultant of consultants) {
      try {
        const result = await db.insert(users).values(consultant).returning();
        results.push({ success: true, consultant: consultant.name, data: result[0] });
      } catch (error: any) {
        if (error.message?.includes('duplicate') || error.code === '23505') {
          results.push({ success: false, consultant: consultant.name, error: 'Already exists' });
        } else {
          results.push({ success: false, consultant: consultant.name, error: error.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Consultant seeding completed',
      results
    });

  } catch (error) {
    console.error('Error seeding consultants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed consultants' },
      { status: 500 }
    );
  }
}
