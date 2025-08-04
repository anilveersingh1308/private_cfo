import { pgTable, serial, varchar, text, boolean, timestamp, integer, pgEnum, decimal, json, index, unique } from 'drizzle-orm/pg-core';

// Define enums for better type safety
export const userRoleEnum = pgEnum('user_role', ['admin', 'consultant', 'moderator', 'user']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'pending', 'suspended']);
export const consultationStatusEnum = pgEnum('consultation_status', ['scheduled', 'ongoing', 'completed', 'pending', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'pending', 'failed']);
export const subscriberStatusEnum = pgEnum('subscriber_status', ['active', 'unsubscribed', 'bounced', 'pending']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']);

// Enhanced Users table for admin dashboard
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  status: userStatusEnum('status').notNull().default('active'),
  phone: varchar('phone', { length: 30 }),
  location: varchar('location', { length: 255 }),
  consultations_count: integer('consultations_count').default(0),
  total_spent: decimal('total_spent', { precision: 12, scale: 2 }).default('0'),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Enhanced Consultations table for admin dashboard
export const consultations = pgTable('consultations', {
  id: serial('id').primaryKey(),
  client_name: varchar('client_name', { length: 255 }).notNull(),
  client_email: varchar('client_email', { length: 255 }).notNull(),
  service_type: varchar('service_type', { length: 255 }).notNull(), // Financial Planning, Tax Consulting, etc.
  status: consultationStatusEnum('status').notNull().default('scheduled'),
  scheduled_date: timestamp('scheduled_date').notNull(),
  duration: integer('duration').notNull().default(60), // in minutes
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  payment_status: paymentStatusEnum('payment_status').notNull().default('pending'),
  consultant: varchar('consultant', { length: 255 }),
  meeting_link: varchar('meeting_link', { length: 500 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Newsletter Subscribers table
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  categories: json('categories'), // Array of subscription categories
  status: subscriberStatusEnum('status').notNull().default('active'),
  engagement_score: integer('engagement_score').default(0), // 0-100
  source: varchar('source', { length: 100 }), // Website, Social Media, Referral, etc.
  total_emails_sent: integer('total_emails_sent').default(0),
  last_email_opened: timestamp('last_email_opened'),
  subscribed_at: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribed_at: timestamp('unsubscribed_at'),
});

// Admin Settings table
export const adminSettings = pgTable('admin_settings', {
  id: serial('id').primaryKey(),
  setting_key: varchar('setting_key', { length: 100 }).notNull().unique(),
  setting_value: json('setting_value'),
  description: text('description'),
  is_public: boolean('is_public').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Invoice sequence tracking
export const invoiceSequence = pgTable('invoice_sequence', {
  id: serial('id').primaryKey(),
  current_number: integer('current_number').notNull().default(0),
  year: integer('year').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  yearIndex: index('invoice_sequence_year_idx').on(table.year),
  uniqueYear: unique('invoice_sequence_year_unique').on(table.year)
}));

// Invoices table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id),
  invoice_number: varchar('invoice_number', { length: 50 }).notNull().unique(),
  client_name: varchar('client_name', { length: 255 }).notNull(),
  client_email: varchar('client_email', { length: 255 }).notNull(),
  client_phone: varchar('client_phone', { length: 30 }),
  service_type: varchar('service_type', { length: 255 }).notNull(),
  service_description: text('service_description'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  tax_amount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  payment_status: paymentStatusEnum('payment_status').notNull().default('pending'),
  payment_terms: varchar('payment_terms', { length: 50 }).default('30'),
  payment_method: varchar('payment_method', { length: 100 }),
  due_date: timestamp('due_date').notNull(),
  paid_date: timestamp('paid_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Dashboard Analytics table
export const dashboardAnalytics = pgTable('dashboard_analytics', {
  id: serial('id').primaryKey(),
  metric_name: varchar('metric_name', { length: 100 }).notNull(),
  metric_value: decimal('metric_value', { precision: 15, scale: 2 }).notNull(),
  metric_type: varchar('metric_type', { length: 50 }).notNull(), // revenue, count, percentage, etc.
  period_start: timestamp('period_start').notNull(),
  period_end: timestamp('period_end').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// System Logs table
export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  table_name: varchar('table_name', { length: 100 }),
  record_id: integer('record_id'),
  old_values: json('old_values'),
  new_values: json('new_values'),
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Legacy consultation form table (keeping existing structure for compatibility)
export const consultationForms = pgTable('consultation_forms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  country_code: varchar('country_code', { length: 10 }).notNull().default('+91'),
  age: varchar('age', { length: 10 }),
  city: varchar('city', { length: 255 }).notNull(),
  occupation: varchar('occupation', { length: 255 }).notNull(),
  guidance: varchar('guidance', { length: 255 }),
  industry: varchar('industry', { length: 255 }),
  income: varchar('income', { length: 255 }),
  preferred_communication: varchar('preferred_communication', { length: 100 }),
  consultation_timing: varchar('consultation_timing', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message'),
  privacy: boolean('privacy').notNull().default(false),
  not_job: boolean('not_job').notNull().default(false),
  marketing_consent: boolean('marketing_consent').default(false),
  assigned_to: integer('assigned_to').references(() => users.id),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Consultation notes for detailed tracking
export const consultationNotes = pgTable('consultation_notes', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id).notNull(),
  author_id: integer('author_id').references(() => users.id).notNull(),
  note_type: varchar('note_type', { length: 50 }).notNull().default('general'),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  is_private: boolean('is_private').default(false),
  attachments: json('attachments'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Consultation sessions for meeting tracking
export const consultationSessions = pgTable('consultation_sessions', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id).notNull(),
  advisor_id: integer('advisor_id').references(() => users.id).notNull(),
  session_type: varchar('session_type', { length: 50 }).notNull().default('video_call'),
  scheduled_start: timestamp('scheduled_start').notNull(),
  scheduled_end: timestamp('scheduled_end').notNull(),
  actual_start: timestamp('actual_start'),
  actual_end: timestamp('actual_end'),
  session_status: varchar('session_status', { length: 50 }).notNull().default('scheduled'),
  meeting_link: varchar('meeting_link', { length: 500 }),
  session_notes: text('session_notes'),
  action_items: json('action_items'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Employee statistics for performance tracking
export const employeeStats = pgTable('employee_stats', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => users.id).notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  total_consultations: integer('total_consultations').default(0),
  completed_consultations: integer('completed_consultations').default(0),
  pending_consultations: integer('pending_consultations').default(0),
  cancelled_consultations: integer('cancelled_consultations').default(0),
  total_revenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0'),
  average_satisfaction_rating: decimal('average_satisfaction_rating', { precision: 3, scale: 2 }),
  total_hours_worked: decimal('total_hours_worked', { precision: 8, scale: 2 }).default('0'),
  follow_ups_completed: integer('follow_ups_completed').default(0),
  new_client_acquisitions: integer('new_client_acquisitions').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type NewAdminSetting = typeof adminSettings.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type DashboardAnalytic = typeof dashboardAnalytics.$inferSelect;
export type NewDashboardAnalytic = typeof dashboardAnalytics.$inferInsert;
export type SystemLog = typeof systemLogs.$inferSelect;
export type NewSystemLog = typeof systemLogs.$inferInsert;
export type ConsultationForm = typeof consultationForms.$inferSelect;
export type NewConsultationForm = typeof consultationForms.$inferInsert;
export type ConsultationNote = typeof consultationNotes.$inferSelect;
export type NewConsultationNote = typeof consultationNotes.$inferInsert;
export type ConsultationSession = typeof consultationSessions.$inferSelect;
export type NewConsultationSession = typeof consultationSessions.$inferInsert;
export type EmployeeStats = typeof employeeStats.$inferSelect;
export type NewEmployeeStats = typeof employeeStats.$inferInsert;
export type InvoiceSequence = typeof invoiceSequence.$inferSelect;
export type NewInvoiceSequence = typeof invoiceSequence.$inferInsert;
