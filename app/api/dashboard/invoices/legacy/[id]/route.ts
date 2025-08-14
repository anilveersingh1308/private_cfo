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

    // Get the invoice number for this ID to redirect to the new route
    const result = await db
      .select({ invoice_number: invoices.invoice_number })
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Return redirect information
    return NextResponse.json({
      redirect: `/dashboard/invoices/${result[0].invoice_number}`,
      invoice_number: result[0].invoice_number,
      message: 'This route has been moved. Please use the invoice number-based route.'
    });
  } catch (error) {
    console.error('Error in legacy invoice redirect:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
