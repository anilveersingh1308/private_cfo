import { db } from '../lib/db.ts';
import { users } from '../lib/schema.ts';
import { hashPassword } from '../lib/auth.ts';
import { eq } from 'drizzle-orm';

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@privatecfo.com',
  password: 'admin123',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin'
};

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create tables using raw SQL (for compatibility)
    try {
      // Create enums if they don't exist
      await db.execute(`
        DO $$ BEGIN
          CREATE TYPE "public"."consultation_status" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rescheduled');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await db.execute(`
        DO $$ BEGIN
          CREATE TYPE "public"."consultation_type" AS ENUM('initial', 'follow_up', 'emergency', 'regular');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await db.execute(`
        DO $$ BEGIN
          CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'urgent');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      // Add new columns to consultations table if they don't exist
      const columnsToAdd = [
        'consultation_type consultation_type DEFAULT \'initial\'',
        'priority priority DEFAULT \'medium\'',
        'scheduled_date timestamp',
        'completed_date timestamp',
        'estimated_duration integer',
        'actual_duration integer',
        'consultation_fee numeric(10,2)',
        'client_satisfaction_rating integer',
        'advisor_notes text',
        'follow_up_required boolean DEFAULT false',
        'follow_up_date timestamp'
      ];

      for (const column of columnsToAdd) {
        try {
          await db.execute(`ALTER TABLE consultations ADD COLUMN IF NOT EXISTS ${column};`);
        } catch (error) {
          console.log(`Column might already exist: ${column}`);
        }
      }

      // Create consultation_notes table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS consultation_notes (
          id serial PRIMARY KEY NOT NULL,
          consultation_id integer NOT NULL,
          author_id integer NOT NULL,
          note_type varchar(50) DEFAULT 'general' NOT NULL,
          title varchar(255),
          content text NOT NULL,
          is_private boolean DEFAULT false,
          attachments json,
          created_at timestamp DEFAULT now() NOT NULL,
          updated_at timestamp DEFAULT now() NOT NULL,
          FOREIGN KEY (consultation_id) REFERENCES consultations(id),
          FOREIGN KEY (author_id) REFERENCES users(id)
        );
      `);

      // Create consultation_sessions table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS consultation_sessions (
          id serial PRIMARY KEY NOT NULL,
          consultation_id integer NOT NULL,
          advisor_id integer NOT NULL,
          session_type varchar(50) DEFAULT 'video_call' NOT NULL,
          scheduled_start timestamp NOT NULL,
          scheduled_end timestamp NOT NULL,
          actual_start timestamp,
          actual_end timestamp,
          session_status varchar(50) DEFAULT 'scheduled' NOT NULL,
          meeting_link varchar(500),
          session_notes text,
          action_items json,
          created_at timestamp DEFAULT now() NOT NULL,
          updated_at timestamp DEFAULT now() NOT NULL,
          FOREIGN KEY (consultation_id) REFERENCES consultations(id),
          FOREIGN KEY (advisor_id) REFERENCES users(id)
        );
      `);

      // Create employee_stats table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS employee_stats (
          id serial PRIMARY KEY NOT NULL,
          employee_id integer NOT NULL,
          month integer NOT NULL,
          year integer NOT NULL,
          total_consultations integer DEFAULT 0,
          completed_consultations integer DEFAULT 0,
          pending_consultations integer DEFAULT 0,
          cancelled_consultations integer DEFAULT 0,
          total_revenue numeric(12,2) DEFAULT '0',
          average_satisfaction_rating numeric(3,2),
          total_hours_worked numeric(8,2) DEFAULT '0',
          follow_ups_completed integer DEFAULT 0,
          new_client_acquisitions integer DEFAULT 0,
          created_at timestamp DEFAULT now() NOT NULL,
          updated_at timestamp DEFAULT now() NOT NULL,
          FOREIGN KEY (employee_id) REFERENCES users(id)
        );
      `);

      console.log('✓ Database tables created successfully');
    } catch (error) {
      console.log('Note: Some tables might already exist, continuing...');
    }

    // Check if admin user exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, DEFAULT_ADMIN.email))
      .limit(1);

    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await hashPassword(DEFAULT_ADMIN.password);
      
      const newAdmin = await db
        .insert(users)
        .values({
          username: DEFAULT_ADMIN.username,
          email: DEFAULT_ADMIN.email,
          password_hash: hashedPassword,
          first_name: DEFAULT_ADMIN.first_name,
          last_name: DEFAULT_ADMIN.last_name,
          role: DEFAULT_ADMIN.role,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      console.log('✓ Admin user created successfully');
      console.log('Admin credentials:');
      console.log(`  Email: ${DEFAULT_ADMIN.email}`);
      console.log(`  Password: ${DEFAULT_ADMIN.password}`);
      console.log('  Please change the password after first login!');
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('\n✓ Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Login as admin with the credentials above');
    console.log('3. Create employee accounts through the admin interface');
    console.log('4. Employees can then log in and manage their consultations');

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { setupDatabase };
