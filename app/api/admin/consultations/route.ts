import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { consultations, users, invoices } from '@/lib/schema';
import { eq, desc, count, sum, and, gte, lte } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const consultant = searchParams.get('consultant');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build query conditions
    const conditions = [];
    if (status) conditions.push(eq(consultations.status, status as any));
    if (consultant) conditions.push(eq(consultations.consultant, consultant));
    if (dateFrom) conditions.push(gte(consultations.scheduled_date, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(consultations.scheduled_date, new Date(dateTo)));

    // Fetch consultations with optional filtering
    const consultationList = await db
      .select({
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
        meeting_link: consultations.meeting_link,
        notes: consultations.notes,
        created_at: consultations.created_at,
        updated_at: consultations.updated_at
      })
      .from(consultations)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(consultations.scheduled_date));

    return NextResponse.json({
      success: true,
      data: consultationList,
      count: consultationList.length
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      client_name, 
      client_email, 
      service_type, 
      scheduled_date, 
      duration, 
      amount, 
      consultant,
      meeting_link,
      notes 
    } = body;

    // Validate required fields
    if (!client_name || !client_email || !service_type || !scheduled_date || !amount || !consultant) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new consultation
    const newConsultation = await db
      .insert(consultations)
      .values({
        client_name,
        client_email,
        service_type,
        scheduled_date: new Date(scheduled_date),
        duration: duration || 60,
        amount,
        consultant,
        meeting_link: meeting_link || null,
        notes: notes || null,
        status: 'scheduled',
        payment_status: 'pending'
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newConsultation[0],
      message: 'Consultation created successfully'
    });

  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create consultation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      client_name, 
      client_email, 
      service_type, 
      scheduled_date, 
      duration, 
      amount, 
      consultant,
      meeting_link,
      notes,
      status,
      payment_status 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Consultation ID is required' },
        { status: 400 }
      );
    }

    // Update consultation
    const updatedConsultation = await db
      .update(consultations)
      .set({
        client_name,
        client_email,
        service_type,
        scheduled_date: scheduled_date ? new Date(scheduled_date) : undefined,
        duration,
        amount,
        consultant,
        meeting_link,
        notes,
        status,
        payment_status,
        updated_at: new Date()
      })
      .where(eq(consultations.id, id))
      .returning();

    if (updatedConsultation.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedConsultation[0],
      message: 'Consultation updated successfully'
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Consultation ID is required' },
        { status: 400 }
      );
    }

    // Check if consultation has associated invoices
    const consultationInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.consultation_id, parseInt(id)));

    if (consultationInvoices.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete consultation with associated invoices' },
        { status: 400 }
      );
    }

    // Delete consultation
    const deletedConsultation = await db
      .delete(consultations)
      .where(eq(consultations.id, parseInt(id)))
      .returning();

    if (deletedConsultation.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete consultation' },
      { status: 500 }
    );
  }
}
