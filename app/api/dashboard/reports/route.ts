import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  users, 
  consultations, 
  invoices, 
  newsletterSubscribers,
  employeeStats,
  consultationSessions
} from '@/lib/schema';
import { sql, eq, and, gte, lte, count, sum, avg, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    
    // Calculate date range based on period
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
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Parallel database queries for better performance
    const [
      consultationStats,
      userStats,
      financialStats,
      revenueData,
      consultationTrends,
      userGrowth
    ] = await Promise.all([
      // Consultation statistics
      db.select({
        total: count(),
        completed: sql<number>`count(case when ${consultations.status} = 'completed' then 1 end)`,
        upcoming: sql<number>`count(case when ${consultations.status} = 'scheduled' then 1 end)`,
        cancelled: sql<number>`count(case when ${consultations.status} = 'cancelled' then 1 end)`,
        avgAmount: avg(consultations.amount),
      })
      .from(consultations)
      .where(gte(consultations.created_at, startDate)),

      // User statistics  
      db.select({
        total: count(),
        active: sql<number>`count(case when ${users.status} = 'active' then 1 end)`,
        newThisMonth: sql<number>`count(case when ${users.created_at} >= ${startDate} then 1 end)`,
        subscribersCount: sql<number>`(select count(*) from ${newsletterSubscribers})`
      })
      .from(users),

      // Financial statistics
      db.select({
        totalRevenue: sum(invoices.amount),
        paidRevenue: sql<number>`sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end)`,
        pendingPayments: sql<number>`sum(case when ${invoices.status} = 'sent' or ${invoices.status} = 'overdue' then ${invoices.amount} else 0 end)`,
        cancelled: sql<number>`sum(case when ${invoices.status} = 'cancelled' then ${invoices.amount} else 0 end)`,
      })
      .from(invoices)
      .where(gte(invoices.created_at, startDate)),

  // Monthly revenue data for charts (last 6 months)
      db.select({
        month: sql<string>`to_char(${invoices.created_at}, 'Mon')`,
        monthNum: sql<number>`extract(month from ${invoices.created_at})`,
        revenue: sum(invoices.amount)
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.status, 'paid'),
          gte(invoices.created_at, new Date(now.getFullYear(), now.getMonth() - 6, 1))
        )
      )
      .groupBy(sql`extract(month from ${invoices.created_at}), to_char(${invoices.created_at}, 'Mon')`)
      .orderBy(sql`extract(month from ${invoices.created_at})`),

      // Consultation trends (last 6 months)
      db.select({
        month: sql<string>`to_char(${consultations.created_at}, 'Mon')`,
        monthNum: sql<number>`extract(month from ${consultations.created_at})`,
        count: count()
      })
      .from(consultations)
      .where(gte(consultations.created_at, new Date(now.getFullYear(), now.getMonth() - 6, 1)))
      .groupBy(sql`extract(month from ${consultations.created_at}), to_char(${consultations.created_at}, 'Mon')`)
      .orderBy(sql`extract(month from ${consultations.created_at})`),

      // User growth (last 6 months)
      db.select({
        month: sql<string>`to_char(${users.created_at}, 'Mon')`,
        monthNum: sql<number>`extract(month from ${users.created_at})`,
        count: count()
      })
      .from(users)
      .where(gte(users.created_at, new Date(now.getFullYear(), now.getMonth() - 6, 1)))
      .groupBy(sql`extract(month from ${users.created_at}), to_char(${users.created_at}, 'Mon')`)
      .orderBy(sql`extract(month from ${users.created_at})`),

    ]);

    // Calculate monthly growth
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - (period === 'year' ? 12 : period === 'quarter' ? 3 : 1));
    
    const [previousRevenue] = await db.select({
      total: sum(invoices.amount)
    })
    .from(invoices)
    .where(
      and(
        eq(invoices.status, 'paid'),
        gte(invoices.created_at, previousPeriodStart),
        lte(invoices.created_at, startDate)
      )
    );

    const currentRevenue = financialStats[0]?.paidRevenue || 0;
    const prevRevenue = Number(previousRevenue?.total) || 0;
    const monthlyGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Format chart data with proper month ordering
    const monthOrder: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(monthOrder[date.getMonth()]);
    }

    const formatChartData = (data: any[], valueKey: string) => {
      const dataMap = new Map(data.map(item => [item.month, Number(item[valueKey]) || 0]));
      return last6Months.map(month => dataMap.get(month) || 0);
    };

    const response = {
      consultations: {
        total: Number(consultationStats[0]?.total) || 0,
        completed: Number(consultationStats[0]?.completed) || 0,
        upcoming: Number(consultationStats[0]?.upcoming) || 0,
        cancelled: Number(consultationStats[0]?.cancelled) || 0,
        revenue: Number(financialStats[0]?.paidRevenue) || 0,
        averageRating: 4.5 // Default rating since we don't have this field in schema
      },
      users: {
        total: Number(userStats[0]?.total) || 0,
        active: Number(userStats[0]?.active) || 0,
        newThisMonth: Number(userStats[0]?.newThisMonth) || 0,
        subscribersCount: Number(userStats[0]?.subscribersCount) || 0
      },
      services: {
        mostPopular: 'Financial Planning',
        totalServices: 0,
        averageDuration: 60
      },
      financial: {
        totalRevenue: Number(financialStats[0]?.totalRevenue) || 0,
        monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
        pendingPayments: Number(financialStats[0]?.pendingPayments) || 0,
        cancelled: Number(financialStats[0]?.cancelled) || 0
      },
      chartData: {
        revenue: {
          labels: last6Months,
          data: formatChartData(revenueData, 'revenue')
        },
        consultations: {
          labels: last6Months,
          data: formatChartData(consultationTrends, 'count')
        },
        users: {
          labels: last6Months,
          data: formatChartData(userGrowth, 'count')
        }
      },
      topServices: []
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    );
  }
}
