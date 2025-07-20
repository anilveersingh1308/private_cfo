import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultations } from '@/lib/schema';

export async function GET() {
  try {
    const results = await db.select().from(consultations).orderBy(consultations.created_at).limit(10);
    
    return NextResponse.json({
      success: true,
      count: results.length,
      consultations: results.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        country_code: c.country_code,
        email: c.email,
        city: c.city,
        occupation: c.occupation,
        created_at: c.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
