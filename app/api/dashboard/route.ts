import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultations, users, consultationSessions } from '@/lib/schema';
import { getAuthUser } from '@/lib/auth';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // month, week, year
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month

    // Calculate date range based on period
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    let dashboardData: any = {};

    if (user.role === 'admin') {
      // Admin dashboard - overview of all activities
      
      // Total consultations by status
      const consultationStats = await db
        .select({
          status: consultations.status,
          count: sql<number>`count(*)::int`,
        })
        .from(consultations)
        .where(and(
          gte(consultations.created_at, startDate),
          lte(consultations.created_at, endDate)
        ))
        .groupBy(consultations.status);

      // Revenue statistics
      const revenueStats = await db
        .select({
          total_revenue: sql<number>`sum(consultation_fee)`,
          avg_fee: sql<number>`avg(consultation_fee)`,
          completed_count: sql<number>`count(case when status = 'completed' then 1 end)::int`,
        })
        .from(consultations)
        .where(and(
          gte(consultations.created_at, startDate),
          lte(consultations.created_at, endDate)
        ));

      // Top performing employees
      const topEmployees = await db
        .select({
          advisor: {
            id: users.id,
            first_name: users.first_name,
            last_name: users.last_name,
            specialization: users.specialization,
          },
          total_consultations: sql<number>`count(*)::int`,
          completed_consultations: sql<number>`count(case when ${consultations.status} = 'completed' then 1 end)::int`,
          avg_rating: sql<number>`avg(${consultations.client_satisfaction_rating})`,
          total_revenue: sql<number>`sum(${consultations.consultation_fee})`,
        })
        .from(consultations)
        .leftJoin(users, eq(consultations.assigned_to, users.id))
        .where(and(
          gte(consultations.created_at, startDate),
          lte(consultations.created_at, endDate)
        ))
        .groupBy(users.id, users.first_name, users.last_name, users.specialization)
        .orderBy(sql`count(*) desc`)
        .limit(5);

      // Recent activities
      const recentConsultations = await db
        .select({
          consultation: consultations,
          advisor: {
            first_name: users.first_name,
            last_name: users.last_name,
          }
        })
        .from(consultations)
        .leftJoin(users, eq(consultations.assigned_to, users.id))
        .orderBy(sql`${consultations.created_at} desc`)
        .limit(10);

      dashboardData = {
        consultation_stats: consultationStats,
        revenue_stats: revenueStats[0],
        top_employees: topEmployees,
        recent_consultations: recentConsultations.map(item => ({
          ...item.consultation,
          advisor: item.advisor
        })),
        period_info: {
          start_date: startDate,
          end_date: endDate,
          period: period
        }
      };

    } else {
      // Employee dashboard - personal performance
      
      // Personal consultation stats
      const personalStats = await db
        .select({
          status: consultations.status,
          count: sql<number>`count(*)::int`,
        })
        .from(consultations)
        .where(and(
          eq(consultations.assigned_to, user.id),
          gte(consultations.created_at, startDate),
          lte(consultations.created_at, endDate)
        ))
        .groupBy(consultations.status);

      // Personal performance metrics
      const personalMetrics = await db
        .select({
          total_consultations: sql<number>`count(*)::int`,
          completed_consultations: sql<number>`count(case when status = 'completed' then 1 end)::int`,
          avg_rating: sql<number>`avg(client_satisfaction_rating)`,
          total_revenue: sql<number>`sum(consultation_fee)`,
          total_hours: sql<number>`sum(actual_duration) / 60.0`,
        })
        .from(consultations)
        .where(and(
          eq(consultations.assigned_to, user.id),
          gte(consultations.created_at, startDate),
          lte(consultations.created_at, endDate)
        ));

      // Upcoming sessions
      const upcomingSessions = await db
        .select({
          session: consultationSessions,
          consultation: {
            id: consultations.id,
            name: consultations.name,
            phone: consultations.phone,
            email: consultations.email,
          }
        })
        .from(consultationSessions)
        .leftJoin(consultations, eq(consultationSessions.consultation_id, consultations.id))
        .where(and(
          eq(consultationSessions.advisor_id, user.id),
          gte(consultationSessions.scheduled_start, new Date()),
          eq(consultationSessions.session_status, 'scheduled')
        ))
        .orderBy(consultationSessions.scheduled_start)
        .limit(5);

      // Recent consultations assigned to this employee
      const myRecentConsultations = await db
        .select()
        .from(consultations)
        .where(eq(consultations.assigned_to, user.id))
        .orderBy(sql`${consultations.created_at} desc`)
        .limit(10);

      dashboardData = {
        personal_stats: personalStats,
        personal_metrics: personalMetrics[0],
        upcoming_sessions: upcomingSessions.map(item => ({
          ...item.session,
          consultation: item.consultation
        })),
        my_recent_consultations: myRecentConsultations,
        period_info: {
          start_date: startDate,
          end_date: endDate,
          period: period
        }
      };
    }

    return NextResponse.json({
      success: true,
      dashboard: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
