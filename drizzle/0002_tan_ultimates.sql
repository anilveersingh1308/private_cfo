-- Enhanced consultation tracking features migration

-- Create new enums that don't exist yet
DO $$ BEGIN
 CREATE TYPE "public"."consultation_status" AS ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rescheduled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."consultation_type" AS ENUM('initial', 'follow_up', 'emergency', 'regular');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high', 'urgent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add new columns to consultations table
ALTER TABLE "consultations" 
ADD COLUMN IF NOT EXISTS "consultation_type" "consultation_type" DEFAULT 'initial',
ADD COLUMN IF NOT EXISTS "priority" "priority" DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS "scheduled_date" timestamp,
ADD COLUMN IF NOT EXISTS "completed_date" timestamp,
ADD COLUMN IF NOT EXISTS "estimated_duration" integer,
ADD COLUMN IF NOT EXISTS "actual_duration" integer,
ADD COLUMN IF NOT EXISTS "consultation_fee" numeric(10,2),
ADD COLUMN IF NOT EXISTS "client_satisfaction_rating" integer,
ADD COLUMN IF NOT EXISTS "advisor_notes" text,
ADD COLUMN IF NOT EXISTS "follow_up_required" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "follow_up_date" timestamp;

-- Create consultation_notes table
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

-- Create consultation_sessions table
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

-- Create employee_stats table
CREATE TABLE IF NOT EXISTS "employee_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"total_consultations" integer DEFAULT 0,
	"completed_consultations" integer DEFAULT 0,
	"pending_consultations" integer DEFAULT 0,
	"cancelled_consultations" integer DEFAULT 0,
	"total_revenue" numeric(12,2) DEFAULT '0',
	"average_satisfaction_rating" numeric(3,2),
	"total_hours_worked" numeric(8,2) DEFAULT '0',
	"follow_ups_completed" integer DEFAULT 0,
	"new_client_acquisitions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_notes" ADD CONSTRAINT "consultation_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_advisor_id_users_id_fk" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "employee_stats" ADD CONSTRAINT "employee_stats_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;