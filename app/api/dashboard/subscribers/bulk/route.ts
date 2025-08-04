import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberIds, action } = body;

    if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber IDs array is required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (action) {
      case 'activate':
        result = await db
          .update(newsletterSubscribers)
          .set({ 
            status: 'active',
            unsubscribed_at: null
          })
          .where(inArray(newsletterSubscribers.id, subscriberIds))
          .returning();
        message = `${result.length} subscribers activated successfully`;
        break;

      case 'unsubscribe':
        result = await db
          .update(newsletterSubscribers)
          .set({ 
            status: 'unsubscribed',
            unsubscribed_at: new Date()
          })
          .where(inArray(newsletterSubscribers.id, subscriberIds))
          .returning();
        message = `${result.length} subscribers unsubscribed successfully`;
        break;

      case 'bounce':
        result = await db
          .update(newsletterSubscribers)
          .set({ status: 'bounced' })
          .where(inArray(newsletterSubscribers.id, subscriberIds))
          .returning();
        message = `${result.length} subscribers marked as bounced`;
        break;

      case 'delete':
        result = await db
          .delete(newsletterSubscribers)
          .where(inArray(newsletterSubscribers.id, subscriberIds))
          .returning();
        message = `${result.length} subscribers deleted successfully`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Supported actions: activate, unsubscribe, bounce, delete' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message,
      affected: result.length
    });

  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}
