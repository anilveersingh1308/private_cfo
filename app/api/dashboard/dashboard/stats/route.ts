import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { consultations, users, newsletterSubscribers, invoices } from '@/lib/schema';
import { eq, count, sum, and, gte, lte, desc } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get total consultations
    const totalConsultationsResult = await db
      .select({ count: count() })
      .from(consultations);
    const totalConsultations = totalConsultationsResult[0]?.count || 0;

    // Get upcoming sessions (today and future)
    const upcomingSessionsResult = await db
      .select({ count: count() })
      .from(consultations)
      .where(
        and(
          gte(consultations.scheduled_date, today),
          eq(consultations.status, 'scheduled')
        )
      );
    const upcomingSessions = upcomingSessionsResult[0]?.count || 0;

    // Get completed consultations
    const completedConsultationsResult = await db
      .select({ count: count() })
      .from(consultations)
      .where(eq(consultations.status, 'completed'));
    const completedConsultations = completedConsultationsResult[0]?.count || 0;

    // Calculate completion rate
    const completionRate = totalConsultations > 0 
      ? Math.round((completedConsultations / totalConsultations) * 100)
      : 0;

    // Get total revenue from paid consultations
    const revenueResult = await db
      .select({ 
        total: sum(consultations.amount)
      })
      .from(consultations)
      .where(eq(consultations.payment_status, 'paid'));
    
    const totalRevenue = parseFloat(revenueResult[0]?.total || '0');

    // Get monthly revenue
    const monthlyRevenueResult = await db
      .select({ 
        total: sum(consultations.amount)
      })
      .from(consultations)
      .where(
        and(
          eq(consultations.payment_status, 'paid'),
          gte(consultations.scheduled_date, startOfMonth),
          lte(consultations.scheduled_date, endOfMonth)
        )
      );
    
    const monthlyRevenue = parseFloat(monthlyRevenueResult[0]?.total || '0');

    // Get consultation breakdown by service type
    const consultationBreakdown = await db
      .select({
        service_type: consultations.service_type,
        count: count(),
        revenue: sum(consultations.amount)
      })
      .from(consultations)
      .where(eq(consultations.payment_status, 'paid'))
      .groupBy(consultations.service_type);

    // Get revenue breakdown by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBreakdown = await db
      .select({
        month: consultations.scheduled_date,
        revenue: sum(consultations.amount),
        count: count()
      })
      .from(consultations)
      .where(
        and(
          eq(consultations.payment_status, 'paid'),
          gte(consultations.scheduled_date, sixMonthsAgo)
        )
      )
      .groupBy(consultations.scheduled_date)
      .orderBy(desc(consultations.scheduled_date));

    // Get recent consultations
    const recentConsultations = await db
      .select({
        id: consultations.id,
        client_name: consultations.client_name,
        service_type: consultations.service_type,
        scheduled_date: consultations.scheduled_date,
        status: consultations.status,
        amount: consultations.amount,
        consultant: consultations.consultant
      })
      .from(consultations)
      .orderBy(desc(consultations.scheduled_date))
      .limit(10);

    // Get consultant performance
    const consultantStats = await db
      .select({
        consultant: consultations.consultant,
        total_consultations: count(),
        completed_consultations: count(),
        total_revenue: sum(consultations.amount)
      })
      .from(consultations)
      .where(eq(consultations.payment_status, 'paid'))
      .groupBy(consultations.consultant);

    // Get active users count
    const activeUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.status, 'active'));
    const activeUsers = activeUsersResult[0]?.count || 0;

    // Get newsletter subscribers count
    const subscribersResult = await db
      .select({ count: count() })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'active'));
    const activeSubscribers = subscribersResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalConsultations,
          upcomingSessions,
          completionRate,
          totalRevenue,
          monthlyRevenue,
          activeUsers,
          activeSubscribers
        },
        consultationBreakdown: consultationBreakdown.map(item => ({
          service: item.service_type,
          count: item.count,
          revenue: parseFloat(item.revenue || '0')
        })),
        monthlyBreakdown: monthlyBreakdown.map(item => ({
          month: item.month,
          revenue: parseFloat(item.revenue || '0'),
          consultations: item.count
        })),
        recentConsultations,
        consultantStats: consultantStats.map(stat => ({
          name: stat.consultant,
          totalConsultations: stat.total_consultations,
          completedConsultations: stat.completed_consultations,
          totalRevenue: parseFloat(stat.total_revenue || '0'),
          successRate: stat.total_consultations > 0 
            ? Math.round((stat.completed_consultations / stat.total_consultations) * 100)
            : 0
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
