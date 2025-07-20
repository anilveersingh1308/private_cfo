-- Admin Dashboard Tables Migration
-- This migration creates comprehensive tables for the admin dashboard functionality

-- Create updated enums
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('admin', 'consultant', 'moderator', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "user_status" AS ENUM('active', 'inactive', 'pending', 'suspended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "consultation_status" AS ENUM('scheduled', 'ongoing', 'completed', 'pending', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('paid', 'pending', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "subscriber_status" AS ENUM('active', 'unsubscribed', 'bounced', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS "employee_stats" CASCADE;
DROP TABLE IF EXISTS "consultation_sessions" CASCADE;
DROP TABLE IF EXISTS "consultation_notes" CASCADE;
DROP TABLE IF EXISTS "consultations" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create enhanced users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"phone" varchar(30),
	"location" varchar(255),
	"consultations_count" integer DEFAULT 0,
	"total_spent" numeric(12, 2) DEFAULT '0',
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create enhanced consultations table
CREATE TABLE IF NOT EXISTS "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"service_type" varchar(255) NOT NULL,
	"status" "consultation_status" DEFAULT 'scheduled' NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"duration" integer DEFAULT 60 NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"consultant" varchar(255),
	"meeting_link" varchar(500),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"categories" json,
	"status" "subscriber_status" DEFAULT 'active' NOT NULL,
	"engagement_score" integer DEFAULT 0,
	"source" varchar(100),
	"total_emails_sent" integer DEFAULT 0,
	"last_email_opened" timestamp,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);

-- Create admin settings table
CREATE TABLE IF NOT EXISTS "admin_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"setting_key" varchar(100) NOT NULL,
	"setting_value" json,
	"description" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_settings_setting_key_unique" UNIQUE("setting_key")
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer,
	"invoice_number" varchar(50) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"service_description" text,
	"amount" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"paid_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);

-- Create dashboard analytics table
CREATE TABLE IF NOT EXISTS "dashboard_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_value" numeric(15, 2) NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" varchar(255) NOT NULL,
	"table_name" varchar(100),
	"record_id" integer,
	"old_values" json,
	"new_values" json,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create legacy consultation forms table (for backward compatibility)
CREATE TABLE IF NOT EXISTS "consultation_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"country_code" varchar(10) DEFAULT '+91' NOT NULL,
	"age" varchar(10),
	"city" varchar(255) NOT NULL,
	"occupation" varchar(255) NOT NULL,
	"guidance" varchar(255),
	"industry" varchar(255),
	"income" varchar(255),
	"preferred_communication" varchar(100),
	"consultation_timing" varchar(100),
	"email" varchar(255) NOT NULL,
	"message" text,
	"privacy" boolean DEFAULT false NOT NULL,
	"not_job" boolean DEFAULT false NOT NULL,
	"marketing_consent" boolean DEFAULT false,
	"assigned_to" integer,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create consultation notes table
CREATE TABLE IF NOT EXISTS "consultation_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"note_type" varchar(50) DEFAULT 'general' NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"is_private" boolean DEFAULT false,
	"attachments" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create consultation sessions table
CREATE TABLE IF NOT EXISTS "consultation_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" integer NOT NULL,
	"advisor_id" integer NOT NULL,
	"session_type" varchar(50) DEFAULT 'video_call' NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"actual_start" timestamp,
	"actual_end" timestamp,
	"session_status" varchar(50) DEFAULT 'scheduled' NOT NULL,
	"meeting_link" varchar(500),
	"session_notes" text,
	"action_items" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create employee stats table
CREATE TABLE IF NOT EXISTS "employee_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"total_consultations" integer DEFAULT 0,
	"completed_consultations" integer DEFAULT 0,
	"pending_consultations" integer DEFAULT 0,
	"cancelled_consultations" integer DEFAULT 0,
	"total_revenue" numeric(12, 2) DEFAULT '0',
	"average_satisfaction_rating" numeric(3, 2),
	"total_hours_worked" numeric(8, 2) DEFAULT '0',
	"follow_ups_completed" integer DEFAULT 0,
	"new_client_acquisitions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_forms" ADD CONSTRAINT "consultation_forms_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_stats" ADD CONSTRAINT "employee_stats_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Insert sample admin user
INSERT INTO "users" ("name", "email", "password_hash", "role", "status", "phone", "location", "consultations_count", "total_spent") VALUES
('Admin User', 'admin@privatecfo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', '+91 98765 43210', 'Mumbai, Maharashtra', 0, 0)
ON CONFLICT (email) DO NOTHING;

-- Insert sample consultants
INSERT INTO "users" ("name", "email", "password_hash", "role", "status", "phone", "location", "consultations_count", "total_spent") VALUES
('Dr. Sharma', 'dr.sharma@privatecfo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'consultant', 'active', '+91 98765 43213', 'Delhi, Delhi', 127, 0),
('CA Verma', 'ca.verma@privatecfo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'consultant', 'active', '+91 98765 43214', 'Bangalore, Karnataka', 89, 0),
('Mr. Gupta', 'mr.gupta@privatecfo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'consultant', 'active', '+91 98765 43215', 'Chennai, Tamil Nadu', 156, 0),
('Mr. Agarwal', 'mr.agarwal@privatecfo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'consultant', 'active', '+91 98765 43216', 'Pune, Maharashtra', 78, 0)
ON CONFLICT (email) DO NOTHING;

-- Insert sample users
INSERT INTO "users" ("name", "email", "password_hash", "role", "status", "phone", "location", "consultations_count", "total_spent") VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active', '+91 98765 43211', 'Delhi, Delhi', 3, 15000),
('Priya Sharma', 'priya.sharma@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'active', '+91 98765 43212', 'Bangalore, Karnataka', 5, 25000),
('Sneha Patel', 'sneha.patel@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', '+91 98765 43217', 'Pune, Maharashtra', 0, 0),
('Vikram Singh', 'vikram.singh@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'inactive', '+91 98765 43218', 'Kolkata, West Bengal', 2, 8000)
ON CONFLICT (email) DO NOTHING;

-- Insert sample consultations
INSERT INTO "consultations" ("client_name", "client_email", "service_type", "status", "scheduled_date", "duration", "amount", "payment_status", "consultant", "meeting_link", "notes") VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', 'Financial Planning', 'scheduled', NOW() + INTERVAL '2 days', 60, 5000, 'paid', 'Dr. Sharma', 'https://meet.google.com/abc-defg-hij', 'Initial financial planning consultation'),
('Priya Patel', 'priya.patel@email.com', 'Tax Consulting', 'completed', NOW() - INTERVAL '1 day', 45, 3500, 'paid', 'CA Verma', NULL, 'Discussed tax optimization strategies for FY 2024-25'),
('Amit Singh', 'amit.singh@email.com', 'Investment Advice', 'ongoing', NOW(), 90, 7500, 'paid', 'Mr. Gupta', 'https://zoom.us/j/123456789', 'Investment portfolio review'),
('Sneha Reddy', 'sneha.reddy@email.com', 'Retirement Planning', 'pending', NOW() + INTERVAL '1 day', 60, 4500, 'pending', 'Dr. Sharma', NULL, NULL),
('Vikram Joshi', 'vikram.joshi@email.com', 'Business Consulting', 'cancelled', NOW() - INTERVAL '2 days', 120, 10000, 'failed', 'Mr. Agarwal', NULL, 'Client requested cancellation due to scheduling conflict');

-- Insert sample newsletter subscribers
INSERT INTO "newsletter_subscribers" ("email", "categories", "status", "engagement_score", "source", "total_emails_sent", "last_email_opened") VALUES
('subscriber1@example.com', '["Financial Planning", "Tax Consulting"]', 'active', 85, 'Website', 24, NOW() - INTERVAL '2 days'),
('subscriber2@example.com', '["Investment Advice"]', 'active', 92, 'Social Media', 18, NOW() - INTERVAL '1 day'),
('subscriber3@example.com', '["Retirement Planning", "Financial Planning"]', 'unsubscribed', 45, 'Referral', 32, NOW() - INTERVAL '10 days'),
('subscriber4@example.com', '["Tax Consulting", "Investment Advice"]', 'bounced', 12, 'Newsletter', 15, NOW() - INTERVAL '25 days'),
('subscriber5@example.com', '["Business Consulting"]', 'pending', 0, 'Website', 1, NULL);

-- Insert sample admin settings
INSERT INTO "admin_settings" ("setting_key", "setting_value", "description", "is_public") VALUES
('site_name', '"Private CFO"', 'Website name', true),
('contact_email', '"admin@privatecfo.com"', 'Contact email address', true),
('default_consultation_fee', '5000', 'Default consultation fee in INR', false),
('max_consultations_per_day', '10', 'Maximum consultations per consultant per day', false),
('newsletter_from_email', '"newsletter@privatecfo.com"', 'Newsletter sender email', false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" ("status");
CREATE INDEX IF NOT EXISTS "idx_consultations_status" ON "consultations" ("status");
CREATE INDEX IF NOT EXISTS "idx_consultations_scheduled_date" ON "consultations" ("scheduled_date");
CREATE INDEX IF NOT EXISTS "idx_consultations_payment_status" ON "consultations" ("payment_status");
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscribers_status" ON "newsletter_subscribers" ("status");
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscribers_email" ON "newsletter_subscribers" ("email");
CREATE INDEX IF NOT EXISTS "idx_system_logs_user_id" ON "system_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_system_logs_created_at" ON "system_logs" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_dashboard_analytics_metric_name" ON "dashboard_analytics" ("metric_name");
CREATE INDEX IF NOT EXISTS "idx_dashboard_analytics_period" ON "dashboard_analytics" ("period_start", "period_end");
