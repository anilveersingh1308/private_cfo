import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq, count, avg } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total count by status
    const statusCounts = await Promise.all([
      db.select({ count: count() }).from(newsletterSubscribers),
      db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'active')),
      db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'pending')),
      db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'unsubscribed')),
      db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'bounced')),
    ]);

    // Get average engagement score
    const avgEngagementResult = await db
      .select({ avg: avg(newsletterSubscribers.engagement_score) })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'active'));

    const stats = {
      total: statusCounts[0][0]?.count || 0,
      active: statusCounts[1][0]?.count || 0,
      pending: statusCounts[2][0]?.count || 0,
      unsubscribed: statusCounts[3][0]?.count || 0,
      bounced: statusCounts[4][0]?.count || 0,
      avgEngagement: Math.round(Number(avgEngagementResult[0]?.avg) || 0)
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletter statistics' },
      { status: 500 }
    );
  }
}
