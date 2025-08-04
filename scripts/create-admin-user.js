const { config } = require('dotenv');
const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

// Load environment variables
config({ path: '.env.local' });

// Create a simple function to generate username in the required format
function generateUsername(name) {
  // Clean the name: remove spaces, special characters, convert to lowercase
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
  
  // Get current date and time
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const time = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
  
  return `${cleanName}&${date}&${time}`;
}

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Database connection
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Generate a secure password
    const plainPassword = 'Admin123!@#';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    // Generate username
    const username = generateUsername('System Administrator');
    
    // Check if admin user already exists
    const existingAdminQuery = `
      SELECT * FROM users WHERE email = 'admin@cfo.com' LIMIT 1
    `;
    const existingAdmin = await pool.query(existingAdminQuery);
    
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: admin@cfo.com`);
      console.log(`   ID: ${existingAdmin.rows[0].id}`);
      console.log(`   Username: ${existingAdmin.rows[0].username || 'Not set'}`);
      console.log(`   Role: ${existingAdmin.rows[0].role}`);
      console.log('   Password: Admin123!@# (if not changed)');
      await pool.end();
      return existingAdmin.rows[0];
    }
    
    // Create the admin user using raw SQL
    const insertQuery = `
      INSERT INTO users (
        name, username, email, password_hash, role, status, 
        phone, location, consultations_count, total_spent,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
      ) RETURNING *
    `;
    
    const values = [
      'System Administrator',
      username,
      'admin@cfo.com',
      hashedPassword,
      'admin',
      'active',
      '+1-555-ADMIN',
      'System',
      0,
      '0'
    ];
    
    const result = await pool.query(insertQuery, values);
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('========================');
    console.log(`   Email: admin@cfo.com`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Role: admin`);
    console.log('========================');
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    
    await pool.end();
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

// Run the operation
createAdminUser()
  .then((user) => {
    console.log('\n✨ Admin user setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Admin user creation failed:', error);
    process.exit(1);
  });
