import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request, { params }) {
  const paymentId = Number(params.id);
  if (isNaN(paymentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  const payment = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment || payment.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const p = payment[0];
  // Extract metadata fields
  let paymentMethod = '';
  let paymentType = '';
  if (p.metadata && typeof p.metadata === 'object') {
    paymentMethod = (p.metadata as any).paymentMethod || '';
    paymentType = (p.metadata as any).paymentType || '';
  }
  return NextResponse.json({
    invoiceNumber: p.invoiceNumber,
    consultant: p.consultant,
    amount: p.amount,
    transactionId: p.transactionId,
    paymentDate: p.paymentDate,
    status: p.status,
    notes: p.notes,
    paymentMethod,
    paymentType
  });
}

export async function PUT(request, { params }) {
  const paymentId = Number(params.id);
  if (isNaN(paymentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  const body = await request.json();
  // Update payment record
  await db.update(payments)
    .set({
      invoiceNumber: body.invoiceNumber,
      consultant: body.consultant,
      amount: body.amount,
      transactionId: body.transactionId,
      paymentDate: body.paymentDate,
      status: body.status,
      notes: body.notes,
      metadata: {
        paymentMethod: body.paymentMethod,
        paymentType: body.paymentType
      }
    })
    .where(eq(payments.id, paymentId));
  return NextResponse.json({ success: true });
}
