import { NextRequest, NextResponse } from 'next/server';
import { initializeInvoiceSequence } from '@/lib/invoice-utils';

export async function POST() {
  try {
    const currentYear = new Date().getFullYear();
    await initializeInvoiceSequence(currentYear);
    
    return NextResponse.json({
      message: `Invoice sequence initialized for year ${currentYear}`,
      year: currentYear
    });
  } catch (error) {
    console.error('Error initializing invoice sequence:', error);
    return NextResponse.json(
      { error: 'Failed to initialize invoice sequence' },
      { status: 500 }
    );
  }
}
