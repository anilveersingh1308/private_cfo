import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';
import { sendEmail } from '@/lib/email-service';

// Email data interface
interface EmailData {
  to: string[];
  subject: string;
  content: string;
  isHtml?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberIds, subject, content, isHtml = true } = body;

    // Validate required fields
    if (!subscriberIds || subscriberIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber IDs are required' },
        { status: 400 }
      );
    }

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Get subscriber emails
    const subscribers = await db
      .select({
        id: newsletterSubscribers.id,
        email: newsletterSubscribers.email,
        status: newsletterSubscribers.status,
        total_emails_sent: newsletterSubscribers.total_emails_sent
      })
      .from(newsletterSubscribers)
      .where(inArray(newsletterSubscribers.id, subscriberIds));

    // Filter only active subscribers
    const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
    
    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    const emailAddresses = activeSubscribers.map(sub => sub.email);

    // Send email
    const emailResult = await sendEmail({
      to: emailAddresses,
      subject,
      content,
      isHtml
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update email statistics for subscribers
    const updatePromises = activeSubscribers.map(subscriber =>
      db
        .update(newsletterSubscribers)
        .set({
          total_emails_sent: (subscriber.total_emails_sent || 0) + 1
        })
        .where(eq(newsletterSubscribers.id, subscriber.id))
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${activeSubscribers.length} subscribers`,
      data: {
        messageId: emailResult.messageId,
        recipientCount: activeSubscribers.length,
        skippedCount: subscribers.length - activeSubscribers.length
      }
    });

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve email templates or previous campaigns
export async function GET(request: NextRequest) {
  try {
    // This could be extended to include email templates, campaign history, etc.
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to Our Newsletter!',
        content: `
          <h2>Welcome to Our Financial Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter. We're excited to share valuable financial insights with you.</p>
          <p>You'll receive:</p>
          <ul>
            <li>Market updates and analysis</li>
            <li>Financial planning tips</li>
            <li>Investment strategies</li>
            <li>Economic insights</li>
          </ul>
          <p>Best regards,<br>The CFO Team</p>
        `
      },
      {
        id: 'monthly_update',
        name: 'Monthly Market Update',
        subject: 'Monthly Market Update - {{month}} {{year}}',
        content: `
          <h2>Monthly Market Update</h2>
          <p>Here's your monthly financial market update with key insights and trends.</p>
          <h3>Market Highlights</h3>
          <p>[Add market highlights here]</p>
          <h3>Key Economic Indicators</h3>
          <p>[Add economic indicators here]</p>
          <h3>Looking Ahead</h3>
          <p>[Add forward-looking insights here]</p>
          <p>Best regards,<br>The CFO Team</p>
        `
      },
      {
        id: 'financial_tips',
        name: 'Financial Tips Weekly',
        subject: 'Weekly Financial Tips - Week of {{date}}',
        content: `
          <h2>Weekly Financial Tips</h2>
          <p>This week's financial tips to help you manage your finances better.</p>
          <h3>Tip of the Week</h3>
          <p>[Add main tip here]</p>
          <h3>Quick Actions</h3>
          <ul>
            <li>[Action item 1]</li>
            <li>[Action item 2]</li>
            <li>[Action item 3]</li>
          </ul>
          <p>Best regards,<br>The CFO Team</p>
        `
      }
    ];

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}
