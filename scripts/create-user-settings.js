const { Pool } = require('pg');

async function createUserSettings() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        email_notifications BOOLEAN DEFAULT true,
        push_notifications BOOLEAN DEFAULT true,
        desktop_notifications BOOLEAN DEFAULT false,
        invoice_reminders BOOLEAN DEFAULT true,
        consultation_alerts BOOLEAN DEFAULT true,
        marketing_emails BOOLEAN DEFAULT false,
        two_factor_enabled BOOLEAN DEFAULT false,
        login_alerts BOOLEAN DEFAULT true,
        session_timeout INTEGER DEFAULT 60,
        theme VARCHAR(20) DEFAULT 'dark',
        language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
        currency VARCHAR(10) DEFAULT 'INR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT user_settings_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ user_settings table created successfully');
  } catch (error) {
    if (error.code === '42P07') {
      console.log('ℹ️ user_settings table already exists');
    } else {
      console.error('❌ Error creating table:', error.message);
    }
  } finally {
    await pool.end();
  }
}

createUserSettings();
