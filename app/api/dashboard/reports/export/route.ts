import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  users, 
  consultations, 
  consultationForms,
  invoices, 
  newsletterSubscribers 
} from '@/lib/schema';
import { eq, gte, and, count, sum, desc } from 'drizzle-orm';

interface ExportRow {
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const period = searchParams.get('period') || 'month';
    const type = searchParams.get('type') || 'summary';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    let data: ExportRow[] = [];
    let filename = '';

    switch (type) {
      case 'consultations':
        data = await db.select({
          id: consultations.id,
          client_name: consultations.client_name,
          client_email: consultations.client_email,
          service_type: consultations.service_type,
          status: consultations.status,
          scheduled_date: consultations.scheduled_date,
          duration: consultations.duration,
          amount: consultations.amount,
          payment_status: consultations.payment_status,
          consultant: consultations.consultant,
          created_at: consultations.created_at
        })
        .from(consultations)
        .where(gte(consultations.created_at, startDate))
        .orderBy(desc(consultations.created_at));
        
        filename = `consultations_${period}_${Date.now()}`;
        break;

      case 'users':
        data = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          location: users.location,
          consultations_count: users.consultations_count,
          total_spent: users.total_spent,
          last_login: users.last_login,
          created_at: users.created_at
        })
        .from(users)
        .where(gte(users.created_at, startDate))
        .orderBy(desc(users.created_at));
        
        filename = `users_${period}_${Date.now()}`;
        break;

      case 'invoices':
        data = await db.select({
          id: invoices.id,
          invoice_number: invoices.invoice_number,
          client_name: invoices.client_name,
          client_email: invoices.client_email,
          amount: invoices.amount,
          status: invoices.status,
          due_date: invoices.due_date,
          paid_date: invoices.paid_date,
          created_at: invoices.created_at
        })
        .from(invoices)
        .where(gte(invoices.created_at, startDate))
        .orderBy(desc(invoices.created_at));
        
        filename = `invoices_${period}_${Date.now()}`;
        break;

      case 'newsletter':
        data = await db.select({
          id: newsletterSubscribers.id,
          email: newsletterSubscribers.email,
          status: newsletterSubscribers.status,
          engagement_score: newsletterSubscribers.engagement_score,
          source: newsletterSubscribers.source,
          total_emails_sent: newsletterSubscribers.total_emails_sent,
          last_email_opened: newsletterSubscribers.last_email_opened,
          subscribed_at: newsletterSubscribers.subscribed_at,
          unsubscribed_at: newsletterSubscribers.unsubscribed_at
        })
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.subscribed_at));
        
        filename = `newsletter_subscribers_${Date.now()}`;
        break;

      default: // summary
        const summaryData = await Promise.all([
          db.select({
            metric: sql<string>`'Total Users'`,
            value: count(),
            period: sql<string>`${period}`
          }).from(users),
          
          db.select({
            metric: sql<string>`'Total Consultations'`,
            value: count(),
            period: sql<string>`${period}`
          }).from(consultations).where(gte(consultations.created_at, startDate)),
          
          db.select({
            metric: sql<string>`'Total Revenue'`,
            value: sum(invoices.amount),
            period: sql<string>`${period}`
          }).from(invoices).where(
            and(
              eq(invoices.status, 'paid'),
              gte(invoices.created_at, startDate)
            )
          ),
          
          db.select({
            metric: sql<string>`'Newsletter Subscribers'`,
            value: count(),
            period: sql<string>`${period}`
          }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'active'))
        ]);

        data = summaryData.flat().map(item => ({
          metric: item.metric,
          value: Number(item.value) || 0,
          period: item.period,
          generated_at: new Date().toISOString()
        }));
        
        filename = `summary_report_${period}_${Date.now()}`;
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    } else if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      });
    } else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: ExportRow[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle null, undefined, and escape quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma or quote
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

// We need to import sql from drizzle-orm
import { sql } from 'drizzle-orm';
