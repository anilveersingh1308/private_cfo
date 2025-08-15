import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user settings from database
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.user_id, user.id))
      .limit(1);

    if (settings.length === 0) {
      // Return default settings if none exist
      const defaultSettings = {
        notifications: {
          email_notifications: true,
          push_notifications: true,
          desktop_notifications: false,
          invoice_reminders: true,
          consultation_alerts: true,
          marketing_emails: false
        },
        security: {
          two_factor_enabled: false,
          login_alerts: true,
          session_timeout: 60
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'Asia/Kolkata',
          currency: 'INR'
        }
      };
      return NextResponse.json(defaultSettings);
    }

    const userSetting = settings[0];
    
    return NextResponse.json({
      notifications: {
        email_notifications: userSetting.email_notifications,
        push_notifications: userSetting.push_notifications,
        desktop_notifications: userSetting.desktop_notifications,
        invoice_reminders: userSetting.invoice_reminders,
        consultation_alerts: userSetting.consultation_alerts,
        marketing_emails: userSetting.marketing_emails
      },
      security: {
        two_factor_enabled: userSetting.two_factor_enabled,
        login_alerts: userSetting.login_alerts,
        session_timeout: userSetting.session_timeout
      },
      preferences: {
        theme: userSetting.theme,
        language: userSetting.language,
        timezone: userSetting.timezone,
        currency: userSetting.currency
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
