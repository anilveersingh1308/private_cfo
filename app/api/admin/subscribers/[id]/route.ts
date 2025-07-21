import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, engagement_score, categories, source } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (engagement_score !== undefined) updateData.engagement_score = engagement_score;
    if (categories !== undefined) updateData.categories = categories;
    if (source !== undefined) updateData.source = source;

    // Add unsubscribed_at if status is being set to unsubscribed
    if (status === 'unsubscribed') {
      updateData.unsubscribed_at = new Date();
    } else if (status === 'active' && updateData.unsubscribed_at !== undefined) {
      updateData.unsubscribed_at = null;
    }

    // Update subscriber
    const updatedSubscriber = await db
      .update(newsletterSubscribers)
      .set(updateData)
      .where(eq(newsletterSubscribers.id, parseInt(id)))
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
