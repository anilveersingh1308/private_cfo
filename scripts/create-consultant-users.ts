import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateUniqueUsername } from '../lib/username-utils';

const consultantData = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@cfo.com',
    phone: '+1-555-0101',
    location: 'New York, NY',
    specialization: 'Financial Planning'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@cfo.com',
    phone: '+1-555-0102',
    location: 'San Francisco, CA',
    specialization: 'Tax Consulting'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@cfo.com',
    phone: '+1-555-0103',
    location: 'Chicago, IL',
    specialization: 'Investment Advisory'
  },
  {
    name: 'David Thompson',
    email: 'david.thompson@cfo.com',
    phone: '+1-555-0104',
    location: 'Austin, TX',
    specialization: 'Business Strategy'
  },
  {
    name: 'Jennifer Liu',
    email: 'jennifer.liu@cfo.com',
    phone: '+1-555-0105',
    location: 'Seattle, WA',
    specialization: 'Risk Management'
  }
];

async function createConsultantUsers() {
  try {
    console.log('👥 Creating consultant users...');
    
    const defaultPassword = 'Consultant123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    
    // Get existing usernames
    const existingUsernames = await db
      .select({ username: users.username })
      .from(users);
    
    const existingUsernameSet = new Set(existingUsernames.map(u => u.username));
    
    const createdConsultants = [];
    
    for (const consultant of consultantData) {
      // Check if consultant already exists
      const existingConsultant = await db
        .select()
        .from(users)
        .where(eq(users.email, consultant.email))
        .limit(1);
      
      if (existingConsultant.length > 0) {
        console.log(`⚠️  Consultant ${consultant.name} already exists (${consultant.email})`);
        createdConsultants.push(existingConsultant[0]);
        continue;
      }
      
      // Generate unique username
      const username = generateUniqueUsername(consultant.name, Array.from(existingUsernameSet));
      existingUsernameSet.add(username);
      
      // Create the consultant user
      const consultantUser = await db.insert(users).values({
        name: consultant.name,
        username,
        email: consultant.email,
        password_hash: hashedPassword,
        role: 'consultant',
        status: 'active',
        phone: consultant.phone,
        location: consultant.location,
        consultations_count: 0,
        total_spent: '0',
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();
      
      console.log(`✅ Created consultant: ${consultant.name} (${consultant.email})`);
      createdConsultants.push(consultantUser[0]);
    }
    
    console.log('');
    console.log('🔑 CONSULTANT LOGIN CREDENTIALS:');
    console.log('=================================');
    console.log(`   Default Password: ${defaultPassword}`);
    console.log('');
    console.log('📋 Created Consultants:');
    createdConsultants.forEach((consultant, index) => {
      console.log(`   ${index + 1}. ${consultant.name}`);
      console.log(`      Email: ${consultant.email}`);
      console.log(`      Username: ${consultant.username}`);
      console.log(`      Role: ${consultant.role}`);
      console.log(`      Phone: ${consultant.phone}`);
      console.log(`      Location: ${consultant.location}`);
      console.log('');
    });
    console.log('=================================');
    console.log('');
    console.log('⚠️  IMPORTANT: Please ask consultants to change their passwords after first login!');
    
    return createdConsultants;
    
  } catch (error) {
    console.error('❌ Error creating consultant users:', error);
    throw error;
  }
}

// Run the operation
createConsultantUsers()
  .then((consultants) => {
    console.log(`\n✨ Consultant users setup completed successfully! Created ${consultants.length} consultant(s).`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Consultant users creation failed:', error);
    process.exit(1);
  });
