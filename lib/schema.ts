import { pgTable, serial, varchar, text, boolean, timestamp, integer, pgEnum, decimal, json } from 'drizzle-orm/pg-core';

// Define enums for better type safety
export const userRoleEnum = pgEnum('user_role', ['admin', 'financial_advisor', 'tax_consultant', 'investment_advisor', 'business_consultant']);
export const consultationStatusEnum = pgEnum('consultation_status', ['pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rescheduled']);
export const consultationTypeEnum = pgEnum('consultation_type', ['initial', 'follow_up', 'emergency', 'regular']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

// Users table for authentication and role management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('financial_advisor'),
  first_name: varchar('first_name', { length: 100 }),
  last_name: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 30 }),
  specialization: varchar('specialization', { length: 255 }), // e.g., "Corporate Finance", "Personal Tax", etc.
  experience_years: integer('experience_years'),
  bio: text('bio'),
  is_active: boolean('is_active').notNull().default(true),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const consultations = pgTable('consultations', {
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
  assigned_to: integer('assigned_to').references(() => users.id), // Link to CFO provider
  status: consultationStatusEnum('status').notNull().default('pending'),
  consultation_type: consultationTypeEnum('consultation_type').default('initial'),
  priority: priorityEnum('priority').default('medium'),
  scheduled_date: timestamp('scheduled_date'),
  completed_date: timestamp('completed_date'),
  estimated_duration: integer('estimated_duration'), // in minutes
  actual_duration: integer('actual_duration'), // in minutes
  consultation_fee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  client_satisfaction_rating: integer('client_satisfaction_rating'), // 1-5 scale
  advisor_notes: text('advisor_notes'),
  follow_up_required: boolean('follow_up_required').default(false),
  follow_up_date: timestamp('follow_up_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Consultation notes/updates table for tracking consultation progress
export const consultationNotes = pgTable('consultation_notes', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id).notNull(),
  author_id: integer('author_id').references(() => users.id).notNull(),
  note_type: varchar('note_type', { length: 50 }).notNull().default('general'), // general, meeting, follow_up, resolution
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  is_private: boolean('is_private').default(false), // Only visible to advisor/admin
  attachments: json('attachments'), // Store file references as JSON
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Track consultation sessions/meetings
export const consultationSessions = pgTable('consultation_sessions', {
  id: serial('id').primaryKey(),
  consultation_id: integer('consultation_id').references(() => consultations.id).notNull(),
  advisor_id: integer('advisor_id').references(() => users.id).notNull(),
  session_type: varchar('session_type', { length: 50 }).notNull().default('video_call'), // video_call, phone_call, in_person, email
  scheduled_start: timestamp('scheduled_start').notNull(),
  scheduled_end: timestamp('scheduled_end').notNull(),
  actual_start: timestamp('actual_start'),
  actual_end: timestamp('actual_end'),
  session_status: varchar('session_status', { length: 50 }).notNull().default('scheduled'), // scheduled, completed, cancelled, no_show
  meeting_link: varchar('meeting_link', { length: 500 }),
  session_notes: text('session_notes'),
  action_items: json('action_items'), // Store action items as JSON array
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Employee performance and statistics
export const employeeStats = pgTable('employee_stats', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => users.id).notNull(),
  month: integer('month').notNull(), // 1-12
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;
export type ConsultationNote = typeof consultationNotes.$inferSelect;
export type NewConsultationNote = typeof consultationNotes.$inferInsert;
export type ConsultationSession = typeof consultationSessions.$inferSelect;
export type NewConsultationSession = typeof consultationSessions.$inferInsert;
export type EmployeeStats = typeof employeeStats.$inferSelect;
export type NewEmployeeStats = typeof employeeStats.$inferInsert;
