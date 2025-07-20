import { pgTable, serial, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

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
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;
