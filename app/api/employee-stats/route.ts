import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultations, users, employeeStats } from '@/lib/schema';
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
    const employeeId = searchParams.get('employee_id');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // If not admin and no employee_id specified, default to current user
    const targetEmployeeId = user.role === 'admin' && employeeId 
      ? parseInt(employeeId) 
      : user.id;

    // Permission check
    if (user.role !== 'admin' && targetEmployeeId !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Get or create employee stats for the specified month/year
    let stats = await db
      .select()
      .from(employeeStats)
      .where(and(
        eq(employeeStats.employee_id, targetEmployeeId),
        eq(employeeStats.month, targetMonth),
        eq(employeeStats.year, targetYear)
      ))
      .limit(1);

    if (stats.length === 0) {
      // Calculate stats from consultations table
      const consultationStats = await db
        .select({
          total: sql<number>`count(*)::int`,
          completed: sql<number>`count(case when status = 'completed' then 1 end)::int`,
          pending: sql<number>`count(case when status = 'pending' then 1 end)::int`,
          cancelled: sql<number>`count(case when status = 'cancelled' then 1 end)::int`,
          avgRating: sql<number>`avg(client_satisfaction_rating)`,
          totalRevenue: sql<number>`sum(consultation_fee)`,
          totalHours: sql<number>`sum(actual_duration) / 60.0`, // Convert minutes to hours
        })
        .from(consultations)
        .where(and(
          eq(consultations.assigned_to, targetEmployeeId),
          sql`extract(month from created_at) = ${targetMonth}`,
          sql`extract(year from created_at) = ${targetYear}`
        ));

      const calculatedStats = consultationStats[0];

      // Create new stats record
      const newStats = await db
        .insert(employeeStats)
        .values({
          employee_id: targetEmployeeId,
          month: targetMonth,
          year: targetYear,
          total_consultations: calculatedStats.total || 0,
          completed_consultations: calculatedStats.completed || 0,
          pending_consultations: calculatedStats.pending || 0,
          cancelled_consultations: calculatedStats.cancelled || 0,
          total_revenue: calculatedStats.totalRevenue?.toString() || '0',
          average_satisfaction_rating: calculatedStats.avgRating?.toString() || null,
          total_hours_worked: calculatedStats.totalHours?.toString() || '0',
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      stats = newStats;
    }

    // Get employee information
    const employee = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        role: users.role,
        specialization: users.specialization,
        experience_years: users.experience_years,
      })
      .from(users)
      .where(eq(users.id, targetEmployeeId))
      .limit(1);

    return NextResponse.json({
      success: true,
      employee: employee[0],
      stats: stats[0]
    });

  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // Recalculate stats for all employees for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const employees = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.is_active, true));

    const updatedStats = [];

    for (const employee of employees) {
      const consultationStats = await db
        .select({
          total: sql<number>`count(*)::int`,
          completed: sql<number>`count(case when status = 'completed' then 1 end)::int`,
          pending: sql<number>`count(case when status = 'pending' then 1 end)::int`,
          cancelled: sql<number>`count(case when status = 'cancelled' then 1 end)::int`,
          avgRating: sql<number>`avg(client_satisfaction_rating)`,
          totalRevenue: sql<number>`sum(consultation_fee)`,
          totalHours: sql<number>`sum(actual_duration) / 60.0`,
        })
        .from(consultations)
        .where(and(
          eq(consultations.assigned_to, employee.id),
          sql`extract(month from created_at) = ${currentMonth}`,
          sql`extract(year from created_at) = ${currentYear}`
        ));

      const calculatedStats = consultationStats[0];

      // Upsert stats
      const existingStats = await db
        .select()
        .from(employeeStats)
        .where(and(
          eq(employeeStats.employee_id, employee.id),
          eq(employeeStats.month, currentMonth),
          eq(employeeStats.year, currentYear)
        ))
        .limit(1);

      if (existingStats.length > 0) {
        // Update existing
        const updated = await db
          .update(employeeStats)
          .set({
            total_consultations: calculatedStats.total || 0,
            completed_consultations: calculatedStats.completed || 0,
            pending_consultations: calculatedStats.pending || 0,
            cancelled_consultations: calculatedStats.cancelled || 0,
            total_revenue: calculatedStats.totalRevenue?.toString() || '0',
            average_satisfaction_rating: calculatedStats.avgRating?.toString() || null,
            total_hours_worked: calculatedStats.totalHours?.toString() || '0',
            updated_at: new Date(),
          })
          .where(eq(employeeStats.id, existingStats[0].id))
          .returning();
        
        updatedStats.push(updated[0]);
      } else {
        // Create new
        const created = await db
          .insert(employeeStats)
          .values({
            employee_id: employee.id,
            month: currentMonth,
            year: currentYear,
            total_consultations: calculatedStats.total || 0,
            completed_consultations: calculatedStats.completed || 0,
            pending_consultations: calculatedStats.pending || 0,
            cancelled_consultations: calculatedStats.cancelled || 0,
            total_revenue: calculatedStats.totalRevenue?.toString() || '0',
            average_satisfaction_rating: calculatedStats.avgRating?.toString() || null,
            total_hours_worked: calculatedStats.totalHours?.toString() || '0',
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();
        
        updatedStats.push(created[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Employee stats recalculated successfully',
      updatedCount: updatedStats.length
    });

  } catch (error) {
    console.error('Error recalculating employee stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
