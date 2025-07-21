import { db } from '../lib/db';
import { invoices } from '../lib/schema';
import { writeFileSync } from 'fs';

async function backupInvoices() {
  try {
    console.log('Fetching current invoice records...');
    const allInvoices = await db.select().from(invoices);
    
    console.log(`Found ${allInvoices.length} invoice records:`);
    console.log(JSON.stringify(allInvoices, null, 2));
    
    // Save to file for backup
    writeFileSync('./scripts/invoices-backup.json', JSON.stringify(allInvoices, null, 2));
    console.log('\nBackup saved to scripts/invoices-backup.json');
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
  process.exit(0);
}

backupInvoices();
