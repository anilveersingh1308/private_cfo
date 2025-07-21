import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, consultations, invoices, newsletterSubscribers } from '@/lib/schema';
import { count, sum } from 'drizzle-orm';

export async function GET() {
  try {
    // Test basic database connectivity and get simple counts
    const [userCount, consultationCount, invoiceSum, subscriberCount] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(consultations),
      db.select({ total: sum(invoices.amount) }).from(invoices),
      db.select({ count: count() }).from(newsletterSubscribers)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: userCount[0]?.count || 0,
        consultations: consultationCount[0]?.count || 0,
        revenue: Number(invoiceSum[0]?.total) || 0,
        subscribers: subscriberCount[0]?.count || 0
      },
      message: 'Database connectivity and reports API working correctly'
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
