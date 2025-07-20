CREATE TYPE "public"."consultation_status" AS ENUM('scheduled', 'ongoing', 'completed', 'pending', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'pending', 'failed');--> statement-breakpoint
CREATE TYPE "public"."subscriber_status" AS ENUM('active', 'unsubscribed', 'bounced', 'pending');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'pending', 'suspended');--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"setting_key" varchar(100) NOT NULL,
	"setting_value" json,
	"description" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "consultation_forms" (
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
--> statement-breakpoint
CREATE TABLE "consultation_notes" (
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
--> statement-breakpoint
CREATE TABLE "consultation_sessions" (
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
--> statement-breakpoint
CREATE TABLE "dashboard_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_value" numeric(15, 2) NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_stats" (
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
--> statement-breakpoint
CREATE TABLE "invoices" (
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
--> statement-breakpoint
CREATE TABLE "system_logs" (
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
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_assigned_to_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'consultant', 'moderator', 'user');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "status" SET DEFAULT 'scheduled'::"public"."consultation_status";--> statement-breakpoint
ALTER TABLE "consultations" ALTER COLUMN "status" SET DATA TYPE "public"."consultation_status" USING "status"::"public"."consultation_status";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ALTER COLUMN "source" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "client_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "client_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "service_type" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "scheduled_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "duration" integer DEFAULT 60 NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "amount" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "consultant" varchar(255);--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "meeting_link" varchar(500);--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "categories" json;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "status" "subscriber_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "engagement_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "total_emails_sent" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "last_email_opened" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "consultations_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_spent" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "consultation_forms" ADD CONSTRAINT "consultation_forms_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_stats" ADD CONSTRAINT "employee_stats_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "country_code";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "occupation";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "guidance";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "industry";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "income";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "preferred_communication";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "consultation_timing";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "message";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "privacy";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "not_job";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "marketing_consent";--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "assigned_to";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" DROP COLUMN "interests";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" DROP COLUMN "last_email_sent";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "specialization";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "experience_years";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";