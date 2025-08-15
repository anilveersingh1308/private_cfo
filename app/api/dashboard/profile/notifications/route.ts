import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate notification settings structure
    const validKeys = [
      'email_notifications',
      'push_notifications', 
      'desktop_notifications',
      'invoice_reminders',
      'consultation_alerts',
      'marketing_emails'
    ];

    const isValidSettings = Object.keys(body).every(key => 
      validKeys.includes(key) && typeof body[key] === 'boolean'
    );

    if (!isValidSettings) {
      return NextResponse.json(
        { error: 'Invalid notification settings format' },
        { status: 400 }
      );
    }

    // Check if user settings exist
    const existingSettings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.user_id, user.id))
      .limit(1);

    if (existingSettings.length === 0) {
      // Create new settings record
      await db.insert(userSettings).values({
        user_id: user.id,
        ...body
      });
    } else {
      // Update existing settings
      await db
        .update(userSettings)
        .set({
          ...body,
          updated_at: new Date()
        })
        .where(eq(userSettings.user_id, user.id));
    }

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: body
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
