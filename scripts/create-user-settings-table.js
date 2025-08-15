const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

async function createUserSettingsTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync(
      path.join(__dirname, 'create-user-settings-table.sql'), 
      'utf8'
    );
    
    console.log('Executing SQL...');
    await client.query(sqlContent);
    
    console.log('✅ User settings table created successfully!');
    
    client.release();
  } catch (error) {
    console.error('❌ Error creating user settings table:', error);
  } finally {
    await pool.end();
  }
}

createUserSettingsTable();
