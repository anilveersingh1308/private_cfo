import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { 
  users, 
  consultations, 
  newsletterSubscribers, 
  adminSettings,
  invoices,
  consultationNotes,
  systemLogs
} from '../lib/schema';

// Load environment variables
config({ path: '.env.local' });

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - comment out if you want to preserve existing data)
    console.log('🧹 Clearing existing data...');
    await db.delete(systemLogs);
    await db.delete(consultationNotes);
    await db.delete(invoices);
    await db.delete(newsletterSubscribers);
    await db.delete(consultations);
    await db.delete(adminSettings);
    await db.delete(users);

    // Seed Users
    console.log('👥 Seeding users...');
    const seedUsers = await db.insert(users).values([
      {
        name: 'Admin User',
        email: 'admin@privatecfo.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
        role: 'admin',
        status: 'active',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        consultations_count: 0,
        total_spent: '0'
      },
      {
        name: 'Dr. Sharma',
        email: 'dr.sharma@privatecfo.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'consultant',
        status: 'active',
        phone: '+91 98765 43213',
        location: 'Delhi, Delhi',
        consultations_count: 127,
        total_spent: '0'
      },
      {
        name: 'CA Verma',
        email: 'ca.verma@privatecfo.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'consultant',
        status: 'active',
        phone: '+91 98765 43214',
        location: 'Bangalore, Karnataka',
        consultations_count: 89,
        total_spent: '0'
      },
      {
        name: 'Mr. Gupta',
        email: 'mr.gupta@privatecfo.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'consultant',
        status: 'active',
        phone: '+91 98765 43215',
        location: 'Chennai, Tamil Nadu',
        consultations_count: 156,
        total_spent: '0'
      },
      {
        name: 'Mr. Agarwal',
        email: 'mr.agarwal@privatecfo.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'consultant',
        status: 'active',
        phone: '+91 98765 43216',
        location: 'Pune, Maharashtra',
        consultations_count: 78,
        total_spent: '0'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        status: 'active',
        phone: '+91 98765 43211',
        location: 'Delhi, Delhi',
        consultations_count: 3,
        total_spent: '15000'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        status: 'active',
        phone: '+91 98765 43212',
        location: 'Bangalore, Karnataka',
        consultations_count: 5,
        total_spent: '25000'
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@email.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        status: 'pending',
        phone: '+91 98765 43217',
        location: 'Pune, Maharashtra',
        consultations_count: 0,
        total_spent: '0'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        status: 'inactive',
        phone: '+91 98765 43218',
        location: 'Kolkata, West Bengal',
        consultations_count: 2,
        total_spent: '8000'
      }
    ]).returning();

    console.log(`✅ Created ${seedUsers.length} users`);

    // Seed Consultations
    console.log('📅 Seeding consultations...');
    const now = new Date();
    const seedConsultations = await db.insert(consultations).values([
      {
        client_name: 'Rajesh Kumar',
        client_email: 'rajesh.kumar@email.com',
        service_type: 'Financial Planning',
        status: 'scheduled',
        scheduled_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60,
        amount: '5000',
        payment_status: 'paid',
        consultant: 'Dr. Sharma',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        notes: 'Initial financial planning consultation'
      },
      {
        client_name: 'Priya Patel',
        client_email: 'priya.patel@email.com',
        service_type: 'Tax Consulting',
        status: 'completed',
        scheduled_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        duration: 45,
        amount: '3500',
        payment_status: 'paid',
        consultant: 'CA Verma',
        notes: 'Discussed tax optimization strategies for FY 2024-25'
      },
      {
        client_name: 'Amit Singh',
        client_email: 'amit.singh@email.com',
        service_type: 'Investment Advice',
        status: 'ongoing',
        scheduled_date: now,
        duration: 90,
        amount: '7500',
        payment_status: 'paid',
        consultant: 'Mr. Gupta',
        meeting_link: 'https://zoom.us/j/123456789',
        notes: 'Investment portfolio review'
      },
      {
        client_name: 'Sneha Reddy',
        client_email: 'sneha.reddy@email.com',
        service_type: 'Retirement Planning',
        status: 'pending',
        scheduled_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        duration: 60,
        amount: '4500',
        payment_status: 'pending',
        consultant: 'Dr. Sharma'
      },
      {
        client_name: 'Vikram Joshi',
        client_email: 'vikram.joshi@email.com',
        service_type: 'Business Consulting',
        status: 'cancelled',
        scheduled_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 120,
        amount: '10000',
        payment_status: 'failed',
        consultant: 'Mr. Agarwal',
        notes: 'Client requested cancellation due to scheduling conflict'
      },
      {
        client_name: 'Ananya Gupta',
        client_email: 'ananya.gupta@email.com',
        service_type: 'Financial Planning',
        status: 'completed',
        scheduled_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        duration: 75,
        amount: '6000',
        payment_status: 'paid',
        consultant: 'Dr. Sharma',
        notes: 'Complete financial health checkup'
      },
      {
        client_name: 'Rohit Mehta',
        client_email: 'rohit.mehta@email.com',
        service_type: 'Investment Advice',
        status: 'scheduled',
        scheduled_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        duration: 60,
        amount: '5500',
        payment_status: 'pending',
        consultant: 'Mr. Gupta'
      }
    ]).returning();

    console.log(`✅ Created ${seedConsultations.length} consultations`);

    // Seed Newsletter Subscribers
    console.log('📧 Seeding newsletter subscribers...');
    const seedSubscribers = await db.insert(newsletterSubscribers).values([
      {
        email: 'subscriber1@example.com',
        categories: ['Financial Planning', 'Tax Consulting'],
        status: 'active',
        engagement_score: 85,
        source: 'Website',
        total_emails_sent: 24,
        last_email_opened: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'subscriber2@example.com',
        categories: ['Investment Advice'],
        status: 'active',
        engagement_score: 92,
        source: 'Social Media',
        total_emails_sent: 18,
        last_email_opened: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'subscriber3@example.com',
        categories: ['Retirement Planning', 'Financial Planning'],
        status: 'unsubscribed',
        engagement_score: 45,
        source: 'Referral',
        total_emails_sent: 32,
        last_email_opened: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'subscriber4@example.com',
        categories: ['Tax Consulting', 'Investment Advice'],
        status: 'bounced',
        engagement_score: 12,
        source: 'Newsletter',
        total_emails_sent: 15,
        last_email_opened: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        email: 'subscriber5@example.com',
        categories: ['Business Consulting'],
        status: 'pending',
        engagement_score: 0,
        source: 'Website',
        total_emails_sent: 1
      },
      {
        email: 'finance.enthusiast@email.com',
        categories: ['Financial Planning', 'Investment Advice', 'Retirement Planning'],
        status: 'active',
        engagement_score: 78,
        source: 'Website',
        total_emails_sent: 42,
        last_email_opened: new Date(now.getTime() - 1 * 60 * 60 * 1000)
      }
    ]).returning();

    console.log(`✅ Created ${seedSubscribers.length} newsletter subscribers`);

    // Seed Admin Settings
    console.log('⚙️ Seeding admin settings...');
    const seedSettings = await db.insert(adminSettings).values([
      {
        setting_key: 'site_name',
        setting_value: 'Private CFO',
        description: 'Website name',
        is_public: true
      },
      {
        setting_key: 'contact_email',
        setting_value: 'admin@privatecfo.com',
        description: 'Contact email address',
        is_public: true
      },
      {
        setting_key: 'default_consultation_fee',
        setting_value: 5000,
        description: 'Default consultation fee in INR',
        is_public: false
      },
      {
        setting_key: 'max_consultations_per_day',
        setting_value: 10,
        description: 'Maximum consultations per consultant per day',
        is_public: false
      },
      {
        setting_key: 'newsletter_from_email',
        setting_value: 'newsletter@privatecfo.com',
        description: 'Newsletter sender email',
        is_public: false
      },
      {
        setting_key: 'business_hours_start',
        setting_value: '09:00',
        description: 'Business hours start time',
        is_public: true
      },
      {
        setting_key: 'business_hours_end',
        setting_value: '18:00',
        description: 'Business hours end time',
        is_public: true
      },
      {
        setting_key: 'timezone',
        setting_value: 'Asia/Kolkata',
        description: 'Default timezone',
        is_public: true
      }
    ]).returning();

    console.log(`✅ Created ${seedSettings.length} admin settings`);

    // Seed Sample Invoices
    console.log('🧾 Seeding invoices...');
    const seedInvoices = await db.insert(invoices).values([
      {
        consultation_id: seedConsultations[0].id,
        invoice_number: 'INV-2024-001',
        client_name: 'Rajesh Kumar',
        client_email: 'rajesh.kumar@email.com',
        service_description: 'Financial Planning Consultation - 60 minutes',
        amount: '5000',
        tax_amount: '900',
        total_amount: '5900',
        payment_status: 'paid',
        due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        paid_date: now
      },
      {
        consultation_id: seedConsultations[1].id,
        invoice_number: 'INV-2024-002',
        client_name: 'Priya Patel',
        client_email: 'priya.patel@email.com',
        service_description: 'Tax Consulting - 45 minutes',
        amount: '3500',
        tax_amount: '630',
        total_amount: '4130',
        payment_status: 'paid',
        due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        paid_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        consultation_id: seedConsultations[3].id,
        invoice_number: 'INV-2024-003',
        client_name: 'Sneha Reddy',
        client_email: 'sneha.reddy@email.com',
        service_description: 'Retirement Planning Consultation - 60 minutes',
        amount: '4500',
        tax_amount: '810',
        total_amount: '5310',
        payment_status: 'pending',
        due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      }
    ]).returning();

    console.log(`✅ Created ${seedInvoices.length} invoices`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${seedUsers.length}`);
    console.log(`- Consultations: ${seedConsultations.length}`);
    console.log(`- Newsletter Subscribers: ${seedSubscribers.length}`);
    console.log(`- Admin Settings: ${seedSettings.length}`);
    console.log(`- Invoices: ${seedInvoices.length}`);

    console.log('\n🔐 Default Admin Credentials:');
    console.log('Email: admin@privatecfo.com');
    console.log('Password: password');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
