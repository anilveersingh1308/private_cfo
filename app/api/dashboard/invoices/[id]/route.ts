import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    // Fetch the invoice from database
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoice = result[0];
    
    // Convert decimal values to numbers for JSON serialization
    const formattedInvoice = {
      ...invoice,
      amount: Number(invoice.amount),
      tax_amount: Number(invoice.tax_amount),
      total_amount: Number(invoice.total_amount)
    };

    return NextResponse.json(formattedInvoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.client_name || !data.client_email || !data.service_type || !data.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate tax and total
    const amount = parseFloat(data.amount);
    const taxAmount = amount * 0.18; // 18% GST
    const totalAmount = amount + taxAmount;

    // Update the invoice
    const result = await db
      .update(invoices)
      .set({
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || null,
        service_type: data.service_type,
        service_description: data.service_description || null,
        amount: amount.toString(),
        tax_amount: taxAmount.toString(),
        total_amount: totalAmount.toString(),
        payment_terms: data.payment_terms || '30',
        due_date: new Date(data.due_date),
        status: data.status || 'draft',
        updated_at: new Date()
      })
      .where(eq(invoices.id, invoiceId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const updatedInvoice = result[0];
    
    // Convert decimal values to numbers for JSON serialization
    const formattedInvoice = {
      ...updatedInvoice,
      amount: Number(updatedInvoice.amount),
      tax_amount: Number(updatedInvoice.tax_amount),
      total_amount: Number(updatedInvoice.total_amount)
    };

    return NextResponse.json({
      message: 'Invoice updated successfully',
      invoice: formattedInvoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    // Delete the invoice
    const result = await db
      .delete(invoices)
      .where(eq(invoices.id, invoiceId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
