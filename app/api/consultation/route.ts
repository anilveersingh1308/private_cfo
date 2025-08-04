import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consultations } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received consultation submission:', {
      name: body.name,
      phone: body.phone,
      email: body.email,
      timestamp: new Date().toISOString()
    });
    
    // Validate required fields (removed countryCode since we're India-only)
    const requiredFields = ['name', 'phone', 'city', 'occupation', 'email', 'privacy', 'not_job'];
    for (const field of requiredFields) {
      if (field === 'privacy' || field === 'not_job') {
        if (body[field] !== true) {
          return NextResponse.json(
            { error: `${field} must be accepted` },
            { status: 400 }
          );
        }
      } else {
        if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate name (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(body.name)) {
      return NextResponse.json(
        { error: 'Name should only contain letters and spaces' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number (India only)
    const { validatePhoneNumber } = require('@/lib/phone-utils');
    if (!validatePhoneNumber(body.phone, '+91')) {
      return NextResponse.json(
        { error: 'Invalid phone number format for India. Expected format: +91 XXXXX XXXXX' },
        { status: 400 }
      );
    }

    // Trim string fields
    const trimmedBody = {
      ...body,
      name: body.name.trim(),
      city: body.city.trim(),
      occupation: body.occupation.trim(),
      email: body.email.trim().toLowerCase(),
      age: body.age ? body.age.trim() : null,
      guidance: body.guidance ? body.guidance.trim() : null,
      industry: body.industry ? body.industry.trim() : null,
      income: body.income ? body.income.trim() : null,
      preferred_communication: body.preferred_communication ? body.preferred_communication.trim() : null,
      consultation_timing: body.consultation_timing ? body.consultation_timing.trim() : null,
      message: body.message ? body.message.trim() : null,
    };

    // Insert into database - map form data to consultations table structure
    const result = await db.insert(consultations).values({
      client_name: trimmedBody.name,
      client_email: trimmedBody.email,
      service_type: trimmedBody.guidance || 'General Consultation',
      status: 'pending', // Default status for new consultation requests
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
      duration: 60, // Default 60 minutes
      amount: '0', // Will be set later when scheduling (as string for decimal type)
      payment_status: 'pending',
      consultant: null, // Will be assigned later
      meeting_link: null, // Will be set when scheduling
      notes: `Phone: ${trimmedBody.phone}\nAge: ${trimmedBody.age || 'Not specified'}\nCity: ${trimmedBody.city}\nOccupation: ${trimmedBody.occupation}\nIndustry: ${trimmedBody.industry || 'Not specified'}\nIncome: ${trimmedBody.income || 'Not specified'}\nPreferred Communication: ${trimmedBody.preferred_communication || 'Not specified'}\nPreferred Timing: ${trimmedBody.consultation_timing || 'Not specified'}\nMessage: ${trimmedBody.message || 'None'}\nMarketing Consent: ${body.marketing_consent ? 'Yes' : 'No'}`,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    console.log('Database insertion successful:', {
      id: result[0].id,
      name: trimmedBody.name,
      phone: trimmedBody.phone,
      email: trimmedBody.email,
      country_code: '+91',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consultation request submitted successfully',
        id: result[0].id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Database error during consultation submission:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all consultations (for admin purposes)
    const allConsultations = await db.select().from(consultations);
    
    return NextResponse.json({
      success: true,
      data: allConsultations
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
