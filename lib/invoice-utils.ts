import { db } from './db';
import { invoiceSequence, invoices } from './schema';
import { eq, like, desc } from 'drizzle-orm';

export async function getNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  try {
    // Try to get current sequence for this year
    const existingSequence = await db
      .select()
      .from(invoiceSequence)
      .where(eq(invoiceSequence.year, currentYear))
      .limit(1);

    let nextNumber: number;

    if (existingSequence.length === 0) {
      // Create new sequence for this year starting from 1
      const newSequence = await db
        .insert(invoiceSequence)
        .values({
          current_number: 1,
          year: currentYear,
        })
        .returning();
      
      nextNumber = newSequence[0].current_number;
    } else {
      // Increment existing sequence
      const updated = await db
        .update(invoiceSequence)
        .set({ 
          current_number: existingSequence[0].current_number + 1,
          updated_at: new Date()
        })
        .where(eq(invoiceSequence.year, currentYear))
        .returning();
      
      nextNumber = updated[0].current_number;
    }

    // Format invoice number as INV-YYYY-NNNN (4 digits with leading zeros)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    const invoiceNumber = `INV-${currentYear}-${formattedNumber}`;
    
    return invoiceNumber;

  } catch (error) {
    console.error('Error generating invoice number:', error);
    
    // Fallback to timestamp-based number if sequence fails
    const timestamp = Date.now().toString().slice(-6);
    const fallbackNumber = `INV-${currentYear}-${timestamp}`;
    
    return fallbackNumber;
  }
}

export async function initializeInvoiceSequence(year?: number): Promise<void> {
  const targetYear = year || new Date().getFullYear();
  
  try {
    // Check if sequence already exists for this year
    const existing = await db
      .select()
      .from(invoiceSequence)
      .where(eq(invoiceSequence.year, targetYear))
      .limit(1);

    if (existing.length === 0) {
      // Get the highest existing invoice number for this year
      const existingInvoices = await db
        .select()
        .from(invoices)
        .where(like(invoices.invoice_number, `INV-${targetYear}-%`))
        .orderBy(desc(invoices.invoice_number))
        .limit(1);

      let startingNumber = 0;
      
      if (existingInvoices.length > 0) {
        // Extract number from existing invoice (e.g., "INV-2025-0001" -> 1)
        const lastInvoiceNumber = existingInvoices[0].invoice_number;
        const numberPart = lastInvoiceNumber.split('-')[2];
        startingNumber = parseInt(numberPart) || 0;
      }

      // Create initial sequence
      await db
        .insert(invoiceSequence)
        .values({
          current_number: startingNumber,
          year: targetYear,
        });
      
      console.log(`Initialized invoice sequence for year ${targetYear} starting from ${startingNumber}`);
    }
  } catch (error) {
    console.error('Error initializing invoice sequence:', error);
  }
}
