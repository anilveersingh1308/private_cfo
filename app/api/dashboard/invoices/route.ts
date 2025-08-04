import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices, invoiceSequence } from '@/lib/schema';
import { desc, asc, ilike, or, eq, and } from 'drizzle-orm';
import { getNextInvoiceNumber } from '@/lib/invoice-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          ilike(invoices.client_name, `%${search}%`),
          ilike(invoices.client_email, `%${search}%`),
          ilike(invoices.invoice_number, `%${search}%`),
          ilike(invoices.service_type, `%${search}%`)
        )
      );
    }

    if (status && status !== 'all') {
      whereConditions.push(eq(invoices.status, status as any));
    }

    // Build query
    const result = await db
      .select()
      .from(invoices)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(
        sortOrder === 'asc' 
          ? asc(sortBy === 'client_name' ? invoices.client_name :
                sortBy === 'amount' ? invoices.amount :
                sortBy === 'due_date' ? invoices.due_date :
                invoices.created_at)
          : desc(sortBy === 'client_name' ? invoices.client_name :
                 sortBy === 'amount' ? invoices.amount :
                 sortBy === 'due_date' ? invoices.due_date :
                 invoices.created_at)
      );

    // Convert decimal values to numbers for JSON serialization
    const formattedResult = result.map(invoice => ({
      ...invoice,
      amount: parseFloat(invoice.amount || '0'),
      tax_amount: parseFloat(invoice.tax_amount || '0'),
      total_amount: parseFloat(invoice.total_amount || '0'),
      due_date: invoice.due_date?.toISOString(),
      paid_date: invoice.paid_date?.toISOString(),
      created_at: invoice.created_at?.toISOString(),
      updated_at: invoice.updated_at?.toISOString()
    }));

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['client_name', 'client_email', 'service_type', 'amount', 'due_date'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique sequential invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    // Calculate due date based on payment terms
    const dueDate = new Date(body.due_date);
    const amount = parseFloat(body.amount);
    const taxAmount = amount * 0.18; // 18% GST
    const totalAmount = amount + taxAmount;

    // Create new invoice in database
    const newInvoice = {
      invoice_number: invoiceNumber,
      client_name: body.client_name,
      client_email: body.client_email,
      client_phone: body.client_phone || null,
      service_type: body.service_type,
      service_description: body.description || null,
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      status: (body.status || 'draft') as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      payment_status: 'pending' as 'paid' | 'pending' | 'failed',
      payment_terms: body.payment_terms || '30',
      due_date: dueDate,
      consultation_id: body.consultation_id || null
    };

    const result = await db.insert(invoices).values(newInvoice).returning();

    // Format the response
    const formattedInvoice = {
      ...result[0],
      amount: parseFloat(result[0].amount || '0'),
      tax_amount: parseFloat(result[0].tax_amount || '0'),
      total_amount: parseFloat(result[0].total_amount || '0'),
      due_date: result[0].due_date?.toISOString(),
      paid_date: result[0].paid_date?.toISOString(),
      created_at: result[0].created_at?.toISOString(),
      updated_at: result[0].updated_at?.toISOString()
    };

    console.log('Created new invoice:', formattedInvoice);

    return NextResponse.json(formattedInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
