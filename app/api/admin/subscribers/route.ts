import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { newsletterSubscribers } from '@/lib/schema';
import { eq, desc, count, ilike } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query conditions
    const conditions = [];
    if (status) conditions.push(eq(newsletterSubscribers.status, status as any));
    if (search) conditions.push(ilike(newsletterSubscribers.email, `%${search}%`));

    // Fetch subscribers with optional filtering
    const subscriberList = await db
      .select({
        id: newsletterSubscribers.id,
        email: newsletterSubscribers.email,
        categories: newsletterSubscribers.categories,
        status: newsletterSubscribers.status,
        engagement_score: newsletterSubscribers.engagement_score,
        source: newsletterSubscribers.source,
        total_emails_sent: newsletterSubscribers.total_emails_sent,
        last_email_opened: newsletterSubscribers.last_email_opened,
        subscribed_at: newsletterSubscribers.subscribed_at,
        unsubscribed_at: newsletterSubscribers.unsubscribed_at
      })
      .from(newsletterSubscribers)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(newsletterSubscribers.subscribed_at));

    return NextResponse.json({
      success: true,
      data: subscriberList,
      count: subscriberList.length
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, categories, source } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existingSubscriber.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber with this email already exists' },
        { status: 400 }
      );
    }

    // Create new subscriber
    const newSubscriber = await db
      .insert(newsletterSubscribers)
      .values({
        email,
        categories: categories || ['Financial Planning'],
        source: source || 'Manual',
        status: 'active',
        engagement_score: 0,
        total_emails_sent: 0
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newSubscriber[0],
      message: 'Subscriber added successfully'
    });

  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscriber' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, categories, status, engagement_score, source } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    // Update subscriber
    const updatedSubscriber = await db
      .update(newsletterSubscribers)
      .set({
        email,
        categories,
        status,
        engagement_score,
        source
      })
      .where(eq(newsletterSubscribers.id, id))
      .returning();

    if (updatedSubscriber.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubscriber[0],
      message: 'Subscriber updated successfully'
    });

  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    // Delete subscriber
    const deletedSubscriber = await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .returning();

    if (deletedSubscriber.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}
