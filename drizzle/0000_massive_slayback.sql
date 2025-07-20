CREATE TYPE "public"."user_role" AS ENUM('admin', 'financial_advisor', 'tax_consultant', 'investment_advisor', 'business_consultant');--> statement-breakpoint
CREATE TABLE "consultations" (
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
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'financial_advisor' NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(30),
	"specialization" varchar(255),
	"experience_years" integer,
	"bio" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;