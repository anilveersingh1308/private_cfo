import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultationSessions, consultations, users } from '@/lib/schema';
import { getAuthUser } from '@/lib/auth';
import { desc, eq, and, or, gte, lte } from 'drizzle-orm';

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
    const consultationId = searchParams.get('consultation_id');
    const advisorId = searchParams.get('advisor_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const whereConditions: any[] = [];

    // Permission based filtering
    if (user.role !== 'admin') {
      whereConditions.push(eq(consultationSessions.advisor_id, user.id));
    } else if (advisorId) {
      whereConditions.push(eq(consultationSessions.advisor_id, parseInt(advisorId)));
    }

    if (consultationId) {
      whereConditions.push(eq(consultationSessions.consultation_id, parseInt(consultationId)));
    }

    if (startDate) {
      whereConditions.push(gte(consultationSessions.scheduled_start, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(consultationSessions.scheduled_start, new Date(endDate)));
    }

    let sessions;
    if (whereConditions.length > 0) {
      sessions = await db
        .select({
          session: consultationSessions,
          consultation: consultations,
          advisor: {
            id: users.id,
            first_name: users.first_name,
            last_name: users.last_name,
            email: users.email,
          }
        })
        .from(consultationSessions)
        .leftJoin(consultations, eq(consultationSessions.consultation_id, consultations.id))
        .leftJoin(users, eq(consultationSessions.advisor_id, users.id))
        .where(and(...whereConditions))
        .orderBy(desc(consultationSessions.scheduled_start));
    } else {
      sessions = await db
        .select({
          session: consultationSessions,
          consultation: consultations,
          advisor: {
            id: users.id,
            first_name: users.first_name,
            last_name: users.last_name,
            email: users.email,
          }
        })
        .from(consultationSessions)
        .leftJoin(consultations, eq(consultationSessions.consultation_id, consultations.id))
        .leftJoin(users, eq(consultationSessions.advisor_id, users.id))
        .orderBy(desc(consultationSessions.scheduled_start));
    }

    return NextResponse.json({
      success: true,
      sessions: sessions.map(item => ({
        ...item.session,
        consultation: item.consultation,
        advisor: item.advisor
      }))
    });

  } catch (error) {
    console.error('Error fetching consultation sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      consultation_id,
      advisor_id,
      session_type,
      scheduled_start,
      scheduled_end,
      meeting_link,
      session_notes
    } = await request.json();

    if (!consultation_id || !scheduled_start || !scheduled_end) {
      return NextResponse.json(
        { error: 'Consultation ID, scheduled start, and scheduled end are required' },
        { status: 400 }
      );
    }

    // Check if consultation exists
    const consultation = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, consultation_id))
      .limit(1);

    if (consultation.length === 0) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Permission check
    const targetAdvisorId = advisor_id || user.id;
    if (user.role !== 'admin' && targetAdvisorId !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Verify the advisor can be assigned to this consultation
    if (user.role !== 'admin' && consultation[0].assigned_to !== user.id) {
      return NextResponse.json(
        { error: 'Cannot schedule session for consultation not assigned to you' },
        { status: 403 }
      );
    }

    const newSession = await db
      .insert(consultationSessions)
      .values({
        consultation_id,
        advisor_id: targetAdvisorId,
        session_type: session_type || 'video_call',
        scheduled_start: new Date(scheduled_start),
        scheduled_end: new Date(scheduled_end),
        meeting_link,
        session_notes,
        session_status: 'scheduled',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Session scheduled successfully',
      session: newSession[0]
    });

  } catch (error) {
    console.error('Error creating consultation session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { sessionId, ...updateData } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if session exists and user has permission
    const session = await db
      .select()
      .from(consultationSessions)
      .where(eq(consultationSessions.id, sessionId))
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const sessionData = session[0];

    // Permission check
    if (user.role !== 'admin' && sessionData.advisor_id !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Prepare update data
    const allowedFields = [
      'session_type', 'scheduled_start', 'scheduled_end', 'actual_start',
      'actual_end', 'session_status', 'meeting_link', 'session_notes', 'action_items'
    ];

    const updates: any = { updated_at: new Date() };
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'scheduled_start' || field === 'scheduled_end' || 
            field === 'actual_start' || field === 'actual_end') {
          updates[field] = updateData[field] ? new Date(updateData[field]) : null;
        } else {
          updates[field] = updateData[field];
        }
      }
    }

    const updatedSession = await db
      .update(consultationSessions)
      .set(updates)
      .where(eq(consultationSessions.id, sessionId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully',
      session: updatedSession[0]
    });

  } catch (error) {
    console.error('Error updating consultation session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
