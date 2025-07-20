const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://neondb_owner:npg_8Lljmywe1hAS@ep-fragrant-voice-a1bqfkk2-pooler.ap-southeast-1.aws.neon.tech/cfo?sslmode=require&channel_binding=require';

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@privatecfo.com',
  password: 'admin123',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin'
};

async function setupDatabase() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log('Setting up database...');
    
    // Create enums if they don't exist
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."consultation_status" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rescheduled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."consultation_type" AS ENUM('initial', 'follow_up', 'emergency', 'regular');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
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
        await pool.query(`ALTER TABLE consultations ADD COLUMN IF NOT EXISTS ${column};`);
      } catch (error) {
        console.log(`Column might already exist: ${column}`);
      }
    }

    // Create consultation_notes table
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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

    // Check if admin user exists
    const existingAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [DEFAULT_ADMIN.email]
    );

    if (existingAdmin.rows.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      
      await pool.query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        DEFAULT_ADMIN.username,
        DEFAULT_ADMIN.email,
        hashedPassword,
        DEFAULT_ADMIN.first_name,
        DEFAULT_ADMIN.last_name,
        DEFAULT_ADMIN.role,
        true,
        new Date(),
        new Date()
      ]);

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
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();
