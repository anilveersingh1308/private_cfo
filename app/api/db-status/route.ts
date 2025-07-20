import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultations } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get database statistics
    const totalSubmissions = await db.select({ count: sql<number>`count(*)` }).from(consultations);
    const recentSubmissions = await db.select().from(consultations).orderBy(sql`created_at DESC`).limit(5);
    
    // Get table schema info
    const tableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'consultations' 
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      success: true,
      statistics: {
        totalSubmissions: totalSubmissions[0].count,
        recentSubmissions: recentSubmissions.length,
        tableStructure: tableInfo.rows
      },
      recentData: recentSubmissions,
      message: 'Database is healthy and operational'
    });
  } catch (error) {
    console.error('Database status check error:', error);
    return NextResponse.json(
      { 
        error: 'Database status check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
