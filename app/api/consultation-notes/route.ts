import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultationNotes, consultations } from '@/lib/schema';
import { getAuthUser } from '@/lib/auth';
import { desc, eq, and } from 'drizzle-orm';

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

    if (!consultationId) {
      return NextResponse.json(
        { error: 'Consultation ID is required' },
        { status: 400 }
      );
    }

    // Check if user has access to this consultation
    const consultation = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, parseInt(consultationId)))
      .limit(1);

    if (consultation.length === 0) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Permission check
    if (user.role !== 'admin' && consultation[0].assigned_to !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const notes = await db
      .select()
      .from(consultationNotes)
      .where(eq(consultationNotes.consultation_id, parseInt(consultationId)))
      .orderBy(desc(consultationNotes.created_at));

    return NextResponse.json({
      success: true,
      notes
    });

  } catch (error) {
    console.error('Error fetching consultation notes:', error);
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

    const { consultation_id, note_type, title, content, is_private, attachments } = await request.json();

    if (!consultation_id || !content) {
      return NextResponse.json(
        { error: 'Consultation ID and content are required' },
        { status: 400 }
      );
    }

    // Check if user has access to this consultation
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
    if (user.role !== 'admin' && consultation[0].assigned_to !== user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const newNote = await db
      .insert(consultationNotes)
      .values({
        consultation_id,
        author_id: user.id,
        note_type: note_type || 'general',
        title,
        content,
        is_private: is_private || false,
        attachments: attachments || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Note added successfully',
      note: newNote[0]
    });

  } catch (error) {
    console.error('Error creating consultation note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
