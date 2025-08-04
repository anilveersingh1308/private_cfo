import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch all subscribers
    const subscribers = await db
      .select({
        id: newsletterSubscribers.id,
        email: newsletterSubscribers.email,
        status: newsletterSubscribers.status,
        categories: newsletterSubscribers.categories,
        engagement_score: newsletterSubscribers.engagement_score,
        source: newsletterSubscribers.source,
        total_emails_sent: newsletterSubscribers.total_emails_sent,
        last_email_opened: newsletterSubscribers.last_email_opened,
        subscribed_at: newsletterSubscribers.subscribed_at,
        unsubscribed_at: newsletterSubscribers.unsubscribed_at
      })
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribed_at));

    // Create CSV content
    const csvHeader = [
      'ID',
      'Email',
      'Status',
      'Categories',
      'Engagement Score',
      'Source',
      'Total Emails Sent',
      'Last Email Opened',
      'Subscribed At',
      'Unsubscribed At'
    ].join(',');

    const csvRows = subscribers.map(subscriber => [
      subscriber.id,
      `"${subscriber.email}"`,
      subscriber.status,
      `"${Array.isArray(subscriber.categories) ? subscriber.categories.join('; ') : ''}"`,
      subscriber.engagement_score || 0,
      `"${subscriber.source || ''}"`,
      subscriber.total_emails_sent || 0,
      subscriber.last_email_opened ? new Date(subscriber.last_email_opened).toISOString() : '',
      new Date(subscriber.subscribed_at).toISOString(),
      subscriber.unsubscribed_at ? new Date(subscriber.unsubscribed_at).toISOString() : ''
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}
