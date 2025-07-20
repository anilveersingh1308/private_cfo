import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = await db.execute('SELECT 1 as test');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      test: result
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
