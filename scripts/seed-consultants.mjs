import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '../lib/schema.ts';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seedConsultants() {
  try {
    console.log('🌱 Seeding consultant users...');

    // Sample consultant data
    const consultants = [
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@cfoadvisory.com',
        password_hash: '$2b$10$hashedPassword1', // In real app, properly hash passwords
        role: 'consultant',
        status: 'active',
        phone: '+91-9876543210',
        location: 'Mumbai, Maharashtra'
      },
      {
        name: 'CA Priya Verma',
        email: 'ca.verma@cfoadvisory.com',
        password_hash: '$2b$10$hashedPassword2',
        role: 'consultant',
        status: 'active',
        phone: '+91-9876543211',
        location: 'Delhi, NCR'
      },
      {
        name: 'Mr. Amit Gupta',
        email: 'amit.gupta@cfoadvisory.com',
        password_hash: '$2b$10$hashedPassword3',
        role: 'consultant',
        status: 'active',
        phone: '+91-9876543212',
        location: 'Bangalore, Karnataka'
      },
      {
        name: 'Mrs. Sunita Agarwal',
        email: 'sunita.agarwal@cfoadvisory.com',
        password_hash: '$2b$10$hashedPassword4',
        role: 'consultant',
        status: 'active',
        phone: '+91-9876543213',
        location: 'Pune, Maharashtra'
      },
      {
        name: 'Mr. Vikram Singh',
        email: 'vikram.singh@cfoadvisory.com',
        password_hash: '$2b$10$hashedPassword5',
        role: 'consultant',
        status: 'active',
        phone: '+91-9876543214',
        location: 'Chennai, Tamil Nadu'
      }
    ];

    // Insert consultants
    for (const consultant of consultants) {
      try {
        await db.insert(users).values(consultant);
        console.log(`✅ Added consultant: ${consultant.name}`);
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.log(`⏭️  Consultant already exists: ${consultant.name}`);
        } else {
          console.error(`❌ Error adding ${consultant.name}:`, error);
        }
      }
    }

    console.log('🎉 Consultant seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding consultants:', error);
    process.exit(1);
  }
}

// Run the seeding
if (process.env.NODE_ENV !== 'production') {
  seedConsultants();
}

export { seedConsultants };
