import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, consultations } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';

const sqlConnection = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConnection);

export async function GET(request: NextRequest) {
  try {
    // Fetch all users with consultant role
    const consultants = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
        created_at: users.created_at
      })
      .from(users)
      .where(and(
        eq(users.role, 'consultant'),
        eq(users.status, 'active')
      ));

    // Fetch consultation statistics for each consultant
    const consultantsWithStats = await Promise.all(
      consultants.map(async (consultant) => {
        const stats = await db
          .select({
            total: sql<number>`count(*)`,
            active: sql<number>`count(case when status = 'ongoing' then 1 end)`,
            upcoming: sql<number>`count(case when status = 'scheduled' then 1 end)`,
            completed: sql<number>`count(case when status = 'completed' then 1 end)`,
            cancelled: sql<number>`count(case when status = 'cancelled' then 1 end)`,
            pending: sql<number>`count(case when status = 'pending' then 1 end)`
          })
          .from(consultations)
          .where(eq(consultations.consultant, consultant.name));

        const consultationStats = stats[0] || {
          total: 0,
          active: 0,
          upcoming: 0,
          completed: 0,
          cancelled: 0,
          pending: 0
        };

        return {
          ...consultant,
          stats: {
            total: Number(consultationStats.total),
            active: Number(consultationStats.active),
            upcoming: Number(consultationStats.upcoming),
            completed: Number(consultationStats.completed),
            cancelled: Number(consultationStats.cancelled),
            pending: Number(consultationStats.pending)
          }
        };
      })
    );

    // Sort consultants: Active status first, then by experience (total consultations), then by name
    const sortedConsultants = consultantsWithStats.sort((a, b) => {
      // First sort by active status
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // Then sort by total consultations (experience) - descending
      if (a.stats.total !== b.stats.total) {
        return b.stats.total - a.stats.total;
      }
      
      // Finally sort by name alphabetically
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      data: sortedConsultants,
      count: sortedConsultants.length,
      message: `Found ${sortedConsultants.length} consultant(s)`
    });

  } catch (error) {
    console.error('Error fetching consultants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultants' },
      { status: 500 }
    );
  }
}
