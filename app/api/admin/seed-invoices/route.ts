import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices } from '@/lib/schema';

export async function POST() {
  try {
    // Sample invoice data
    const sampleInvoices = [
      {
        invoice_number: 'INV-2024-001',
        client_name: 'Rajesh Kumar',
        client_email: 'rajesh.kumar@email.com',
        client_phone: '+91 98765 43210',
        service_type: 'Financial Planning',
        service_description: 'Comprehensive financial planning consultation including investment strategy and retirement planning.',
        amount: '15000',
        tax_amount: '2700',
        total_amount: '17700',
        status: 'paid' as const,
        payment_status: 'paid' as const,
        payment_terms: '30',
        payment_method: 'Bank Transfer',
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        paid_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        invoice_number: 'INV-2024-002',
        client_name: 'Priya Sharma',
        client_email: 'priya.sharma@email.com',
        client_phone: '+91 98765 43211',
        service_type: 'Tax Consulting',
        service_description: 'Annual tax filing and optimization consultation.',
        amount: '8000',
        tax_amount: '1440',
        total_amount: '9440',
        status: 'sent' as const,
        payment_status: 'pending' as const,
        payment_terms: '30',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        invoice_number: 'INV-2024-003',
        client_name: 'TechCorp Solutions',
        client_email: 'accounts@techcorp.com',
        client_phone: '+91 98765 43212',
        service_type: 'Business Consulting',
        service_description: 'Strategic business analysis and growth planning.',
        amount: '45000',
        tax_amount: '8100',
        total_amount: '53100',
        status: 'overdue' as const,
        payment_status: 'pending' as const,
        payment_terms: '30',
        due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        invoice_number: 'INV-2024-004',
        client_name: 'Amit Verma',
        client_email: 'amit.verma@email.com',
        client_phone: '+91 98765 43213',
        service_type: 'Investment Advice',
        service_description: 'Portfolio analysis and investment recommendations.',
        amount: '12000',
        tax_amount: '2160',
        total_amount: '14160',
        status: 'draft' as const,
        payment_status: 'pending' as const,
        payment_terms: '30',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        invoice_number: 'INV-2024-005',
        client_name: 'SmartBiz Enterprises',
        client_email: 'finance@smartbiz.com',
        client_phone: '+91 98765 43214',
        service_type: 'Audit Services',
        service_description: 'Financial audit and compliance review.',
        amount: '35000',
        tax_amount: '6300',
        total_amount: '41300',
        status: 'sent' as const,
        payment_status: 'pending' as const,
        payment_terms: '45',
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        invoice_number: 'INV-2024-006',
        client_name: 'Global Retail Ltd',
        client_email: 'accounts@globalretail.com',
        client_phone: '+91 98765 43215',
        service_type: 'Financial Planning',
        service_description: 'Long-term financial strategy and cash flow analysis.',
        amount: '28000',
        tax_amount: '5040',
        total_amount: '33040',
        status: 'paid' as const,
        payment_status: 'paid' as const,
        payment_terms: '30',
        payment_method: 'Credit Card',
        due_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        paid_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ];

    // Clear existing invoices and insert new ones
    await db.delete(invoices);
    const result = await db.insert(invoices).values(sampleInvoices).returning();

    return NextResponse.json({
      message: `Successfully seeded ${result.length} invoices`,
      invoices: result.length
    });
  } catch (error) {
    console.error('Error seeding invoices:', error);
    return NextResponse.json(
      { error: 'Failed to seed invoices' },
      { status: 500 }
    );
  }
}
