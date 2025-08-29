export async function GET() {
  try {
    const paymentsList = await db.select().from(payments).orderBy(payments.id);
    // Transform records for frontend
    const transformed = paymentsList.map(p => {
      let paymentMethod = '';
      let paymentType = '';
      if (p.metadata && typeof p.metadata === 'object') {
        paymentMethod = (p.metadata as any).paymentMethod || '';
        paymentType = (p.metadata as any).paymentType || '';
      }
      return {
        id: p.id,
        invoiceNumber: p.invoiceNumber,
        clientName: p.consultant,
        amount: Number(p.amount),
        status: p.status,
        paymentMethod,
        paymentType,
        reference: p.transactionId,
        notes: p.notes,
        paidDate: p.paymentDate,
        dueDate: '', // Set blank or fetch from invoice if needed
      };
    });
    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/drizzle/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      invoiceNumber,
      consultant,
      amount,
      transactionId,
      paymentDate,
      status,
      notes,
      metadata
    } = body;

    // Basic validation
    if (!amount) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Generate unique paymentId: pyt-<year>-<number>
    const currentYear = new Date().getFullYear();
    // Get latest payment for this year
    const { sql } = await import('drizzle-orm');
    const latestPayment = await db.select().from(payments)
      .where(sql`${payments.paymentId} ilike ${`pyt-${currentYear}-%`}`)
  .orderBy(sql`${payments.id} DESC`)
      .limit(1);
    let nextNumber = 1;
    if (latestPayment.length > 0 && latestPayment[0].paymentId) {
      const match = latestPayment[0].paymentId.match(/pyt-\d{4}-(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const paymentId = `pyt-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

    // Insert payment into database using Drizzle ORM
    const [payment] = await db.insert(payments).values({
      paymentId,
      invoiceNumber,
      consultant,
      amount,
      transactionId,
      paymentDate: paymentDate || new Date().toISOString(),
      status: status || 'paid',
      notes,
      metadata
    }).returning();

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record payment.' }, { status: 500 });
  }
}
