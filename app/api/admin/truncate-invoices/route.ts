import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { invoices, invoiceSequence } from '@/lib/schema';
import { sql } from 'drizzle-orm';

// Sample invoice data to recreate
const sampleInvoices = [
  {
    invoice_number: 'INV-2025-0001',
    client_name: 'John Smith',
    client_email: 'john.smith@email.com',
    client_phone: '+1-555-0101',
    service_type: 'Financial Planning',
    service_description: 'Comprehensive financial planning consultation including retirement planning, investment advice, and tax optimization strategies.',
    amount: '500.00',
    tax_amount: '50.00',
    total_amount: '550.00',
    status: 'sent' as const,
    payment_status: 'pending' as const,
    payment_terms: '30',
    due_date: new Date('2025-02-15'),
  },
  {
    invoice_number: 'INV-2025-0002',
    client_name: 'Sarah Johnson',
    client_email: 'sarah.j@company.com',
    client_phone: '+1-555-0102',
    service_type: 'Tax Consulting',
    service_description: 'Tax preparation and filing for personal and business returns, including deduction optimization.',
    amount: '750.00',
    tax_amount: '75.00',
    total_amount: '825.00',
    status: 'paid' as const,
    payment_status: 'paid' as const,
    payment_terms: '15',
    due_date: new Date('2025-01-30'),
    paid_date: new Date('2025-01-25'),
  },
  {
    invoice_number: 'INV-2025-0003',
    client_name: 'Michael Brown',
    client_email: 'mbrown@startup.tech',
    client_phone: '+1-555-0103',
    service_type: 'Business Consulting',
    service_description: 'Business financial analysis, cash flow management, and growth strategy consultation for tech startup.',
    amount: '1200.00',
    tax_amount: '120.00',
    total_amount: '1320.00',
    status: 'draft' as const,
    payment_status: 'pending' as const,
    payment_terms: '45',
    due_date: new Date('2025-03-01'),
  },
  {
    invoice_number: 'INV-2025-0004',
    client_name: 'Emily Davis',
    client_email: 'emily.davis@portfolio.com',
    client_phone: '+1-555-0104',
    service_type: 'Investment Advisory',
    service_description: 'Portfolio review and investment advisory services including risk assessment and diversification recommendations.',
    amount: '800.00',
    tax_amount: '80.00',
    total_amount: '880.00',
    status: 'sent' as const,
    payment_status: 'pending' as const,
    payment_terms: '30',
    due_date: new Date('2025-02-20'),
  },
  {
    invoice_number: 'INV-2025-0005',
    client_name: 'Robert Wilson',
    client_email: 'r.wilson@realestate.biz',
    client_phone: '+1-555-0105',
    service_type: 'Estate Planning',
    service_description: 'Estate planning consultation including will preparation, trust setup, and tax-efficient wealth transfer strategies.',
    amount: '1500.00',
    tax_amount: '150.00',
    total_amount: '1650.00',
    status: 'overdue' as const,
    payment_status: 'pending' as const,
    payment_terms: '30',
    due_date: new Date('2025-01-15'),
  },
  {
    invoice_number: 'INV-2025-0006',
    client_name: 'Lisa Chen',
    client_email: 'lisa.chen@imports.global',
    client_phone: '+1-555-0106',
    service_type: 'International Tax',
    service_description: 'International tax compliance and reporting services for import/export business operations.',
    amount: '950.00',
    tax_amount: '95.00',
    total_amount: '1045.00',
    status: 'paid' as const,
    payment_status: 'paid' as const,
    payment_terms: '30',
    due_date: new Date('2025-01-31'),
    paid_date: new Date('2025-01-28'),
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️  Truncating invoices table...');
    
    // Truncate the invoices table
    await db.execute(sql`TRUNCATE TABLE invoices RESTART IDENTITY CASCADE`);
    console.log('✅ Invoices table truncated successfully');

    // Reset the invoice sequence for 2025
    console.log('🔄 Resetting invoice sequence...');
    await db.execute(sql`DELETE FROM invoice_sequence WHERE year = 2025`);
    
    // Insert the invoice sequence for 2025
    await db.insert(invoiceSequence).values({
      current_number: 6,
      year: 2025,
    });
    console.log('✅ Invoice sequence reset to 6 for year 2025');

    console.log('📝 Recreating 6 invoice records...');
    
    // Insert all sample invoices
    const insertedInvoices = await db.insert(invoices)
      .values(sampleInvoices)
      .returning();

    console.log(`✅ Successfully created ${insertedInvoices.length} invoice records`);

    return NextResponse.json({
      success: true,
      message: 'Invoice table truncated and recreated successfully',
      invoices: insertedInvoices,
      count: insertedInvoices.length
    });
    
  } catch (error) {
    console.error('❌ Error during truncate and recreate operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to truncate and recreate invoices',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
