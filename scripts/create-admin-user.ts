import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Generate a secure password
    const plainPassword = 'Admin123!@#';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@cfo.com'))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: admin@cfo.com`);
      console.log(`   ID: ${existingAdmin[0].id}`);
      console.log(`   Role: ${existingAdmin[0].role}`);
      console.log('   Password: Admin123!@# (if not changed)');
      return existingAdmin[0];
    }
    
    // Create the admin user
    const adminUser = await db.insert(users).values({
      name: 'System Administrator',
      email: 'admin@cfo.com',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '+1-555-ADMIN',
      location: 'System',
      consultations_count: 0,
      total_spent: '0',
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('========================');
    console.log(`   User ID: ${adminUser[0].id}`);
    console.log(`   Email: ${adminUser[0].email}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Role: ${adminUser[0].role}`);
    console.log('========================');
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    
    return adminUser[0];
    
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
