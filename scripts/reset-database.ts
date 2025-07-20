import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load environment variables
config({ path: '.env.local' });

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function resetDatabase() {
  try {
    console.log('🗂️ Starting database reset...');

    // Drop all existing tables to start fresh
    console.log('🧹 Dropping existing tables...');
    
    const dropTableQueries = [
      'DROP TABLE IF EXISTS system_logs CASCADE;',
      'DROP TABLE IF EXISTS consultation_notes CASCADE;',
      'DROP TABLE IF EXISTS consultation_sessions CASCADE;',
      'DROP TABLE IF EXISTS invoices CASCADE;',
      'DROP TABLE IF EXISTS employee_stats CASCADE;',
      'DROP TABLE IF EXISTS consultation_forms CASCADE;',
      'DROP TABLE IF EXISTS consultations CASCADE;',
      'DROP TABLE IF EXISTS newsletter_subscribers CASCADE;',
      'DROP TABLE IF EXISTS admin_settings CASCADE;',
      'DROP TABLE IF EXISTS dashboard_analytics CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
      
      // Drop enums
      'DROP TYPE IF EXISTS user_role CASCADE;',
      'DROP TYPE IF EXISTS user_status CASCADE;',
      'DROP TYPE IF EXISTS consultation_status CASCADE;',
      'DROP TYPE IF EXISTS payment_status CASCADE;',
      'DROP TYPE IF EXISTS subscriber_status CASCADE;',
      'DROP TYPE IF EXISTS log_level CASCADE;',
      'DROP TYPE IF EXISTS consultation_type CASCADE;',
      'DROP TYPE IF EXISTS priority CASCADE;'
    ];

    for (const query of dropTableQueries) {
      try {
        await sql(query);
        console.log(`✅ Executed: ${query.split(' ')[2]} ${query.split(' ')[3]}`);
      } catch (error) {
        console.log(`⚠️ Skipped: ${query.split(' ')[2]} ${query.split(' ')[3]} (might not exist)`);
      }
    }

    console.log('✅ Database reset completed!');
    console.log('Now run: npm run db:push');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset script
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('✅ Reset completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Reset failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
